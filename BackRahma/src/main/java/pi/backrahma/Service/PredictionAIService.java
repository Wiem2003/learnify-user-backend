package pi.backrahma.Service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pi.backrahma.dto.PredictionRequest;
import pi.backrahma.dto.PredictionResponse;

@Service
public class PredictionAIService {

    private static final Logger logger = LoggerFactory.getLogger(PredictionAIService.class);

    @Autowired
    private GoogleAIService googleAIService;

    /**
     * Prédit si un événement risque d'être complet bientôt
     */
    public PredictionResponse predictEventCompletion(PredictionRequest request) {
        try {
            // Essayer d'abord avec l'IA Google
            return predictWithGoogleAI(request);
        } catch (Exception e) {
            logger.warn("⚠️ Google AI failed, using fallback logic: {}", e.getMessage());
            // Fallback: utiliser une logique simple sans IA
            return predictWithFallbackLogic(request);
        }
    }

    /**
     * Prédiction avec Google AI
     */
    private PredictionResponse predictWithGoogleAI(PredictionRequest request) {
        // Construction du prompt pour l'IA
        String prompt = String.format(
            "Tu es un assistant IA qui analyse les événements. " +
            "Analyse ces données d'un événement et détermine s'il risque d'être complet bientôt:\n\n" +
            "- Nombre de likes: %d\n" +
            "- Nombre de réservations: %d\n" +
            "- Places restantes: %d\n\n" +
            "Réponds UNIQUEMENT au format JSON suivant (sans markdown, sans ```json):\n" +
            "{\n" +
            "  \"result\": \"RISQUE_ELEVE\" ou \"RISQUE_FAIBLE\",\n" +
            "  \"reason\": \"une courte justification en français (max 100 caractères)\"\n" +
            "}",
            request.getLikes(),
            request.getReservations(),
            request.getPlacesRestantes()
        );

        // Appel à l'API Google AI
        String aiResponse = googleAIService.callGeminiAPI(prompt);
        
        // Parse la réponse JSON
        return parseAIPredictionResponse(aiResponse);
    }

    /**
     * Prédiction avec logique simple (fallback)
     */
    private PredictionResponse predictWithFallbackLogic(PredictionRequest request) {
        int totalPlaces = request.getReservations() + request.getPlacesRestantes();
        double occupancyRate = totalPlaces > 0 ? (double) request.getReservations() / totalPlaces : 0;
        
        logger.info("📊 Fallback prediction - Occupancy rate: {}%", (int)(occupancyRate * 100));
        
        // Logique de prédiction simple
        if (request.getPlacesRestantes() <= 5) {
            return new PredictionResponse(
                "RISQUE_ELEVE",
                "Seulement " + request.getPlacesRestantes() + " places restantes !"
            );
        } else if (occupancyRate >= 0.8) {
            return new PredictionResponse(
                "RISQUE_ELEVE",
                "Plus de 80% des places sont déjà réservées"
            );
        } else if (occupancyRate >= 0.6) {
            return new PredictionResponse(
                "RISQUE_ELEVE",
                "L'événement se remplit rapidement"
            );
        } else if (request.getPlacesRestantes() <= 10) {
            return new PredictionResponse(
                "RISQUE_ELEVE",
                "Moins de 10 places disponibles"
            );
        } else {
            return new PredictionResponse(
                "RISQUE_FAIBLE",
                "Encore " + request.getPlacesRestantes() + " places disponibles"
            );
        }
    }

    /**
     * Parse la réponse de l'IA en PredictionResponse
     */
    private PredictionResponse parseAIPredictionResponse(String aiResponse) {
        try {
            // Nettoie la réponse (enlève les markdown si présents)
            String cleanResponse = aiResponse
                .replace("```json", "")
                .replace("```", "")
                .trim();

            // Parse JSON manuellement (simple)
            String result = extractJsonValue(cleanResponse, "result");
            String reason = extractJsonValue(cleanResponse, "reason");

            // Valide le résultat
            if (!result.equals("RISQUE_ELEVE") && !result.equals("RISQUE_FAIBLE")) {
                result = "RISQUE_FAIBLE";
            }

            return new PredictionResponse(result, reason);

        } catch (Exception e) {
            return new PredictionResponse(
                "RISQUE_FAIBLE",
                "Impossible de parser la réponse de l'IA"
            );
        }
    }

    /**
     * Extrait une valeur d'un JSON simple
     */
    private String extractJsonValue(String json, String key) {
        String searchKey = "\"" + key + "\"";
        int startIndex = json.indexOf(searchKey);
        if (startIndex == -1) return "";

        int colonIndex = json.indexOf(":", startIndex);
        int valueStart = json.indexOf("\"", colonIndex) + 1;
        int valueEnd = json.indexOf("\"", valueStart);

        return json.substring(valueStart, valueEnd);
    }
}
