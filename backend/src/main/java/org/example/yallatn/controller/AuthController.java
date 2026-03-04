package org.example.yallatn.controller;

import jakarta.validation.Valid;
import org.example.yallatn.dto.LoginRequest;
import org.example.yallatn.dto.LoginResponse;
import org.example.yallatn.dto.RegisterRequest;
import org.example.yallatn.dto.UserDTO;
import org.example.yallatn.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<LoginResponse> register(@Valid @RequestBody RegisterRequest request) {
        LoginResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(@RequestHeader("Authorization") String sessionId) {
        authService.logout(sessionId);
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }

    @GetMapping("/current-user")
    public ResponseEntity<UserDTO> getCurrentUser(@RequestHeader("Authorization") String sessionId) {
        UserDTO user = authService.getCurrentUser(sessionId);
        return ResponseEntity.ok(user);
    }
}
