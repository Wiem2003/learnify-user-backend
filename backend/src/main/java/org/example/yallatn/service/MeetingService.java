package org.example.yallatn.service;

import org.example.yallatn.dto.MeetingDTO;
import org.example.yallatn.dto.NextMeetingDTO;
import org.example.yallatn.model.Application;
import org.example.yallatn.model.Meeting;
import org.example.yallatn.model.User;
import org.example.yallatn.repository.ApplicationRepository;
import org.example.yallatn.repository.MeetingRepository;
import org.example.yallatn.repository.UserRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class MeetingService {

    private final MeetingRepository meetingRepository;
    private final ApplicationRepository applicationRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public MeetingService(MeetingRepository meetingRepository,
                         ApplicationRepository applicationRepository,
                         UserRepository userRepository,
                         NotificationService notificationService) {
        this.meetingRepository = meetingRepository;
        this.applicationRepository = applicationRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    @Transactional
    public MeetingDTO scheduleMeeting(Long applicationId, Long evaluatorId, LocalDateTime meetingDate) {
        User evaluator = userRepository.findById(evaluatorId)
                .orElseThrow(() -> new RuntimeException("Evaluator not found"));

        Meeting meeting = new Meeting();
        meeting.setAssignedTo(evaluator);
        meeting.setMeetingDate(meetingDate);

        // Application est optionnelle : si fournie, l'associer
        if (applicationId != null) {
            Application application = applicationRepository.findById(applicationId)
                    .orElseThrow(() -> new RuntimeException("Application not found"));
            if (meetingRepository.findByApplicationId(applicationId).isPresent()) {
                throw new RuntimeException("Meeting already scheduled for this application");
            }
            meeting.setApplication(application);
        }

        Meeting saved = meetingRepository.save(meeting);
        String applicationInfo = null;
        if (saved.getApplication() != null && saved.getApplication().getJob() != null) {
            applicationInfo = "Offre: " + saved.getApplication().getJob().getTitre();
        }
        notificationService.notifyMeetingScheduled(evaluator.getId(), saved.getId(), saved.getMeetingDate(), applicationInfo);
        // Notifier aussi l'enseignant (candidat) quand un meeting est programmé pour sa candidature
        if (saved.getApplication() != null && saved.getApplication().getTeacher() != null) {
            Long teacherId = saved.getApplication().getTeacher().getId();
            if (!teacherId.equals(evaluator.getId())) {
                notificationService.notifyTeacherMeetingScheduled(teacherId, saved.getId(), saved.getMeetingDate(), applicationInfo);
            }
        }
        return toDto(saved);
    }

    /** Convertit une entité Meeting en DTO en accédant aux relations lazy dans la même transaction. */
    private MeetingDTO toDto(Meeting m) {
        if (m == null) return null;
        Long applicationId = null;
        String applicationJobTitle = null;
        MeetingDTO.IdRef applicationRef = null;
        if (m.getApplication() != null) {
            applicationId = m.getApplication().getId();
            applicationRef = new MeetingDTO.IdRef(applicationId);
            if (m.getApplication().getJob() != null) {
                applicationJobTitle = m.getApplication().getJob().getTitre();
            }
        }
        Long assignedToId = m.getAssignedTo() != null ? m.getAssignedTo().getId() : null;
        String assignedToName = m.getAssignedTo() != null ? m.getAssignedTo().getName() : null;
        MeetingDTO.UserRef assignedToRef = (assignedToId != null && assignedToName != null)
                ? new MeetingDTO.UserRef(assignedToId, assignedToName) : null;
        return new MeetingDTO(m.getId(), applicationId, applicationJobTitle, applicationRef,
                assignedToId, assignedToName, assignedToRef, m.getMeetingDate(), m.getNotes());
    }

    /** Charge l'entité par id avec toutes les relations (pour sérialisation safe). */
    private Meeting getMeetingByIdEntity(Long id) {
        return meetingRepository.findById(id).orElseThrow(() -> new RuntimeException("Meeting not found"));
    }

    @Transactional(readOnly = true)
    public List<MeetingDTO> getAllMeetings() {
        List<Meeting> list = meetingRepository.findAllWithRelations();
        return list.stream().map(this::toDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public MeetingDTO getMeetingById(Long id) {
        Meeting meeting = getMeetingByIdEntity(id);
        // Forcer le chargement des relations lazy avant conversion
        if (meeting.getApplication() != null) {
            meeting.getApplication().getId();
            if (meeting.getApplication().getJob() != null) meeting.getApplication().getJob().getTitre();
            if (meeting.getApplication().getTeacher() != null) meeting.getApplication().getTeacher().getName();
        }
        if (meeting.getAssignedTo() != null) meeting.getAssignedTo().getName();
        return toDto(meeting);
    }

    @Transactional(readOnly = true)
    public List<MeetingDTO> getMeetingsByEvaluator(Long evaluatorId) {
        List<Meeting> meetings = meetingRepository.findByAssignedToId(evaluatorId);
        return meetings.stream().map(this::toDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public MeetingDTO getMeetingByApplication(Long applicationId) {
        Meeting meeting = meetingRepository.findByApplicationId(applicationId)
                .orElseThrow(() -> new RuntimeException("No meeting found for this application"));
        return toDto(meeting);
    }

    @Transactional
    public MeetingDTO updateMeeting(Long id, LocalDateTime newDate, Long newEvaluatorId, String notes) {
        Meeting meeting = getMeetingByIdEntity(id);
        if (newDate != null) {
            meeting.setMeetingDate(newDate);
        }
        if (newEvaluatorId != null) {
            User evaluator = userRepository.findById(newEvaluatorId)
                    .orElseThrow(() -> new RuntimeException("Evaluator not found"));
            meeting.setAssignedTo(evaluator);
        }
        if (notes != null) {
            meeting.setNotes(notes);
        }
        Meeting saved = meetingRepository.save(meeting);
        if (newEvaluatorId != null) {
            String applicationInfo = null;
            if (saved.getApplication() != null && saved.getApplication().getJob() != null) {
                applicationInfo = "Offre: " + saved.getApplication().getJob().getTitre();
            }
            notificationService.notifyMeetingScheduled(newEvaluatorId, saved.getId(), saved.getMeetingDate(), applicationInfo);
        }
        return getMeetingById(id);
    }

    @Transactional(readOnly = true)
    public Optional<NextMeetingDTO> getNextMeetingForUser(Long userId) {
        List<Meeting> next = meetingRepository.findNextMeetingForUser(userId, LocalDateTime.now(), PageRequest.of(0, 1));
        if (next.isEmpty()) return Optional.empty();
        Meeting m = next.get(0);
        String jobTitle = null;
        Long applicationId = null;
        if (m.getApplication() != null) {
            applicationId = m.getApplication().getId();
            if (m.getApplication().getJob() != null) jobTitle = m.getApplication().getJob().getTitre();
        }
        String assignedName = m.getAssignedTo() != null ? m.getAssignedTo().getName() : null;
        return Optional.of(new NextMeetingDTO(m.getId(), m.getMeetingDate(), jobTitle, applicationId, assignedName));
    }

    @Transactional
    public void deleteMeeting(Long id) {
        if (!meetingRepository.existsById(id)) {
            throw new RuntimeException("Meeting not found");
        }
        meetingRepository.deleteById(id);
    }
}
