package pi.integrated.club.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "club_requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClubRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "club_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Club club;

    /** userId from user-service */
    private Long userId;

    private String userEmail;

    private String userLevel;

    @Enumerated(EnumType.STRING)
    private RequestStatus status;

    private LocalDateTime requestedAt;

    private String rejectionReason;

    public enum RequestStatus {
        PENDING, ACCEPTED, REJECTED
    }
}
