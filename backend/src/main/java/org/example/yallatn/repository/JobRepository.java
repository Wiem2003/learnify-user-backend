package org.example.yallatn.repository;

import org.example.yallatn.model.Job;
import org.example.yallatn.model.JobStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface JobRepository extends JpaRepository<Job, Long> {

    List<Job> findByStatus(JobStatus status);

    List<Job> findByStatusOrderByDeadlineAsc(JobStatus status);

    /**
     * Toutes les offres encore ouvertes dont la date limite est déjà dépassée.
     */
    List<Job> findByStatusAndDeadlineBefore(JobStatus status, LocalDateTime deadlineBefore);
}
