package pi.integrated.quiz.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GameQuestionDTO {
    private Long id;
    private Long gameId;
    private String imageEmoji;
    private String correctAnswer;
    private List<String> options;
    private Integer points;
}
