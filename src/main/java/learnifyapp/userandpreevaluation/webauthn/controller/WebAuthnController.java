package learnifyapp.userandpreevaluation.webauthn.controller;

import learnifyapp.userandpreevaluation.webauthn.service.WebAuthnService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/webauthn")
public class WebAuthnController {

    private final WebAuthnService service;

    public WebAuthnController(WebAuthnService service) {
        this.service = service;
    }

    // ===== Register (profile, authenticated) =====
    @PostMapping("/register/options")
    public Map<String, Object> registerOptions() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return service.startRegistration(email);
    }

    @PostMapping("/register/verify")
    public ResponseEntity<?> registerVerify(@RequestBody Map<String, Object> body) throws Exception {
        String requestId = (String) body.get("requestId");
        Object credential = body.get("credential");

        service.finishRegistration(requestId, credential);

        return ResponseEntity.ok("Passkey enabled");
    }

    // ===== Login (public) =====
    @PostMapping("/authenticate/options")
    public Map<String, Object> authenticateOptions() {
        return service.startAssertion();
    }

    @PostMapping("/authenticate/verify")
    public Map<String, Object> authenticateVerify(@RequestBody Map<String, Object> body) throws Exception {
        String requestId = (String) body.get("requestId");
        Object credential = body.get("credential");

        String token = service.finishAssertionAndIssueJwt(requestId, credential);
        return Map.of("token", token);
    }
}