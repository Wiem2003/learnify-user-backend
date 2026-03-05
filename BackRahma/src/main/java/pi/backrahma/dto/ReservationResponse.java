package pi.backrahma.dto;

import lombok.*;
import pi.backrahma.entity.ReservationStatus;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReservationResponse {
    private Long id;
    private String ticketCode;
    private LocalDateTime reservationDate;
    private ReservationStatus status;
    private String eventName;
    private String participantName;
    private String message;
}
