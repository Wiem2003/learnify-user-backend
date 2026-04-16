package pi.integrated.course.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Map;

/**
 * Feign Client for synchronous communication with certificate-service.
 * Uses Eureka service discovery — no hardcoded URLs.
 */
@FeignClient(name = "certificate-service", fallback = CertificateClientFallback.class)
public interface CertificateClient {

    @PostMapping("/api/certificates")
    Map<String, Object> createCertificate(@RequestBody Map<String, Object> request);
}
