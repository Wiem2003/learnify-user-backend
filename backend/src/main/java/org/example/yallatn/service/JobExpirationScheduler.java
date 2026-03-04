package org.example.yallatn.service;

import org.example.yallatn.model.Job;
import org.example.yallatn.model.JobStatus;
import org.example.yallatn.repository.JobRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Tâche planifiée qui passe automatiquement les offres en statut EXPIRED
 * lorsque leur date limite est dépassée, puis notifie les administrateurs.
 */
@Service
public class JobExpirationScheduler {

    private final JobRepository jobRepository;
    private final JobService jobService;
    private final NotificationService notificationService;

    public JobExpirationScheduler(JobRepository jobRepository,
                                  JobService jobService,
                                  NotificationService notificationService) {
        this.jobRepository = jobRepository;
        this.jobService = jobService;
        this.notificationService = notificationService;
    }

    /**
     * Lance la vérification d'expiration (même logique que le cron).
     * Utile pour les tests sans attendre l'heure.
     */
    @Transactional
    public void runExpirationNow() {
        doExpireJobsPastDeadline();
    }

    /**
     * Vérifie automatiquement toutes les 5 minutes les offres dont la date limite est dépassée.
     * Les offres OPEN passent en EXPIRED et les admins sont notifiés.
     * Cron: seconde, minute, heure, jour, mois, jour-semaine.
     */
    @Scheduled(cron = "0 */5 * * * *")
    @Transactional
    public void expireJobsPastDeadline() {
        doExpireJobsPastDeadline();
    }

    private void doExpireJobsPastDeadline() {
        LocalDateTime now = LocalDateTime.now();
        List<Job> toExpire = jobRepository.findByStatusAndDeadlineBefore(JobStatus.OPEN, now);
        if (toExpire.isEmpty()) {
            return;
        }
        for (Job job : toExpire) {
            job.setStatus(JobStatus.EXPIRED);
            jobRepository.save(job);
            notificationService.notifyJobExpired(job);
        }
    }

    /**
     * Publication programmée : passe en OPEN les offres dont la date/heure de publication est atteinte.
     * Exécuté toutes les minutes.
     */
    @Scheduled(cron = "0 * * * * *")
    @Transactional
    public void openScheduledJobs() {
        jobService.processScheduledPublications();
    }
}

