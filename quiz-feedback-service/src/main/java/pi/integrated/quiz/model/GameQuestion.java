package pi.integrated.quiz.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "game_questions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GameQuestion {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "game_id", nullable = false)
    private KidsGame game;
    
    @Column(nullable = false)
    private String imageEmoji;
    
    @Column(nullable = false)
    private String correctAnswer;
    
    @ElementCollection
    @CollectionTable(name = "game_question_options", joinColumns = @JoinColumn(name = "question_id"))
    @Column(name = "option_value")
    private List<String> options = new ArrayList<>();
    
    @Column(nullable = false)
    private Integer points = 1;
    
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
