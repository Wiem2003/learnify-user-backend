package learnifyapp.userandpreevaluation.messaging;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

/**
 * Publishes user-related events to RabbitMQ.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class UserEventPublisher {

    private final RabbitTemplate rabbitTemplate;

    public void publishUserRegistered(UserRegisteredEvent event) {
        try {
            log.info("Publishing user.registered event for user {} ({})", event.getUserId(), event.getEmail());
            rabbitTemplate.convertAndSend(
                    RabbitMQConfig.USER_EXCHANGE,
                    RabbitMQConfig.USER_REGISTERED_KEY,
                    event
            );
        } catch (Exception e) {
            log.warn("RabbitMQ unavailable — user.registered event not published: {}", e.getMessage());
        }
    }
}
