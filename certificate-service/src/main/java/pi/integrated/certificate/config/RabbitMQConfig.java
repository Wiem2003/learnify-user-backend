package pi.integrated.certificate.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String PAYMENT_EXCHANGE    = "payment.exchange";
    public static final String PAYMENT_QUEUE       = "payment.completed.queue";
    public static final String PAYMENT_ROUTING_KEY = "payment.completed";

    // Published by certificate-service after certificate generation
    public static final String CERTIFICATE_EXCHANGE    = "certificate.exchange";
    public static final String CERTIFICATE_ISSUED_QUEUE = "certificate.issued.queue";
    public static final String CERTIFICATE_ISSUED_KEY  = "certificate.issued";

    @Bean
    public TopicExchange paymentExchange() {
        return new TopicExchange(PAYMENT_EXCHANGE);
    }

    @Bean
    public TopicExchange certificateExchange() {
        return new TopicExchange(CERTIFICATE_EXCHANGE);
    }

    @Bean
    public Queue paymentCompletedQueue() {
        return QueueBuilder.durable(PAYMENT_QUEUE).build();
    }

    @Bean
    public Queue certificateIssuedQueue() {
        return QueueBuilder.durable(CERTIFICATE_ISSUED_QUEUE).build();
    }

    @Bean
    public Binding paymentBinding(Queue paymentCompletedQueue, TopicExchange paymentExchange) {
        return BindingBuilder.bind(paymentCompletedQueue).to(paymentExchange).with(PAYMENT_ROUTING_KEY);
    }

    @Bean
    public Binding certificateIssuedBinding(Queue certificateIssuedQueue, TopicExchange certificateExchange) {
        return BindingBuilder.bind(certificateIssuedQueue).to(certificateExchange).with(CERTIFICATE_ISSUED_KEY);
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
