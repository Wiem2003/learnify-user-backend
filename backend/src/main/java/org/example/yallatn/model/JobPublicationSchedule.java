package org.example.yallatn.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Planification de publication d'une offre : l'offre reste en attente (CLOSED)
 * jusqu'à la date/heure indiquée, puis passe automatiquement en OPEN.
 * Aucun nouvel attribut sur l'entité Job.
 */
@Entity
@Table(name = "job_publication_schedule")
public class JobPublicationSchedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id", nullable = false, unique = true)
    private Job job;

    @Column(name = "opens_at", nullable = false)
    private LocalDateTime opensAt;

    public JobPublicationSchedule() {
    }

    public JobPublicationSchedule(Job job, LocalDateTime opensAt) {
        this.job = job;
        this.opensAt = opensAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Job getJob() { return job; }
    public void setJob(Job job) { this.job = job; }
    public LocalDateTime getOpensAt() { return opensAt; }
    public void setOpensAt(LocalDateTime opensAt) { this.opensAt = opensAt; }
}
