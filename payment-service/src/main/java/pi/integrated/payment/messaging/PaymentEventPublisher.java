package pi.integrated.payment.messaging;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;
import pi.integrated.payment.config.RabbitMQConfig;
import pi.integrated.payment.event.PaymentCompletedEvent;

/**
 * Publishes payment events to RabbitMQ asynchronously.
 * Scenario 1: payment.completed → certificate-service generates certificate
 * Scenario 2: course.enrolled → course-service updates enrollment count
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class PaymentEventPublisher {

    private final RabbitTemplate rabbitTemplate;

    public void publishPaymentCompleted(PaymentCompletedEvent event) {
        log.info("Publishing payment.completed event for user {} course {}", event.getUserId(), event.getCourseId());
        rabbitTemplate.convertAndSend(
            RabbitMQConfig.PAYMENT_EXCHANGE,
            RabbitMQConfig.PAYMENT_ROUTING_KEY,
            event
        );
    }

    public void publishCourseEnrolled(PaymentCompletedEvent event) {
        log.info("Publishing course.enrolled event for user {} course {}", event.getUserId(), event.getCourseId());
        rabbitTemplate.convertAndSend(
            RabbitMQConfig.PAYMENT_EXCHANGE,
            RabbitMQConfig.COURSE_ENROLL_ROUTING_KEY,
            event
        );
    }
}
