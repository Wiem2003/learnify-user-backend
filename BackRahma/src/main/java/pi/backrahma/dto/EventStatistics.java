package pi.backrahma.dto;

import lombok.*;
import pi.backrahma.entity.Event;

import java.util.List;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventStatistics {
    private long totalEvents;
    private long totalReservations;
    private long totalParticipants;
    private List<Event> topReservedEvents;
    private Map<String, Long> eventsByCategory; // Répartition par catégorie pour charts
}
