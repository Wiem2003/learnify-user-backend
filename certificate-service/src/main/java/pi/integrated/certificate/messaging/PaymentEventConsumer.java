package pi.integrated.certificate.messaging;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;
import pi.integrated.certificate.config.RabbitMQConfig;
import pi.integrated.certificate.dto.CertificateDTO;
import pi.integrated.certificate.event.PaymentCompletedEvent;
import pi.integrated.certificate.messaging.CertificateEventPublisher;
import pi.integrated.certificate.messaging.CertificateIssuedEvent;
import pi.integrated.certificate.service.CertificateService;

/**
 * Async consumer: listens to payment.completed events from RabbitMQ.
 * When a payment is completed, automatically generates a certificate for the student.
 * This is the async communication scenario (RabbitMQ).
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class PaymentEventConsumer {

    private final CertificateService certificateService;
    private final CertificateEventPublisher certificateEventPublisher;

    @RabbitListener(queues = RabbitMQConfig.PAYMENT_QUEUE)
    public void onPaymentCompleted(PaymentCompletedEvent event) {
        log.info("Received payment.completed event for user {} course {}", 
                 event.getUserId(), event.getCourseId());
        try {
            CertificateDTO dto = new CertificateDTO();
            dto.setUserId(event.getUserId());
            dto.setUserName(event.getUserName());
            dto.setUserEmail(event.getUserEmail());
            dto.setCourseId(event.getCourseId());
            dto.setCourseTitle(event.getCourseTitle());
            dto.setStatus("ISSUED");

            certificateService.createCertificate(dto);
            log.info("Certificate generated successfully for user {} course {}", 
                     event.getUserId(), event.getCourseId());

            // Publish certificate.issued event so other services can react
            certificateEventPublisher.publishCertificateIssued(new CertificateIssuedEvent(
                    null,
                    event.getUserId(),
                    event.getUserName(),
                    event.getUserEmail(),
                    event.getCourseId(),
                    event.getCourseTitle(),
                    java.time.LocalDateTime.now()
            ));
        } catch (Exception e) {
            log.error("Failed to generate certificate for payment event: {}", e.getMessage());
        }
    }
}
