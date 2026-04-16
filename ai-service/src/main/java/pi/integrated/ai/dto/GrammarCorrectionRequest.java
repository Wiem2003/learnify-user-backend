package pi.integrated.ai.dto;

import lombok.Data;

@Data
public class GrammarCorrectionRequest {
    private String message;
    private String mode; // "correction" | "teacher" | "suggestion"
}
