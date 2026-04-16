package pi.integrated.ai.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDateTime;
import java.util.List;

/**
 * MongoDB document for storing AI chat history.
 * Uses MongoDB instead of MySQL for flexible schema and fast document queries.
 * This demonstrates the advanced microservice technology requirement (different DB per service).
 */
@Document(collection = "chat_history")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatHistory {

    @Id
    private String id;

    @Indexed
    private Long userId;

    private String sessionId;

    private List<ChatMessage> messages;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ChatMessage {
        private String role; // "user" or "assistant"
        private String content;
        private LocalDateTime timestamp;
    }
}
