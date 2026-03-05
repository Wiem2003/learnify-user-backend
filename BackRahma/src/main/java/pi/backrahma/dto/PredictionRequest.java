package pi.backrahma.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PredictionRequest {
    private int likes;
    private int reservations;
    private int placesRestantes;
}
