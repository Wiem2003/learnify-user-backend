package pi.integrated.certificate.messaging;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * Event published by certificate-service after a certificate is successfully generated.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CertificateIssuedEvent implements Serializable {
    private Long certificateId;
    private Long userId;
    private String userName;
    private String userEmail;
    private Long courseId;
    private String courseTitle;
    private LocalDateTime issuedAt;
}
