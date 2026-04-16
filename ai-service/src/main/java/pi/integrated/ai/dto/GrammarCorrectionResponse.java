package pi.integrated.ai.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GrammarCorrectionResponse {
    private String original;
    private String corrected;
    private String explanation;
    private String mode;
    private boolean hasError;
}
