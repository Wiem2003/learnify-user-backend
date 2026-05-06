package learnifyapp.userandpreevaluation.messaging;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * Event published when a new user registers on the platform.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserRegisteredEvent implements Serializable {
    private Long userId;
    private String userName;
    private String email;
    private String role;       // STUDENT, TUTOR, CANDIDATE
    private LocalDateTime registeredAt;
}
