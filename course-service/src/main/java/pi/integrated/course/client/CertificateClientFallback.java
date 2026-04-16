package pi.integrated.course.client;

import org.springframework.stereotype.Component;

import java.util.Map;

/**
 * Fallback for CertificateClient — returns a graceful response when certificate-service is down.
 */
@Component
public class CertificateClientFallback implements CertificateClient {

    @Override
    public Map<String, Object> createCertificate(Map<String, Object> request) {
        return Map.of(
            "status", "PENDING",
            "message", "Certificate service is temporarily unavailable. Certificate will be generated when service recovers."
        );
    }
}
