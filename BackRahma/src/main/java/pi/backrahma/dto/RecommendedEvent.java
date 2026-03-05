package pi.backrahma.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecommendedEvent {
    private Long id;
    private String name;
    private String category;
    private LocalDate date;
    private String description;
    private int availableSeats;
}
