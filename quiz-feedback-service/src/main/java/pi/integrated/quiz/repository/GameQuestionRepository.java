package pi.integrated.quiz.repository;

import pi.integrated.quiz.model.GameQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GameQuestionRepository extends JpaRepository<GameQuestion, Long> {
    List<GameQuestion> findByGameId(Long gameId);
    void deleteByGameId(Long gameId);
}
