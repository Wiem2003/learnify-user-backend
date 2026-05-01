package pi.integrated.quiz.repository;

import pi.integrated.quiz.model.KidsGame;
import pi.integrated.quiz.model.QuizStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface KidsGameRepository extends JpaRepository<KidsGame, Long> {
    List<KidsGame> findByCategoryId(Long categoryId);
    List<KidsGame> findByStatus(QuizStatus status);
    List<KidsGame> findByCategoryIdAndStatus(Long categoryId, QuizStatus status);
}
