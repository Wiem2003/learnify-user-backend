package org.example.yallatn.repository;

import org.example.yallatn.model.SavedJob;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface SavedJobRepository extends JpaRepository<SavedJob, Long> {

    Optional<SavedJob> findByUserIdAndJobId(Long userId, Long jobId);

    boolean existsByUserIdAndJobId(Long userId, Long jobId);

    /** Charge les SavedJob avec leur Job en une requête pour éviter "no session" à la sérialisation JSON. */
    @Query("SELECT s FROM SavedJob s JOIN FETCH s.job WHERE s.userId = :userId ORDER BY s.createdAt DESC")
    List<SavedJob> findByUserIdOrderByCreatedAtDesc(@Param("userId") Long userId);

    void deleteByUserIdAndJobId(Long userId, Long jobId);
}
