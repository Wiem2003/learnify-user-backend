package org.example.yallatn.repository;

import org.example.yallatn.model.Application;
import org.example.yallatn.model.ApplicationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ApplicationRepository extends JpaRepository<Application, Long> {

    List<Application> findByJobId(Long jobId);

    @Query("SELECT a FROM Application a JOIN FETCH a.job WHERE a.job.id = :jobId")
    List<Application> findByJobIdWithJob(@Param("jobId") Long jobId);

    @Query("SELECT a FROM Application a JOIN FETCH a.job")
    List<Application> findAllWithJob();

    List<Application> findByTeacherId(Long teacherId);

    List<Application> findByStatus(ApplicationStatus status);

    Optional<Application> findByJobIdAndTeacherId(Long jobId, Long teacherId);

    List<Application> findByJobIdAndStatus(Long jobId, ApplicationStatus status);
}
