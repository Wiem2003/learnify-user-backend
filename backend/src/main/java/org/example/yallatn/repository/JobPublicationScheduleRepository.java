package org.example.yallatn.repository;

import org.example.yallatn.model.JobPublicationSchedule;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface JobPublicationScheduleRepository extends JpaRepository<JobPublicationSchedule, Long> {

    /** Planifications dont la date de publication est atteinte ou dépassée (opens_at <= dateTime). */
    List<JobPublicationSchedule> findByOpensAtLessThanEqual(LocalDateTime dateTime);

    /** Toutes les planifications à venir (pour affichage admin). */
    List<JobPublicationSchedule> findByOpensAtAfter(LocalDateTime dateTime);

    void deleteByJob_Id(Long jobId);
}
