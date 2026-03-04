package org.example.yallatn.repository;

import org.example.yallatn.model.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface RatingRepository extends JpaRepository<Rating, Long> {
    
    List<Rating> findByTeacherId(Long teacherId);
    
    List<Rating> findByStudentId(Long studentId);
    
    Optional<Rating> findByTeacherIdAndStudentId(Long teacherId, Long studentId);
    
    @Query("SELECT AVG(r.note) FROM Rating r WHERE r.teacher.id = :teacherId")
    Double getAverageRatingForTeacher(Long teacherId);
    
    @Query("SELECT r FROM Rating r LEFT JOIN FETCH r.teacher LEFT JOIN FETCH r.student WHERE r.student.id = :studentId")
    List<Rating> findByStudentIdWithRelations(Long studentId);
    
    @Query("SELECT r FROM Rating r LEFT JOIN FETCH r.teacher LEFT JOIN FETCH r.student WHERE r.teacher.id = :teacherId")
    List<Rating> findByTeacherIdWithRelations(Long teacherId);
    
    @Query("SELECT r FROM Rating r LEFT JOIN FETCH r.teacher LEFT JOIN FETCH r.student")
    List<Rating> findAllWithRelations();
}
