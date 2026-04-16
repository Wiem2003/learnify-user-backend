package pi.integrated.course.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;
import java.util.Map;

/**
 * Feign Client for synchronous communication with payment-service.
 * Used to check enrollment status (has user paid for a course).
 */
@FeignClient(name = "payment-service", fallback = PaymentClientFallback.class)
public interface PaymentClient {

    @GetMapping("/api/payments/user/{userId}/courses")
    Map<String, Object> getPaidCourseIds(@PathVariable Long userId);
}
