package pi.integrated.quiz.dto;

import pi.integrated.quiz.model.QuizStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class KidsGameDTO {
    private Long id;
    private String title;
    private String description;
    private Long categoryId;
    private String categoryName;
    private String categoryIcon;
    private String categoryColor;
    private QuizStatus status;
    private Integer questionCount;
}
