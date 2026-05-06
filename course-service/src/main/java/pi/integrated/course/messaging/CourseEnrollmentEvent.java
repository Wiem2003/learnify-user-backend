package pi.integrated.course.messaging;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * Event received from payment-service when a student pays for a course.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CourseEnrollmentEvent implements Serializable {
    private Long userId;
    private String userName;
    private String userEmail;
    private Long courseId;
    private String courseTitle;
    private Double amount;
    private String transactionId;
    private LocalDateTime paymentDate;
}
