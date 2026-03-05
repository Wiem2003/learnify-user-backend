package pi.backrahma.dto;

import lombok.*;
import pi.backrahma.entity.EventCategory;
import pi.backrahma.entity.EventStatus;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventRequest {
    private String name;
    private String category;
    private String status;
    private String date;
    private Integer placesLimit;
    private String description;
    private String location;
    private String organizerFirstName;
    private String organizerLastName;
}
