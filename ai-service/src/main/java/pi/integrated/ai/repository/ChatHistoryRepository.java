package pi.integrated.ai.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import pi.integrated.ai.entity.ChatHistory;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatHistoryRepository extends MongoRepository<ChatHistory, String> {
    List<ChatHistory> findByUserIdOrderByCreatedAtDesc(Long userId);
    Optional<ChatHistory> findBySessionId(String sessionId);
}
