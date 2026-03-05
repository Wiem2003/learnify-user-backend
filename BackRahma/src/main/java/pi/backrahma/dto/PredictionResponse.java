package pi.backrahma.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PredictionResponse {
    private String result;  // "RISQUE_ELEVE" ou "RISQUE_FAIBLE"
    private String reason;  // Justification
}
