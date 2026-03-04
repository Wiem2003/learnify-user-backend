package org.example.yallatn.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "applications")
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id", nullable = false)
    @NotNull(message = "Job is required")
    private Job job;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "teacher_id", nullable = false)
    @NotNull(message = "Teacher is required")
    private User teacher;

    @Column(name = "cv_path")
    private String cvPath;

    @Column(name = "cv_extracted_text", columnDefinition = "TEXT")
    private String cvExtractedText;

    @Column(name = "certificat_path")
    private String certificatPath;

    @Column(columnDefinition = "TEXT")
    private String motivation;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ApplicationStatus status = ApplicationStatus.PENDING;

    public Application() {
    }

    public Application(Long id, Job job, User teacher, String cvPath, String certificatPath, String motivation,
                       LocalDateTime createdAt, LocalDateTime updatedAt, ApplicationStatus status) {
        this.id = id;
        this.job = job;
        this.teacher = teacher;
        this.cvPath = cvPath;
        this.certificatPath = certificatPath;
        this.motivation = motivation;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Job getJob() {
        return job;
    }

    public void setJob(Job job) {
        this.job = job;
    }

    public User getTeacher() {
        return teacher;
    }

    public void setTeacher(User teacher) {
        this.teacher = teacher;
    }

    public String getCvPath() {
        return cvPath;
    }

    public void setCvPath(String cvPath) {
        this.cvPath = cvPath;
    }

    public String getCvExtractedText() {
        return cvExtractedText;
    }

    public void setCvExtractedText(String cvExtractedText) {
        this.cvExtractedText = cvExtractedText;
    }

    public String getCertificatPath() {
        return certificatPath;
    }

    public void setCertificatPath(String certificatPath) {
        this.certificatPath = certificatPath;
    }

    public String getMotivation() {
        return motivation;
    }

    public void setMotivation(String motivation) {
        this.motivation = motivation;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public ApplicationStatus getStatus() {
        return status;
    }

    public void setStatus(ApplicationStatus status) {
        this.status = status;
    }
}
