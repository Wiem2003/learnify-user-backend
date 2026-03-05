package pi.backrahma.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class GoogleAIService {

    private static final Logger logger = LoggerFactory.getLogger(GoogleAIService.class);

    @Value("${google.ai.api.key}")
    private String apiKey;

    @Value("${google.ai.model}")
    private String model;

    private final WebClient webClient;
    private final ObjectMapper objectMapper;

    public GoogleAIService() {
        this.webClient = WebClient.builder()
                .baseUrl("https://generativelanguage.googleapis.com/v1beta")
                .build();
        this.objectMapper = new ObjectMapper();
    }

    /**
     * Appelle l'API Google Gemini avec un prompt
     */
    public String callGeminiAPI(String prompt) {
        try {
            logger.info("🤖 Calling Google AI API with model: {}", model);
            logger.debug("Prompt: {}", prompt);
            
            // Construction du corps de la requête
            Map<String, Object> requestBody = new HashMap<>();
            
            Map<String, Object> part = new HashMap<>();
            part.put("text", prompt);
            
            Map<String, Object> content = new HashMap<>();
            content.put("parts", List.of(part));
            
            requestBody.put("contents", List.of(content));

            String url = "/models/" + model + ":generateContent";
            logger.info("📡 Request URL: {}", url);
            logger.info("🔑 API Key (first 10 chars): {}...", apiKey.substring(0, Math.min(10, apiKey.length())));

            // Appel API
            String response = webClient.post()
                    .uri(uriBuilder -> uriBuilder
                            .path(url)
                            .queryParam("key", apiKey)
                            .build())
                    .header("Content-Type", "application/json")
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            logger.info("✅ Google AI API response received");
            logger.debug("Response: {}", response);

            // Parse la réponse JSON
            JsonNode jsonNode = objectMapper.readTree(response);
            String text = jsonNode
                    .path("candidates").get(0)
                    .path("content")
                    .path("parts").get(0)
                    .path("text").asText();

            logger.info("📝 Extracted text: {}", text);
            return text.trim();

        } catch (Exception e) {
            logger.error("❌ Error calling Google AI API: {}", e.getMessage(), e);
            throw new RuntimeException("Erreur lors de l'appel à Google AI API: " + e.getMessage(), e);
        }
    }
}
