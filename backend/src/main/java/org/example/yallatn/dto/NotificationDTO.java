package org.example.yallatn.dto;

import org.example.yallatn.model.Notification;

import java.time.LocalDateTime;

public class NotificationDTO {

    private Long id;
    private String type;
    private String title;
    private String message;
    private Long meetingId;
    private boolean read;
    private LocalDateTime createdAt;
    /** Date/heure du meeting si type lié à un meeting (pour décompte) */
    private LocalDateTime meetingDate;

    public NotificationDTO() {
    }

    public static NotificationDTO from(Notification n, LocalDateTime meetingDate) {
        NotificationDTO dto = new NotificationDTO();
        dto.setId(n.getId());
        dto.setType(n.getType().name());
        dto.setTitle(n.getTitle());
        dto.setMessage(n.getMessage());
        dto.setMeetingId(n.getMeetingId());
        dto.setRead(n.isRead());
        dto.setCreatedAt(n.getCreatedAt());
        dto.setMeetingDate(meetingDate);
        return dto;
    }

    public static NotificationDTO from(Notification n) {
        return from(n, null);
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public Long getMeetingId() { return meetingId; }
    public void setMeetingId(Long meetingId) { this.meetingId = meetingId; }
    public boolean isRead() { return read; }
    public void setRead(boolean read) { this.read = read; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getMeetingDate() { return meetingDate; }
    public void setMeetingDate(LocalDateTime meetingDate) { this.meetingDate = meetingDate; }
}
