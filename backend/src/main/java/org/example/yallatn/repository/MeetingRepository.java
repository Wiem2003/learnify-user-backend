package org.example.yallatn.repository;

import org.example.yallatn.model.Meeting;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface MeetingRepository extends JpaRepository<Meeting, Long> {

    Optional<Meeting> findByApplicationId(Long applicationId);

    @Query("SELECT m FROM Meeting m JOIN FETCH m.application a JOIN FETCH a.job WHERE a.teacher.id = :teacherId")
    List<Meeting> findByApplicationTeacherId(@Param("teacherId") Long teacherId);

    List<Meeting> findByAssignedToId(Long evaluatorId);

    @Query("SELECT m FROM Meeting m LEFT JOIN FETCH m.application a LEFT JOIN FETCH a.job LEFT JOIN FETCH a.teacher LEFT JOIN FETCH m.assignedTo")
    List<Meeting> findAllWithRelations();

    @Query("SELECT m FROM Meeting m LEFT JOIN FETCH m.application a LEFT JOIN FETCH a.job LEFT JOIN FETCH m.assignedTo WHERE m.assignedTo.id = :userId AND m.meetingDate >= :now ORDER BY m.meetingDate ASC")
    List<Meeting> findNextMeetingForUser(@Param("userId") Long userId, @Param("now") LocalDateTime now, Pageable pageable);
}
