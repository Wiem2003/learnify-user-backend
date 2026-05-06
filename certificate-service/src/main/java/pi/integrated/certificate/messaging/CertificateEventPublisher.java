package pi.integrated.certificate.messaging;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;
import pi.integrated.certificate.config.RabbitMQConfig;

/**
 * Publishes certificate events to RabbitMQ.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class CertificateEventPublisher {

    private final RabbitTemplate rabbitTemplate;

    public void publishCertificateIssued(CertificateIssuedEvent event) {
        try {
            log.info("Publishing certificate.issued event for user {} course {}", event.getUserId(), event.getCourseId());
            rabbitTemplate.convertAndSend(
                    RabbitMQConfig.CERTIFICATE_EXCHANGE,
                    RabbitMQConfig.CERTIFICATE_ISSUED_KEY,
                    event
            );
        } catch (Exception e) {
            log.warn("RabbitMQ unavailable — certificate.issued event not published: {}", e.getMessage());
        }
    }
}
