package org.example.yallatn.service;

import org.example.yallatn.model.Job;
import org.example.yallatn.model.SavedJob;
import org.example.yallatn.repository.JobRepository;
import org.example.yallatn.repository.SavedJobRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SavedJobService {

    private final SavedJobRepository savedJobRepository;
    private final JobRepository jobRepository;

    public SavedJobService(SavedJobRepository savedJobRepository, JobRepository jobRepository) {
        this.savedJobRepository = savedJobRepository;
        this.jobRepository = jobRepository;
    }

    @Transactional
    public void saveJob(Long userId, Long jobId) {
        if (savedJobRepository.existsByUserIdAndJobId(userId, jobId)) {
            return;
        }
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found with id: " + jobId));
        SavedJob saved = new SavedJob();
        saved.setUserId(userId);
        saved.setJob(job);
        savedJobRepository.save(saved);
    }

    @Transactional
    public void unsaveJob(Long userId, Long jobId) {
        savedJobRepository.deleteByUserIdAndJobId(userId, jobId);
    }

    @Transactional(readOnly = true)
    public List<Job> getSavedJobs(Long userId) {
        return savedJobRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(SavedJob::getJob)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<Long> getSavedJobIds(Long userId) {
        return savedJobRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(s -> s.getJob().getId())
                .collect(Collectors.toList());
    }

    public boolean isSaved(Long userId, Long jobId) {
        return savedJobRepository.existsByUserIdAndJobId(userId, jobId);
    }
}
