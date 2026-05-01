package pi.integrated.quiz.controller;

import pi.integrated.quiz.dto.GameCategoryDTO;
import pi.integrated.quiz.dto.GameQuestionDTO;
import pi.integrated.quiz.dto.KidsGameDTO;
import pi.integrated.quiz.service.KidsGameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/kids-games")
@CrossOrigin(origins = "*")
public class KidsGameController {

    @Autowired
    private KidsGameService kidsGameService;

    // ============================================
    // CATEGORY ENDPOINTS
    // ============================================
    
    @GetMapping("/categories")
    public ResponseEntity<List<GameCategoryDTO>> getAllCategories() {
        return ResponseEntity.ok(kidsGameService.getAllCategories());
    }

    @GetMapping("/categories/{id}")
    public ResponseEntity<GameCategoryDTO> getCategoryById(@PathVariable Long id) {
        return ResponseEntity.ok(kidsGameService.getCategoryById(id));
    }

    @PostMapping("/categories")
    public ResponseEntity<GameCategoryDTO> createCategory(@RequestBody GameCategoryDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(kidsGameService.createCategory(dto));
    }

    @PutMapping("/categories/{id}")
    public ResponseEntity<GameCategoryDTO> updateCategory(
            @PathVariable Long id,
            @RequestBody GameCategoryDTO dto) {
        return ResponseEntity.ok(kidsGameService.updateCategory(id, dto));
    }

    @DeleteMapping("/categories/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        kidsGameService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }

    // ============================================
    // GAME ENDPOINTS
    // ============================================
    
    @GetMapping
    public ResponseEntity<List<KidsGameDTO>> getAllGames() {
        return ResponseEntity.ok(kidsGameService.getAllGames());
    }

    @GetMapping("/published")
    public ResponseEntity<List<KidsGameDTO>> getPublishedGames() {
        return ResponseEntity.ok(kidsGameService.getPublishedGames());
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<KidsGameDTO>> getGamesByCategory(@PathVariable Long categoryId) {
        return ResponseEntity.ok(kidsGameService.getGamesByCategory(categoryId));
    }

    @GetMapping("/published/category/{categoryId}")
    public ResponseEntity<List<KidsGameDTO>> getPublishedGamesByCategory(@PathVariable Long categoryId) {
        return ResponseEntity.ok(kidsGameService.getPublishedGamesByCategory(categoryId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<KidsGameDTO> getGameById(@PathVariable Long id) {
        return ResponseEntity.ok(kidsGameService.getGameById(id));
    }

    @PostMapping
    public ResponseEntity<KidsGameDTO> createGame(@RequestBody KidsGameDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(kidsGameService.createGame(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<KidsGameDTO> updateGame(
            @PathVariable Long id,
            @RequestBody KidsGameDTO dto) {
        return ResponseEntity.ok(kidsGameService.updateGame(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGame(@PathVariable Long id) {
        kidsGameService.deleteGame(id);
        return ResponseEntity.noContent().build();
    }

    // ============================================
    // QUESTION ENDPOINTS
    // ============================================
    
    @GetMapping("/{gameId}/questions")
    public ResponseEntity<List<GameQuestionDTO>> getQuestionsByGame(@PathVariable Long gameId) {
        return ResponseEntity.ok(kidsGameService.getQuestionsByGame(gameId));
    }

    @GetMapping("/questions/{id}")
    public ResponseEntity<GameQuestionDTO> getQuestionById(@PathVariable Long id) {
        return ResponseEntity.ok(kidsGameService.getQuestionById(id));
    }

    @PostMapping("/questions")
    public ResponseEntity<GameQuestionDTO> createQuestion(@RequestBody GameQuestionDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(kidsGameService.createQuestion(dto));
    }

    @PutMapping("/questions/{id}")
    public ResponseEntity<GameQuestionDTO> updateQuestion(
            @PathVariable Long id,
            @RequestBody GameQuestionDTO dto) {
        return ResponseEntity.ok(kidsGameService.updateQuestion(id, dto));
    }

    @DeleteMapping("/questions/{id}")
    public ResponseEntity<Void> deleteQuestion(@PathVariable Long id) {
        kidsGameService.deleteQuestion(id);
        return ResponseEntity.noContent().build();
    }
}
