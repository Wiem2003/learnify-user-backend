package org.example.yallatn.service;

import org.example.yallatn.dto.JobWithScoreDTO;
import org.example.yallatn.model.Job;
import org.example.yallatn.model.JobPublicationSchedule;
import org.example.yallatn.model.JobStatus;
import org.example.yallatn.repository.JobPublicationScheduleRepository;
import org.example.yallatn.repository.JobRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class JobService {

    private final JobRepository jobRepository;
    private final JobPublicationScheduleRepository publicationScheduleRepository;
    private final TeacherCvProfileService teacherCvProfileService;
    private final ApplicationMatchScoreService matchScoreService;

    public JobService(JobRepository jobRepository,
                      JobPublicationScheduleRepository publicationScheduleRepository,
                      TeacherCvProfileService teacherCvProfileService,
                      ApplicationMatchScoreService matchScoreService) {
        this.jobRepository = jobRepository;
        this.publicationScheduleRepository = publicationScheduleRepository;
        this.teacherCvProfileService = teacherCvProfileService;
        this.matchScoreService = matchScoreService;
    }

    /**
     * Crée une offre. Si opensAt est fourni et dans le futur, l'offre est créée en CLOSED
     * et sera passée en OPEN à la date/heure programmée (tâche planifiée).
     */
    @Transactional
    public Job createJob(Job job, LocalDateTime opensAt) {
        LocalDateTime now = LocalDateTime.now();
        if (opensAt != null && opensAt.isAfter(now)) {
            job.setStatus(JobStatus.CLOSED);
            Job saved = jobRepository.save(job);
            JobPublicationSchedule schedule = new JobPublicationSchedule(saved, opensAt);
            publicationScheduleRepository.save(schedule);
            return saved;
        }
        job.setStatus(JobStatus.OPEN);
        return jobRepository.save(job);
    }

    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }

    public List<Job> getOpenJobs() {
        return jobRepository.findByStatusOrderByDeadlineAsc(JobStatus.OPEN);
    }

    /**
     * Offres ouvertes classées par score de correspondance avec le CV profil de l'enseignant.
     * Si pas de CV profil, retourne les offres avec score 50 pour toutes.
     */
    @Transactional(readOnly = true)
    public List<JobWithScoreDTO> getOpenJobsRecommendedForTeacher(Long teacherId) {
        List<Job> openJobs = jobRepository.findByStatusOrderByDeadlineAsc(JobStatus.OPEN);
        String cvText = teacherCvProfileService.getCvExtractedText(teacherId).orElse("");

        return openJobs.stream()
                .map(job -> {
                    int score = matchScoreService.computeJobMatchScoreForCvText(cvText, job);
                    return new JobWithScoreDTO(job, score);
                })
                .sorted(Comparator.comparingInt(JobWithScoreDTO::getMatchScore).reversed())
                .collect(Collectors.toList());
    }

    public Job getJobById(Long id) {
        return jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found with id: " + id));
    }

    @Transactional
    public Job updateJob(Long id, Job updatedJob) {
        Job existing = getJobById(id);
        if (updatedJob.getTitre() != null) existing.setTitre(updatedJob.getTitre());
        if (updatedJob.getNbPlaces() != null) existing.setNbPlaces(updatedJob.getNbPlaces());
        if (updatedJob.getDescription() != null) existing.setDescription(updatedJob.getDescription());
        if (updatedJob.getRequirements() != null) existing.setRequirements(updatedJob.getRequirements());
        if (updatedJob.getDeadline() != null) existing.setDeadline(updatedJob.getDeadline());
        if (updatedJob.getStatus() != null) existing.setStatus(updatedJob.getStatus());
        // Garantir que status n'est jamais null (client n'envoie souvent pas ce champ)
        if (existing.getStatus() == null) existing.setStatus(JobStatus.OPEN);
        return jobRepository.save(existing);
    }

    @Transactional
    public void deleteJob(Long id) {
        if (!jobRepository.existsById(id)) {
            throw new RuntimeException("Job not found with id: " + id);
        }
        publicationScheduleRepository.deleteByJob_Id(id);
        jobRepository.deleteById(id);
    }

    @Transactional
    public Job closeJob(Long id) {
        Job job = getJobById(id);
        job.setStatus(JobStatus.CLOSED);
        return jobRepository.save(job);
    }

    /**
     * Renouvelle une offre expirée ou fermée en la repassant en statut OPEN
     * avec une nouvelle date limite.
     */
    @Transactional
    public Job renewJob(Long id, java.time.LocalDateTime newDeadline) {
        Job job = getJobById(id);
        job.setStatus(JobStatus.OPEN);
        job.setDeadline(newDeadline);
        return jobRepository.save(job);
    }

    /** Passe en OPEN les offres dont la date/heure de publication programmée est atteinte ou dépassée. */
    @Transactional
    public void processScheduledPublications() {
        LocalDateTime now = LocalDateTime.now();
        List<JobPublicationSchedule> due = publicationScheduleRepository.findByOpensAtLessThanEqual(now);
        for (JobPublicationSchedule s : due) {
            Job job = s.getJob();
            if (job != null) {
                job.setStatus(JobStatus.OPEN);
                jobRepository.save(job);
            }
            publicationScheduleRepository.delete(s);
        }
    }

    /** Planifications à venir (jobId -> opensAt) pour affichage "En attente (publication le ...)". */
    public java.util.Map<Long, LocalDateTime> getScheduledPublicationByJobId() {
        List<JobPublicationSchedule> list = publicationScheduleRepository.findByOpensAtAfter(LocalDateTime.now());
        java.util.Map<Long, LocalDateTime> map = new java.util.HashMap<>();
        for (JobPublicationSchedule s : list) {
            if (s.getJob() != null) {
                map.put(s.getJob().getId(), s.getOpensAt());
            }
        }
        return map;
    }
}
