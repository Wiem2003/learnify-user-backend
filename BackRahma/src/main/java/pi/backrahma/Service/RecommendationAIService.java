package pi.backrahma.Service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pi.backrahma.Repository.EventRepository;
import pi.backrahma.dto.RecommendationRequest;
import pi.backrahma.dto.RecommendedEvent;
import pi.backrahma.entity.Event;
import pi.backrahma.entity.EventCategory;
import pi.backrahma.entity.EventStatus;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RecommendationAIService {

    private static final Logger logger = LoggerFactory.getLogger(RecommendationAIService.class);

    @Autowired
    private GoogleAIService googleAIService;

    @Autowired
    private EventRepository eventRepository;

    /**
     * Recommande des événements basés sur les catégories aimées
     */
    public List<RecommendedEvent> recommendEvents(RecommendationRequest request) {
        try {
            // Essayer d'abord avec l'IA Google
            return recommendWithGoogleAI(request);
        } catch (Exception e) {
            logger.warn("⚠️ Google AI failed, using fallback logic: {}", e.getMessage());
            // Fallback: utiliser une logique simple sans IA
            return recommendWithFallbackLogic(request);
        }
    }

    /**
     * Recommandation avec Google AI
     */
    private List<RecommendedEvent> recommendWithGoogleAI(RecommendationRequest request) {
        // Récupère tous les événements disponibles (Upcoming ou Ongoing)
        List<Event> availableEvents = eventRepository.findAll().stream()
            .filter(event -> event.getStatus() == EventStatus.Upcoming || 
                           event.getStatus() == EventStatus.Ongoing)
            .collect(Collectors.toList());

        if (availableEvents.isEmpty()) {
            return new ArrayList<>();
        }

        // Construction du prompt pour l'IA
        String eventsJson = buildEventsJson(availableEvents);
        String categoriesLiked = String.join(", ", request.getCategoriesLiked());

        String prompt = String.format(
            "Tu es un assistant IA qui recommande des événements. " +
            "L'utilisateur aime ces catégories: %s\n\n" +
            "Voici la liste des événements disponibles:\n%s\n\n" +
            "Recommande les 5 meilleurs événements pour cet utilisateur. " +
            "Réponds UNIQUEMENT avec une liste d'IDs séparés par des virgules (exemple: 1,3,5,7,9). " +
            "Ne mets AUCUN texte supplémentaire, juste les IDs.",
            categoriesLiked,
            eventsJson
        );

        // Appel à l'API Google AI
        String aiResponse = googleAIService.callGeminiAPI(prompt);

        // Parse les IDs recommandés
        List<Long> recommendedIds = parseRecommendedIds(aiResponse);

        // Retourne les événements recommandés
        return availableEvents.stream()
            .filter(event -> recommendedIds.contains(event.getId()))
            .map(this::convertToRecommendedEvent)
            .limit(5)
            .collect(Collectors.toList());
    }

    /**
     * Recommandation avec logique simple (fallback)
     */
    private List<RecommendedEvent> recommendWithFallbackLogic(RecommendationRequest request) {
        logger.info("📊 Using fallback recommendation logic");
        
        List<Event> allEvents = eventRepository.findAll().stream()
            .filter(event -> event.getStatus() == EventStatus.Upcoming || 
                           event.getStatus() == EventStatus.Ongoing)
            .collect(Collectors.toList());

        if (allEvents.isEmpty()) {
            return new ArrayList<>();
        }

        // Convertir les catégories aimées en EventCategory
        List<EventCategory> likedCategories = request.getCategoriesLiked().stream()
            .map(cat -> {
                try {
                    return EventCategory.valueOf(cat.replace(" ", "_").toUpperCase());
                } catch (Exception e) {
                    return null;
                }
            })
            .filter(cat -> cat != null)
            .collect(Collectors.toList());

        // Recommander les événements de la même catégorie d'abord
        List<RecommendedEvent> recommendations = allEvents.stream()
            .filter(event -> likedCategories.isEmpty() || likedCategories.contains(event.getCategory()))
            .limit(5)
            .map(this::convertToRecommendedEvent)
            .collect(Collectors.toList());

        // Si pas assez de recommandations, ajouter d'autres événements
        if (recommendations.size() < 5) {
            List<RecommendedEvent> additionalEvents = allEvents.stream()
                .filter(event -> !likedCategories.contains(event.getCategory()))
                .limit(5 - recommendations.size())
                .map(this::convertToRecommendedEvent)
                .collect(Collectors.toList());
            recommendations.addAll(additionalEvents);
        }

        logger.info("✅ Fallback recommendations: {} events", recommendations.size());
        return recommendations;
    }

    /**
     * Construit un JSON simple des événements
     */
    private String buildEventsJson(List<Event> events) {
        StringBuilder sb = new StringBuilder();
        for (Event event : events) {
            int availableSeats = event.getPlacesLimit() - event.getReservedPlaces();
            sb.append(String.format(
                "ID: %d, Nom: %s, Catégorie: %s, Date: %s, Places: %d\n",
                event.getId(),
                event.getName(),
                event.getCategory(),
                event.getDate(),
                availableSeats
            ));
        }
        return sb.toString();
    }

    /**
     * Parse les IDs recommandés depuis la réponse de l'IA
     */
    private List<Long> parseRecommendedIds(String aiResponse) {
        List<Long> ids = new ArrayList<>();
        try {
            // Nettoie la réponse
            String cleanResponse = aiResponse.replaceAll("[^0-9,]", "");
            String[] parts = cleanResponse.split(",");

            for (String part : parts) {
                if (!part.trim().isEmpty()) {
                    ids.add(Long.parseLong(part.trim()));
                }
            }
        } catch (Exception e) {
            // Ignore les erreurs de parsing
        }
        return ids;
    }

    /**
     * Convertit un Event en RecommendedEvent
     */
    private RecommendedEvent convertToRecommendedEvent(Event event) {
        int availableSeats = event.getPlacesLimit() - event.getReservedPlaces();
        return new RecommendedEvent(
            event.getId(),
            event.getName(),
            event.getCategory().toString(),
            event.getDate(),
            event.getDescription(),
            availableSeats
        );
    }
}
