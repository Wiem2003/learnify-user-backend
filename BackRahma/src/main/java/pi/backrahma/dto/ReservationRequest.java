package pi.backrahma.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReservationRequest {
    private Long eventId;
    private Long participantId;
}
