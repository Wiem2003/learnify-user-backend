package pi.integrated.course.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    // Consumed from payment-service
    public static final String PAYMENT_EXCHANGE          = "payment.exchange";
    public static final String COURSE_ENROLL_QUEUE       = "course.enrollment.queue";
    public static final String COURSE_ENROLL_ROUTING_KEY = "course.enrolled";

    @Bean
    public TopicExchange paymentExchange() {
        return new TopicExchange(PAYMENT_EXCHANGE);
    }

    @Bean
    public Queue courseEnrollmentQueue() {
        return QueueBuilder.durable(COURSE_ENROLL_QUEUE).build();
    }

    @Bean
    public Binding courseEnrollBinding(Queue courseEnrollmentQueue, TopicExchange paymentExchange) {
        return BindingBuilder.bind(courseEnrollmentQueue).to(paymentExchange).with(COURSE_ENROLL_ROUTING_KEY);
    }

    @Bean
    public Jackson2JsonMessageConverter messageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(messageConverter());
        return template;
    }
}
