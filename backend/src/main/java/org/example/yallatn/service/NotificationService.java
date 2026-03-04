package org.example.yallatn.service;

import org.example.yallatn.dto.NotificationDTO;
import org.example.yallatn.model.*;
import org.example.yallatn.repository.MeetingRepository;
import org.example.yallatn.repository.NotificationRepository;
import org.example.yallatn.repository.UserRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final MeetingRepository meetingRepository;
    private final UserRepository userRepository;

    public NotificationService(NotificationRepository notificationRepository,
                               MeetingRepository meetingRepository,
                               UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.meetingRepository = meetingRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public void notifyMeetingScheduled(Long userId, Long meetingId, LocalDateTime meetingDate, String applicationInfo) {
        Notification n = new Notification();
        n.setUserId(userId);
        n.setType(Notification.NotificationType.MEETING_SCHEDULED);
        n.setTitle("Meeting programmé");
        n.setMessage(applicationInfo != null
                ? "Un entretien a été programmé pour le " + meetingDate + " – " + applicationInfo
                : "Un entretien a été programmé pour le " + meetingDate);
        n.setMeetingId(meetingId);
        n.setRead(false);
        notificationRepository.save(n);
    }

    /** Notification pour l'enseignant (candidat) : sa candidature a été acceptée et un entretien est programmé. */
    @Transactional
    public void notifyTeacherMeetingScheduled(Long teacherId, Long meetingId, LocalDateTime meetingDate, String applicationInfo) {
        Notification n = new Notification();
        n.setUserId(teacherId);
        n.setType(Notification.NotificationType.MEETING_SCHEDULED);
        n.setTitle("Entretien programmé – Candidature acceptée");
        n.setMessage(applicationInfo != null
                ? "Votre candidature a été acceptée. Votre entretien est programmé le " + meetingDate + " – " + applicationInfo
                : "Votre candidature a été acceptée. Votre entretien est programmé le " + meetingDate);
        n.setMeetingId(meetingId);
        n.setRead(false);
        notificationRepository.save(n);
    }

    /**
     * Notification envoyée aux administrateurs lorsqu'une offre expire automatiquement.
     */
    @Transactional
    public void notifyJobExpired(Job job) {
        List<User> admins = userRepository.findByRole(Role.ADMIN);
        if (admins.isEmpty()) {
            return;
        }
        for (User admin : admins) {
            Notification n = new Notification();
            n.setUserId(admin.getId());
            n.setType(Notification.NotificationType.JOB_EXPIRED);
            n.setTitle("Offre expirée");
            n.setMessage("L'offre \"" + job.getTitre() + "\" est arrivée à expiration.");
            n.setRead(false);
            notificationRepository.save(n);
        }
    }

    /**
     * Crée les notifications manquantes pour les entretiens déjà programmés dont l'utilisateur
     * est le candidat (teacher de la candidature). Permet d'afficher les notifications pour
     * les meetings créés avant l'ajout de cette fonctionnalité.
     */
    @Transactional
    public void ensureTeacherNotificationsForMeetings(Long userId) {
        List<Meeting> meetingsForTeacher = meetingRepository.findByApplicationTeacherId(userId);
        for (Meeting m : meetingsForTeacher) {
            if (notificationRepository.existsByUserIdAndMeetingId(userId, m.getId())) {
                continue;
            }
            String applicationInfo = null;
            if (m.getApplication() != null && m.getApplication().getJob() != null) {
                applicationInfo = "Offre: " + m.getApplication().getJob().getTitre();
            }
            notifyTeacherMeetingScheduled(userId, m.getId(), m.getMeetingDate(), applicationInfo);
        }
    }

    @Transactional(readOnly = true)
    public List<NotificationDTO> getUnreadForUser(Long userId) {
        return getUnreadForUserInternal(userId);
    }

    @Transactional
    public List<NotificationDTO> getUnreadForUserWithSync(Long userId) {
        ensureTeacherNotificationsForMeetings(userId);
        return getUnreadForUserInternal(userId);
    }

    private List<NotificationDTO> getUnreadForUserInternal(Long userId) {
        List<Notification> list = notificationRepository.findByUserIdAndReadFalseOrderByCreatedAtDesc(userId);
        return list.stream().map(notification -> {
            LocalDateTime meetingDate = notification.getMeetingId() == null ? null
                    : meetingRepository.findById(notification.getMeetingId())
                            .map(Meeting::getMeetingDate)
                            .orElse(null);
            return NotificationDTO.from(notification, meetingDate);
        }).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<NotificationDTO> getRecentForUser(Long userId, int limit) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId, PageRequest.of(0, limit))
                .stream().map(NotificationDTO::from).collect(Collectors.toList());
    }

    @Transactional
    public void markAsRead(Long notificationId, Long userId) {
        notificationRepository.findById(notificationId).ifPresent(n -> {
            if (n.getUserId().equals(userId)) {
                n.setRead(true);
                notificationRepository.save(n);
            }
        });
    }

    @Transactional
    public void markAllAsRead(Long userId) {
        notificationRepository.findByUserIdAndReadFalseOrderByCreatedAtDesc(userId).forEach(n -> {
            n.setRead(true);
            notificationRepository.save(n);
        });
    }

    public long countUnread(Long userId) {
        return notificationRepository.countByUserIdAndReadFalse(userId);
    }
}
