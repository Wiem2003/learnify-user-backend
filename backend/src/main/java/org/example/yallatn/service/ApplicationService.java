package org.example.yallatn.service;

import org.example.yallatn.dto.ApplicationDTO;
import org.example.yallatn.model.Application;
import org.example.yallatn.model.ApplicationStatus;
import org.example.yallatn.model.Job;
import org.example.yallatn.model.Meeting;
import org.example.yallatn.model.User;
import org.example.yallatn.repository.ApplicationRepository;
import org.example.yallatn.repository.JobRepository;
import org.example.yallatn.repository.MeetingRepository;
import org.example.yallatn.repository.UserRepository;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;
    private final MeetingRepository meetingRepository;
    private final CvTextExtractionService cvTextExtractionService;
    private final ApplicationMatchScoreService matchScoreService;

    public ApplicationService(ApplicationRepository applicationRepository,
                              JobRepository jobRepository,
                              UserRepository userRepository,
                              FileStorageService fileStorageService,
                              MeetingRepository meetingRepository,
                              CvTextExtractionService cvTextExtractionService,
                              ApplicationMatchScoreService matchScoreService) {
        this.applicationRepository = applicationRepository;
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
        this.fileStorageService = fileStorageService;
        this.meetingRepository = meetingRepository;
        this.cvTextExtractionService = cvTextExtractionService;
        this.matchScoreService = matchScoreService;
    }

    @Transactional
    public ApplicationDTO createApplication(Long jobId, Long teacherId, String motivation,
                                           MultipartFile cv, MultipartFile certificat) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        User teacher = userRepository.findById(teacherId)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));

        if (applicationRepository.findByJobIdAndTeacherId(jobId, teacherId).isPresent()) {
            throw new RuntimeException("You have already applied to this job");
        }

        Application application = new Application();
        application.setJob(job);
        application.setTeacher(teacher);
        application.setMotivation(motivation);
        application.setStatus(ApplicationStatus.PENDING);

        if (cv != null && !cv.isEmpty()) {
            String cvPath = fileStorageService.storeFile(cv, "cv");
            application.setCvPath(cvPath);
            String extracted = cvTextExtractionService.extractText(cv);
            if (extracted != null) application.setCvExtractedText(extracted);
        }

        if (certificat != null && !certificat.isEmpty()) {
            String certPath = fileStorageService.storeFile(certificat, "certificats");
            application.setCertificatPath(certPath);
        }

        Application saved = applicationRepository.save(application);
        return mapToDTO(saved);
    }

    @Transactional(readOnly = true)
    public List<ApplicationDTO> getAllApplications(String keyword, Integer minScore, String sortBy) {
        Stream<Application> stream = applicationRepository.findAllWithJob().stream();
        return applyAtsFilterAndSort(stream, keyword, minScore, sortBy);
    }

    @Transactional(readOnly = true)
    public List<ApplicationDTO> getApplicationsByJob(Long jobId, String keyword, Integer minScore, String sortBy) {
        Stream<Application> stream = applicationRepository.findByJobIdWithJob(jobId).stream();
        return applyAtsFilterAndSort(stream, keyword, minScore, sortBy);
    }

    @Transactional(readOnly = true)
    public List<ApplicationDTO> getApplicationsByTeacher(Long teacherId) {
        return applicationRepository.findByTeacherId(teacherId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ApplicationDTO getApplicationById(Long id) {
        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found"));
        return mapToDTO(application);
    }

    @Transactional
    public ApplicationDTO updateApplicationStatus(Long id, ApplicationStatus status) {
        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found"));
        application.setStatus(status);
        Application updated = applicationRepository.save(application);
        
        // Si l'application est acceptée, créer automatiquement un meeting sans évaluateur
        if (status == ApplicationStatus.ACCEPTED) {
            // Vérifier qu'un meeting n'existe pas déjà pour cette application
            if (meetingRepository.findByApplicationId(id).isEmpty()) {
                Meeting meeting = new Meeting();
                meeting.setApplication(application);
                // assignedTo reste null pour l'instant, l'admin devra l'affecter plus tard
                meeting.setAssignedTo(null);
                // Date par défaut : maintenant + 7 jours
                meeting.setMeetingDate(LocalDateTime.now().plusDays(7));
                Meeting saved = meetingRepository.save(meeting);
                System.out.println("DEBUG: Meeting créé avec succès pour l'application ID=" + id + ", Meeting ID=" + saved.getId());
            } else {
                System.out.println("DEBUG: Un meeting existe déjà pour l'application ID=" + id);
            }
        }
        
        return mapToDTO(updated);
    }

    @Transactional
    public ApplicationDTO updateApplication(Long id, Long teacherId, String motivation,
                                           MultipartFile cv, MultipartFile certificat) {
        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        // Vérifier que c'est bien l'enseignant propriétaire
        if (!application.getTeacher().getId().equals(teacherId)) {
            throw new RuntimeException("You can only update your own applications");
        }

        // Vérifier que le status est PENDING (pas encore accepté/refusé)
        if (application.getStatus() != ApplicationStatus.PENDING) {
            throw new RuntimeException("You can only update applications that are still pending");
        }

        application.setMotivation(motivation);

        // Mettre à jour les fichiers si fournis
        if (cv != null && !cv.isEmpty()) {
            String cvPath = fileStorageService.storeFile(cv, "cv");
            application.setCvPath(cvPath);
            String extracted = cvTextExtractionService.extractText(cv);
            if (extracted != null) application.setCvExtractedText(extracted);
        }

        if (certificat != null && !certificat.isEmpty()) {
            String certPath = fileStorageService.storeFile(certificat, "certificats");
            application.setCertificatPath(certPath);
        }

        Application updated = applicationRepository.save(application);
        return mapToDTO(updated);
    }

    @Transactional
    public void deleteApplication(Long id) {
        if (!applicationRepository.existsById(id)) {
            throw new RuntimeException("Application not found");
        }
        applicationRepository.deleteById(id);
    }

    /**
     * Charge le fichier CV ou certificat d'une candidature (pour consultation par l'admin).
     * @param applicationId id de la candidature
     * @param type "cv" ou "certificat"
     * @return la ressource fichier
     */
    @Transactional(readOnly = true)
    public Resource getApplicationFile(Long applicationId, String type) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));
        String pathStr = "cv".equalsIgnoreCase(type) ? application.getCvPath() : application.getCertificatPath();
        if (pathStr == null || pathStr.isBlank()) {
            throw new RuntimeException("File not found for this application");
        }
        Path path = fileStorageService.loadFile(pathStr);
        if (!Files.exists(path)) {
            throw new RuntimeException("File not found on disk");
        }
        return new FileSystemResource(path.toFile());
    }

    private List<ApplicationDTO> applyAtsFilterAndSort(Stream<Application> stream, String keyword, Integer minScore, String sortBy) {
        int min = (minScore != null && minScore >= 0 && minScore <= 100) ? minScore : 0;
        String kw = (keyword != null && !keyword.isBlank()) ? keyword.trim() : null;
        boolean sortByScore = "matchScore".equalsIgnoreCase(sortBy);

        return stream
                .filter(app -> kw == null || matchScoreService.containsKeyword(app, kw))
                .map(app -> {
                    int score = matchScoreService.computeMatchScore(app);
                    if (score < min) return null;
                    ApplicationDTO dto = mapToDTO(app);
                    dto.setMatchScore(score);
                    return dto;
                })
                .filter(dto -> dto != null)
                .sorted(sortByScore
                        ? Comparator.comparing(ApplicationDTO::getMatchScore, Comparator.nullsLast(Comparator.reverseOrder()))
                        : Comparator.comparing(ApplicationDTO::getCreatedAt, Comparator.nullsLast(Comparator.reverseOrder())))
                .collect(Collectors.toList());
    }

    private ApplicationDTO mapToDTO(Application application) {
        ApplicationDTO dto = new ApplicationDTO();
        dto.setId(application.getId());
        dto.setJobId(application.getJob().getId());
        dto.setJobTitle(application.getJob().getTitre());
        dto.setTeacherId(application.getTeacher().getId());
        dto.setTeacherName(application.getTeacher().getName());
        dto.setCvPath(application.getCvPath());
        dto.setCertificatPath(application.getCertificatPath());
        dto.setMotivation(application.getMotivation());
        dto.setStatus(application.getStatus());
        dto.setCreatedAt(application.getCreatedAt());
        dto.setUpdatedAt(application.getUpdatedAt());
        dto.setMatchScore(matchScoreService.computeMatchScore(application));
        return dto;
    }
}
