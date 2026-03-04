package org.example.yallatn.dto;

import org.example.yallatn.model.Job;

/**
 * Offre avec score de correspondance ATS (CV profil enseignant vs offre).
 */
public class JobWithScoreDTO {

    private Job job;
    private int matchScore;

    public JobWithScoreDTO(Job job, int matchScore) {
        this.job = job;
        this.matchScore = matchScore;
    }

    public Job getJob() { return job; }
    public void setJob(Job job) { this.job = job; }
    public int getMatchScore() { return matchScore; }
    public void setMatchScore(int matchScore) { this.matchScore = matchScore; }
}
