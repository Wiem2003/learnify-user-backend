package pi.integrated.course.client;

import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.Map;

@Component
public class PaymentClientFallback implements PaymentClient {

    @Override
    public Map<String, Object> getPaidCourseIds(Long userId) {
        return Collections.emptyMap();
    }
}
