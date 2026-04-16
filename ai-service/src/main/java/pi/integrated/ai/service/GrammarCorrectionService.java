package pi.integrated.ai.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import pi.integrated.ai.dto.GrammarCorrectionResponse;

@Service
@RequiredArgsConstructor
@Slf4j
public class GrammarCorrectionService {

    private final GeminiService geminiService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public GrammarCorrectionResponse correct(String message, String mode) {
        String prompt = buildPrompt(message, mode);
        try {
            String raw = geminiService.chat("", prompt);
            return parseResponse(message, raw, mode);
        } catch (Exception e) {
            log.error("Grammar correction failed: {}", e.getMessage());
            return new GrammarCorrectionResponse(message, message, "AI correction unavailable.", mode, false);
        }
    }

    private String buildPrompt(String message, String mode) {
        return switch (mode != null ? mode : "correction") {
            case "teacher" -> """
                You are an English teacher. Analyze this sentence and respond in JSON only:
                {
                  "corrected": "<corrected sentence>",
                  "explanation": "<detailed grammar explanation>",
                  "hasError": true/false
                }
                Sentence: "%s"
                """.formatted(message);
            case "suggestion" -> """
                You are an English writing coach. Suggest a more natural or advanced version of this sentence. Respond in JSON only:
                {
                  "corrected": "<improved sentence>",
                  "explanation": "<why this version is better>",
                  "hasError": false
                }
                Sentence: "%s"
                """.formatted(message);
            default -> """
                You are an English grammar checker. Check this sentence and respond in JSON only (no markdown, no code block):
                {
                  "corrected": "<corrected sentence or same if correct>",
                  "explanation": "<brief explanation or 'Correct!' if no error>",
                  "hasError": true/false
                }
                Sentence: "%s"
                """.formatted(message);
        };
    }

    private GrammarCorrectionResponse parseResponse(String original, String raw, String mode) {
        try {
            // Strip markdown code blocks if present
            String json = raw.trim()
                .replaceAll("(?s)```json\\s*", "")
                .replaceAll("(?s)```\\s*", "")
                .trim();
            var node = objectMapper.readTree(json);
            String corrected = node.path("corrected").asText(original);
            String explanation = node.path("explanation").asText("");
            boolean hasError = node.path("hasError").asBoolean(false);
            return new GrammarCorrectionResponse(original, corrected, explanation, mode, hasError);
        } catch (Exception e) {
            log.warn("Could not parse Gemini JSON response, returning raw: {}", raw);
            return new GrammarCorrectionResponse(original, original, raw, mode, false);
        }
    }
}
