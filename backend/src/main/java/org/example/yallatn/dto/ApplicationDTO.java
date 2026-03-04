package org.example.yallatn.dto;

import org.example.yallatn.model.ApplicationStatus;

import java.time.LocalDateTime;

public class ApplicationDTO {

    private Long id;
    private Long jobId;
    private String jobTitle;
    private Long teacherId;
    private String teacherName;
    private String cvPath;
    private String certificatPath;
    private String motivation;
    private ApplicationStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    /** Score de correspondance ATS 0-100 (motivation + CV vs offre). */
    private Integer matchScore;

    public ApplicationDTO() {
    }

    public ApplicationDTO(Long id, Long jobId, String jobTitle, Long teacherId, String teacherName,
                          String cvPath, String certificatPath, String motivation, ApplicationStatus status,
                          LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.jobId = jobId;
        this.jobTitle = jobTitle;
        this.teacherId = teacherId;
        this.teacherName = teacherName;
        this.cvPath = cvPath;
        this.certificatPath = certificatPath;
        this.motivation = motivation;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getJobId() {
        return jobId;
    }

    public void setJobId(Long jobId) {
        this.jobId = jobId;
    }

    public String getJobTitle() {
        return jobTitle;
    }

    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }

    public Long getTeacherId() {
        return teacherId;
    }

    public void setTeacherId(Long teacherId) {
        this.teacherId = teacherId;
    }

    public String getTeacherName() {
        return teacherName;
    }

    public void setTeacherName(String teacherName) {
        this.teacherName = teacherName;
    }

    public String getCvPath() {
        return cvPath;
    }

    public void setCvPath(String cvPath) {
        this.cvPath = cvPath;
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

    public ApplicationStatus getStatus() {
        return status;
    }

    public void setStatus(ApplicationStatus status) {
        this.status = status;
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

    public Integer getMatchScore() {
        return matchScore;
    }

    public void setMatchScore(Integer matchScore) {
        this.matchScore = matchScore;
    }
}
