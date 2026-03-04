package org.example.yallatn.service;

import org.example.yallatn.dto.*;
import org.example.yallatn.model.Role;
import org.example.yallatn.model.Session;
import org.example.yallatn.model.User;
import org.example.yallatn.repository.SessionRepository;
import org.example.yallatn.repository.UserRepository;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final SessionRepository sessionRepository;

    public AuthService(UserRepository userRepository, SessionRepository sessionRepository) {
        this.userRepository = userRepository;
        this.sessionRepository = sessionRepository;
    }

    @Transactional
    public LoginResponse register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(BCrypt.hashpw(request.getPassword(), BCrypt.gensalt()));
        user.setRole(request.getRole() != null ? request.getRole() : Role.USER);

        User savedUser = userRepository.save(user);

        Session session = new Session();
        session.setUser(savedUser);
        Session savedSession = sessionRepository.save(session);

        return new LoginResponse(
                "Registration successful",
                savedSession.getSessionId(),
                mapToUserDTO(savedUser)
        );
    }

    @Transactional
    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!BCrypt.checkpw(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        Session session = new Session();
        session.setUser(user);
        Session savedSession = sessionRepository.save(session);

        return new LoginResponse(
                "Login successful",
                savedSession.getSessionId(),
                mapToUserDTO(user)
        );
    }

    @Transactional
    public void logout(String sessionId) {
        Session session = sessionRepository.findBySessionIdAndActiveTrue(sessionId)
                .orElseThrow(() -> new RuntimeException("Invalid session"));
        
        session.setActive(false);
        sessionRepository.save(session);
    }

    public User validateSession(String sessionId) {
        Session session = sessionRepository.findBySessionIdAndActiveTrue(sessionId)
                .orElseThrow(() -> new RuntimeException("Invalid or expired session"));

        if (session.getExpiresAt().isBefore(LocalDateTime.now())) {
            session.setActive(false);
            sessionRepository.save(session);
            throw new RuntimeException("Session expired");
        }

        return session.getUser();
    }

    public UserDTO getCurrentUser(String sessionId) {
        User user = validateSession(sessionId);
        return mapToUserDTO(user);
    }

    private UserDTO mapToUserDTO(User user) {
        return new UserDTO(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.getCreatedAt()
        );
    }

    @Transactional
    public void cleanupExpiredSessions() {
        sessionRepository.deleteByExpiresAtBefore(LocalDateTime.now());
    }
}
