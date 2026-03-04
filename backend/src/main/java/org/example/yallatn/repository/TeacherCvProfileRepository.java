package org.example.yallatn.repository;

import org.example.yallatn.model.TeacherCvProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TeacherCvProfileRepository extends JpaRepository<TeacherCvProfile, Long> {

    Optional<TeacherCvProfile> findByUserId(Long userId);

    boolean existsByUserId(Long userId);
}
