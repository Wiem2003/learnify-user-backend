package pi.integrated.payment.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * Async event published to RabbitMQ when a payment is completed.
 * Consumed by certificate-service to trigger certificate generation.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentCompletedEvent implements Serializable {
    private Long userId;
    private String userName;
    private String userEmail;
    private Long courseId;
    private String courseTitle;
    private Double amount;
    private String transactionId;
    private LocalDateTime paymentDate;
}
