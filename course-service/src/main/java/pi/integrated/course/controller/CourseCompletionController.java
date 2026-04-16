package pi.integrated.course.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pi.integrated.course.client.CertificateClient;

import java.util.Map;

@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
public class CourseCompletionController {

    // Feign Client — replaces RestTemplate for synchronous inter-service call
    private final CertificateClient certificateClient;

    /**
     * Called when a student finishes a course.
     * Uses Feign Client to call certificate-service synchronously.
     *
     * POST /api/courses/{courseId}/complete
     * Body: { "userId": 1, "userName": "Taher Sahbi", "userEmail": "taher@gmail.com", "courseTitle": "Java Basics" }
     */
    @PostMapping("/{courseId}/complete")
    public ResponseEntity<?> completeCourse(
            @PathVariable Long courseId,
            @RequestBody Map<String, Object> body) {

        Map<String, Object> certRequest = Map.of(
            "userId",      body.get("userId"),
            "userName",    body.get("userName"),
            "userEmail",   body.get("userEmail"),
            "courseId",    courseId,
            "courseTitle", body.getOrDefault("courseTitle", "Course #" + courseId),
            "status",      "ISSUED"
        );

        try {
            Map<String, Object> certificate = certificateClient.createCertificate(certRequest);
            return ResponseEntity.ok(Map.of(
                "message", "Course completed! Certificate is being generated and will be sent to your email.",
                "certificate", certificate
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "error", "Certificate generation failed: " + e.getMessage()
            ));
        }
    }
}
