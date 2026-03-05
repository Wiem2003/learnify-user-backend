package pi.backrahma.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecommendationRequest {
    private List<String> categoriesLiked;  // Catégories aimées par l'utilisateur
}
