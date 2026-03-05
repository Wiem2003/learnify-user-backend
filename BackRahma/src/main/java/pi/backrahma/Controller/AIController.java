package pi.backrahma.Controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pi.backrahma.Service.PredictionAIService;
import pi.backrahma.Service.RecommendationAIService;
import pi.backrahma.dto.PredictionRequest;
import pi.backrahma.dto.PredictionResponse;
import pi.backrahma.dto.RecommendationRequest;
import pi.backrahma.dto.RecommendedEvent;

import java.util.List;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*")
public class AIController {

    private static final Logger logger = LoggerFactory.getLogger(AIController.class);

    @Autowired
    private PredictionAIService predictionAIService;

    @Autowired
    private RecommendationAIService recommendationAIService;

    /**
     * Prédit si un événement risque d'être complet bientôt
     * 
     * POST /api/ai/predict
     * Body: { "likes": 50, "reservations": 80, "placesRestantes": 20 }
     * 
     * Response: { "result": "RISQUE_ELEVE", "reason": "beaucoup de likes et peu de places restantes" }
     */
    @PostMapping("/predict")
    public ResponseEntity<PredictionResponse> predictEventCompletion(@RequestBody PredictionRequest request) {
        try {
            logger.info("🎯 Received prediction request: likes={}, reservations={}, placesRestantes={}", 
                request.getLikes(), request.getReservations(), request.getPlacesRestantes());
            
            PredictionResponse response = predictionAIService.predictEventCompletion(request);
            
            logger.info("✅ Prediction response: result={}, reason={}", response.getResult(), response.getReason());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("❌ Error in prediction: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body(
                new PredictionResponse("RISQUE_FAIBLE", "Erreur: " + e.getMessage())
            );
        }
    }

    /**
     * Recommande des événements basés sur les catégories aimées
     * 
     * POST /api/ai/recommend
     * Body: { "categoriesLiked": ["WORKSHOP", "CONFERENCE"] }
     * 
     * Response: [
     *   {"id":1,"name":"Workshop Java","category":"WORKSHOP","date":"2026-03-10","description":"...","availableSeats":50},
     *   ...
     * ]
     */
    @PostMapping("/recommend")
    public ResponseEntity<List<RecommendedEvent>> recommendEvents(@RequestBody RecommendationRequest request) {
        try {
            logger.info("🎯 Received recommendation request: categoriesLiked={}", request.getCategoriesLiked());
            
            List<RecommendedEvent> recommendations = recommendationAIService.recommendEvents(request);
            
            logger.info("✅ Recommendation response: {} events found", recommendations.size());
            return ResponseEntity.ok(recommendations);
        } catch (Exception e) {
            logger.error("❌ Error in recommendation: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body(List.of());
        }
    }

    /**
     * Endpoint de test pour vérifier que l'API fonctionne
     * 
     * GET /api/ai/test
     */
    @GetMapping("/test")
    public ResponseEntity<String> testAI() {
        logger.info("✅ AI Test endpoint called");
        return ResponseEntity.ok("AI Service is running!");
    }
}
