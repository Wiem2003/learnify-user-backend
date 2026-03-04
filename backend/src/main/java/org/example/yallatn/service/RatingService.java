package org.example.yallatn.service;

import org.example.yallatn.model.Rating;
import org.example.yallatn.model.User;
import org.example.yallatn.repository.RatingRepository;
import org.example.yallatn.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class RatingService {

    private final RatingRepository ratingRepository;
    private final UserRepository userRepository;

    public RatingService(RatingRepository ratingRepository, UserRepository userRepository) {
        this.ratingRepository = ratingRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Rating createRating(Long teacherId, Long studentId, Integer note, String commentaire) {
        User teacher = userRepository.findById(teacherId)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));

        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        if (ratingRepository.findByTeacherIdAndStudentId(teacherId, studentId).isPresent()) {
            throw new RuntimeException("You have already rated this teacher");
        }

        Rating rating = new Rating();
        rating.setTeacher(teacher);
        rating.setStudent(student);
        rating.setNote(note);
        rating.setCommentaire(commentaire);

        return ratingRepository.save(rating);
    }

    @Transactional(readOnly = true)
    public List<Rating> getAllRatings() {
        return ratingRepository.findAllWithRelations();
    }

    @Transactional(readOnly = true)
    public List<Rating> getRatingsByTeacher(Long teacherId) {
        return ratingRepository.findByTeacherIdWithRelations(teacherId);
    }

    @Transactional(readOnly = true)
    public List<Rating> getRatingsByStudent(Long studentId) {
        return ratingRepository.findByStudentIdWithRelations(studentId);
    }

    @Transactional(readOnly = true)
    public Rating getRatingById(Long id) {
        Rating rating = ratingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rating not found"));
        // Forcer le chargement des relations lazy
        if (rating.getTeacher() != null) {
            rating.getTeacher().getId();
            rating.getTeacher().getName();
        }
        if (rating.getStudent() != null) {
            rating.getStudent().getId();
        }
        return rating;
    }

    public Double getAverageRatingForTeacher(Long teacherId) {
        Double average = ratingRepository.getAverageRatingForTeacher(teacherId);
        return average != null ? average : 0.0;
    }

    @Transactional
    public Rating updateRating(Long id, Integer note, String commentaire) {
        Rating rating = getRatingById(id);
        
        if (note != null) {
            rating.setNote(note);
        }
        
        if (commentaire != null) {
            rating.setCommentaire(commentaire);
        }

        return ratingRepository.save(rating);
    }

    @Transactional
    public void deleteRating(Long id) {
        if (!ratingRepository.existsById(id)) {
            throw new RuntimeException("Rating not found");
        }
        ratingRepository.deleteById(id);
    }
}
