package org.example.yallatn.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.example.yallatn.annotation.RequireRole;
import org.example.yallatn.dto.CreateJobRequest;
import org.example.yallatn.dto.JobWithScoreDTO;
import org.example.yallatn.model.Job;
import org.example.yallatn.model.User;
import org.example.yallatn.service.JobExpirationScheduler;
import org.example.yallatn.service.JobService;
import org.example.yallatn.service.SavedJobService;
import org.example.yallatn.service.TeacherCvProfileService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    private final JobService jobService;
    private final SavedJobService savedJobService;
    private final JobExpirationScheduler jobExpirationScheduler;
    private final TeacherCvProfileService teacherCvProfileService;

    public JobController(JobService jobService, SavedJobService savedJobService,
                         JobExpirationScheduler jobExpirationScheduler,
                         TeacherCvProfileService teacherCvProfileService) {
        this.jobService = jobService;
        this.savedJobService = savedJobService;
        this.jobExpirationScheduler = jobExpirationScheduler;
        this.teacherCvProfileService = teacherCvProfileService;
    }

    @PostMapping
    @RequireRole({"ADMIN"})
    public ResponseEntity<Job> createJob(@Valid @RequestBody CreateJobRequest request) {
        Job job = new Job();
        job.setTitre(request.getTitre());
        job.setNbPlaces(request.getNbPlaces());
        job.setDescription(request.getDescription());
        job.setRequirements(request.getRequirements());
        job.setDeadline(request.getDeadline());
        Job created = jobService.createJob(job, request.getOpensAt());
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping
    @RequireRole({"ADMIN", "TEACHER"})
    public ResponseEntity<List<Job>> getAllJobs() {
        return ResponseEntity.ok(jobService.getAllJobs());
    }

    /** Planifications de publication à venir (pour afficher "En attente - publication le ..." en admin). */
    @GetMapping("/scheduled-publications")
    @RequireRole({"ADMIN"})
    public ResponseEntity<List<Map<String, Object>>> getScheduledPublications() {
        Map<Long, LocalDateTime> map = jobService.getScheduledPublicationByJobId();
        List<Map<String, Object>> list = map.entrySet().stream()
                .map(e -> Map.<String, Object>of("jobId", e.getKey(), "opensAt", e.getValue().toString()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }

    @GetMapping("/open")
    @RequireRole({"ADMIN", "TEACHER"})
    public ResponseEntity<List<Job>> getOpenJobs() {
        return ResponseEntity.ok(jobService.getOpenJobs());
    }

    /**
     * Offres ouvertes classées par pertinence par rapport au CV profil de l'enseignant (ATS).
     * Chaque offre est retournée avec un matchScore 0-100.
     */
    @GetMapping("/open/recommended")
    @RequireRole({"TEACHER"})
    public ResponseEntity<List<JobWithScoreDTO>> getOpenJobsRecommended(HttpServletRequest request) {
        User currentUser = (User) request.getAttribute("currentUser");
        return ResponseEntity.ok(jobService.getOpenJobsRecommendedForTeacher(currentUser.getId()));
    }

    /**
     * Indique si l'enseignant a déjà un CV profil pour les recommandations.
     */
    @GetMapping("/my-cv")
    @RequireRole({"TEACHER"})
    public ResponseEntity<Map<String, Boolean>> hasMyCv(HttpServletRequest request) {
        User currentUser = (User) request.getAttribute("currentUser");
        boolean has = teacherCvProfileService.hasProfileCv(currentUser.getId());
        return ResponseEntity.ok(Map.of("hasCv", has));
    }

    /**
     * Upload du CV profil pour les recommandations ATS (meilleures offres selon le CV).
     * PDF recommandé pour l'extraction du texte.
     */
    @PostMapping("/my-cv")
    @RequireRole({"TEACHER"})
    public ResponseEntity<Map<String, String>> uploadMyCv(@RequestParam("cv") MultipartFile cv,
                                                           HttpServletRequest request) {
        User currentUser = (User) request.getAttribute("currentUser");
        teacherCvProfileService.uploadCv(currentUser.getId(), cv);
        return ResponseEntity.ok(Map.of("message", "CV enregistré. Les offres seront classées par pertinence."));
    }

    /**
     * Lance manuellement la vérification d'expiration des offres (pour tests).
     * Les offres OPEN dont la deadline est dépassée passent en EXPIRED et les admins sont notifiés.
     */
    @PostMapping("/run-expiration")
    @RequireRole({"ADMIN"})
    public ResponseEntity<Map<String, String>> runExpiration() {
        jobExpirationScheduler.runExpirationNow();
        return ResponseEntity.ok(Map.of("message", "Expiration check executed"));
    }

    @GetMapping("/saved")
    @RequireRole({"TEACHER"})
    public ResponseEntity<List<Job>> getSavedJobs(HttpServletRequest request) {
        User currentUser = (User) request.getAttribute("currentUser");
        return ResponseEntity.ok(savedJobService.getSavedJobs(currentUser.getId()));
    }

    @GetMapping("/saved/ids")
    @RequireRole({"TEACHER"})
    public ResponseEntity<List<Long>> getSavedJobIds(HttpServletRequest request) {
        User currentUser = (User) request.getAttribute("currentUser");
        return ResponseEntity.ok(savedJobService.getSavedJobIds(currentUser.getId()));
    }

    @PostMapping("/{id}/save")
    @RequireRole({"TEACHER"})
    public ResponseEntity<Map<String, String>> saveJob(@PathVariable Long id, HttpServletRequest request) {
        User currentUser = (User) request.getAttribute("currentUser");
        savedJobService.saveJob(currentUser.getId(), id);
        return ResponseEntity.ok(Map.of("message", "Job saved to favorites"));
    }

    @DeleteMapping("/{id}/save")
    @RequireRole({"TEACHER"})
    public ResponseEntity<Map<String, String>> unsaveJob(@PathVariable Long id, HttpServletRequest request) {
        User currentUser = (User) request.getAttribute("currentUser");
        savedJobService.unsaveJob(currentUser.getId(), id);
        return ResponseEntity.ok(Map.of("message", "Job removed from favorites"));
    }

    @GetMapping("/{id}")
    @RequireRole({"ADMIN", "TEACHER"})
    public ResponseEntity<Job> getJobById(@PathVariable Long id) {
        return ResponseEntity.ok(jobService.getJobById(id));
    }

    @PutMapping("/{id}")
    @RequireRole({"ADMIN"})
    public ResponseEntity<Job> updateJob(@PathVariable Long id, @Valid @RequestBody Job job) {
        return ResponseEntity.ok(jobService.updateJob(id, job));
    }

    /**
     * Renouvelle une offre : repasse en statut OPEN avec une nouvelle date d'expiration.
     * Body JSON attendu : { "deadline": "2026-03-31T23:59:59" }
     */
    @PutMapping("/{id}/renew")
    @RequireRole({"ADMIN"})
    public ResponseEntity<Job> renewJob(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String deadlineStr = body.get("deadline");
        if (deadlineStr == null || deadlineStr.isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        LocalDateTime newDeadline = LocalDateTime.parse(deadlineStr);
        return ResponseEntity.ok(jobService.renewJob(id, newDeadline));
    }

    @PutMapping("/{id}/close")
    @RequireRole({"ADMIN"})
    public ResponseEntity<Job> closeJob(@PathVariable Long id) {
        return ResponseEntity.ok(jobService.closeJob(id));
    }

    @DeleteMapping("/{id}")
    @RequireRole({"ADMIN"})
    public ResponseEntity<Map<String, String>> deleteJob(@PathVariable Long id) {
        jobService.deleteJob(id);
        return ResponseEntity.ok(Map.of("message", "Job deleted successfully"));
    }
}
