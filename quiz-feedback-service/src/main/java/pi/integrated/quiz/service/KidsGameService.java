package pi.integrated.quiz.service;

import pi.integrated.quiz.dto.GameCategoryDTO;
import pi.integrated.quiz.dto.GameQuestionDTO;
import pi.integrated.quiz.dto.KidsGameDTO;
import pi.integrated.quiz.model.GameCategory;
import pi.integrated.quiz.model.GameQuestion;
import pi.integrated.quiz.model.KidsGame;
import pi.integrated.quiz.model.QuizStatus;
import pi.integrated.quiz.repository.GameCategoryRepository;
import pi.integrated.quiz.repository.GameQuestionRepository;
import pi.integrated.quiz.repository.KidsGameRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class KidsGameService {

    @Autowired
    private KidsGameRepository gameRepository;

    @Autowired
    private GameCategoryRepository categoryRepository;

    @Autowired
    private GameQuestionRepository questionRepository;

    @PostConstruct
    public void initDefaultCategories() {
        if (categoryRepository.count() == 0) {
            categoryRepository.save(new GameCategory(null, "animals", "ðŸ¾", "#FF6B9D", "Learn about cute animals!", null, null));
            categoryRepository.save(new GameCategory(null, "colors", "ðŸŽ¨", "#4ECDC4", "Discover beautiful colors!", null, null));
            categoryRepository.save(new GameCategory(null, "numbers", "ðŸ”¢", "#FFE66D", "Count and have fun!", null, null));
        }
    }

    // Category Management
    public List<GameCategoryDTO> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(this::convertCategoryToDTO)
                .collect(Collectors.toList());
    }

    public GameCategoryDTO getCategoryById(Long id) {
        return categoryRepository.findById(id)
                .map(this::convertCategoryToDTO)
                .orElseThrow(() -> new RuntimeException("Category not found"));
    }

    @Transactional
    public GameCategoryDTO createCategory(GameCategoryDTO dto) {
        if (categoryRepository.existsByName(dto.getName())) {
            throw new RuntimeException("Category with this name already exists");
        }
        GameCategory category = new GameCategory();
        category.setName(dto.getName());
        category.setIcon(dto.getIcon());
        category.setColor(dto.getColor());
        category.setDescription(dto.getDescription());
        return convertCategoryToDTO(categoryRepository.save(category));
    }

    @Transactional
    public GameCategoryDTO updateCategory(Long id, GameCategoryDTO dto) {
        GameCategory category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        category.setName(dto.getName());
        category.setIcon(dto.getIcon());
        category.setColor(dto.getColor());
        category.setDescription(dto.getDescription());
        return convertCategoryToDTO(categoryRepository.save(category));
    }

    @Transactional
    public void deleteCategory(Long id) {
        categoryRepository.deleteById(id);
    }

    // Game Management
    public List<KidsGameDTO> getAllGames() {
        return gameRepository.findAll().stream()
                .map(this::convertGameToDTO)
                .collect(Collectors.toList());
    }

    public List<KidsGameDTO> getGamesByCategory(Long categoryId) {
        return gameRepository.findByCategoryId(categoryId).stream()
                .map(this::convertGameToDTO)
                .collect(Collectors.toList());
    }

    public List<KidsGameDTO> getPublishedGames() {
        return gameRepository.findByStatus(QuizStatus.PUBLISHED).stream()
                .map(this::convertGameToDTO)
                .collect(Collectors.toList());
    }

    public List<KidsGameDTO> getPublishedGamesByCategory(Long categoryId) {
        return gameRepository.findByCategoryIdAndStatus(categoryId, QuizStatus.PUBLISHED).stream()
                .map(this::convertGameToDTO)
                .collect(Collectors.toList());
    }

    public KidsGameDTO getGameById(Long id) {
        return gameRepository.findById(id)
                .map(this::convertGameToDTO)
                .orElseThrow(() -> new RuntimeException("Game not found"));
    }

    @Transactional
    public KidsGameDTO createGame(KidsGameDTO dto) {
        GameCategory category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));
        
        KidsGame game = new KidsGame();
        game.setTitle(dto.getTitle());
        game.setDescription(dto.getDescription());
        game.setCategory(category);
        game.setStatus(dto.getStatus() != null ? dto.getStatus() : QuizStatus.DRAFT);
        
        return convertGameToDTO(gameRepository.save(game));
    }

    @Transactional
    public KidsGameDTO updateGame(Long id, KidsGameDTO dto) {
        KidsGame game = gameRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Game not found"));
        
        if (dto.getCategoryId() != null) {
            GameCategory category = categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            game.setCategory(category);
        }
        
        game.setTitle(dto.getTitle());
        game.setDescription(dto.getDescription());
        game.setStatus(dto.getStatus());
        
        return convertGameToDTO(gameRepository.save(game));
    }

    @Transactional
    public void deleteGame(Long id) {
        gameRepository.deleteById(id);
    }

    // Question Management
    public List<GameQuestionDTO> getQuestionsByGame(Long gameId) {
        return questionRepository.findByGameId(gameId).stream()
                .map(this::convertQuestionToDTO)
                .collect(Collectors.toList());
    }

    public GameQuestionDTO getQuestionById(Long id) {
        return questionRepository.findById(id)
                .map(this::convertQuestionToDTO)
                .orElseThrow(() -> new RuntimeException("Question not found"));
    }

    @Transactional
    public GameQuestionDTO createQuestion(GameQuestionDTO dto) {
        KidsGame game = gameRepository.findById(dto.getGameId())
                .orElseThrow(() -> new RuntimeException("Game not found"));
        
        GameQuestion question = new GameQuestion();
        question.setGame(game);
        question.setImageEmoji(dto.getImageEmoji());
        question.setCorrectAnswer(dto.getCorrectAnswer());
        question.setOptions(dto.getOptions());
        question.setPoints(dto.getPoints() != null ? dto.getPoints() : 1);
        
        return convertQuestionToDTO(questionRepository.save(question));
    }

    @Transactional
    public GameQuestionDTO updateQuestion(Long id, GameQuestionDTO dto) {
        GameQuestion question = questionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Question not found"));
        
        question.setImageEmoji(dto.getImageEmoji());
        question.setCorrectAnswer(dto.getCorrectAnswer());
        question.setOptions(dto.getOptions());
        question.setPoints(dto.getPoints());
        
        return convertQuestionToDTO(questionRepository.save(question));
    }

    @Transactional
    public void deleteQuestion(Long id) {
        questionRepository.deleteById(id);
    }

    // Converters
    private KidsGameDTO convertGameToDTO(KidsGame game) {
        KidsGameDTO dto = new KidsGameDTO();
        dto.setId(game.getId());
        dto.setTitle(game.getTitle());
        dto.setDescription(game.getDescription());
        dto.setCategoryId(game.getCategory().getId());
        dto.setCategoryName(game.getCategory().getName());
        dto.setCategoryIcon(game.getCategory().getIcon());
        dto.setCategoryColor(game.getCategory().getColor());
        dto.setStatus(game.getStatus());
        dto.setQuestionCount(game.getQuestions().size());
        return dto;
    }

    private GameCategoryDTO convertCategoryToDTO(GameCategory category) {
        GameCategoryDTO dto = new GameCategoryDTO();
        dto.setId(category.getId());
        dto.setName(category.getName());
        dto.setIcon(category.getIcon());
        dto.setColor(category.getColor());
        dto.setDescription(category.getDescription());
        return dto;
    }

    private GameQuestionDTO convertQuestionToDTO(GameQuestion question) {
        GameQuestionDTO dto = new GameQuestionDTO();
        dto.setId(question.getId());
        dto.setGameId(question.getGame().getId());
        dto.setImageEmoji(question.getImageEmoji());
        dto.setCorrectAnswer(question.getCorrectAnswer());
        dto.setOptions(question.getOptions());
        dto.setPoints(question.getPoints());
        return dto;
    }
}
