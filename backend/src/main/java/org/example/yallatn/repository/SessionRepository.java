package org.example.yallatn.repository;

import org.example.yallatn.model.Session;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.Optional;

public interface SessionRepository extends JpaRepository<Session, Long> {
    
    Optional<Session> findBySessionIdAndActiveTrue(String sessionId);
    
    void deleteByExpiresAtBefore(LocalDateTime now);
    
    void deleteByUserId(Long userId);
}
