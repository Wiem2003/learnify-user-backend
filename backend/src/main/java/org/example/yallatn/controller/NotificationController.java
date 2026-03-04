package org.example.yallatn.controller;

import org.example.yallatn.annotation.RequireRole;
import org.example.yallatn.dto.NotificationDTO;
import org.example.yallatn.model.User;
import org.example.yallatn.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping
    @RequireRole({"ADMIN", "TEACHER"})
    public ResponseEntity<List<NotificationDTO>> getUnread(HttpServletRequest httpRequest) {
        User currentUser = (User) httpRequest.getAttribute("currentUser");
        return ResponseEntity.ok(notificationService.getUnreadForUserWithSync(currentUser.getId()));
    }

    @GetMapping("/count")
    @RequireRole({"ADMIN", "TEACHER"})
    public ResponseEntity<Map<String, Long>> getUnreadCount(HttpServletRequest httpRequest) {
        User currentUser = (User) httpRequest.getAttribute("currentUser");
        notificationService.ensureTeacherNotificationsForMeetings(currentUser.getId());
        long count = notificationService.countUnread(currentUser.getId());
        return ResponseEntity.ok(Map.of("count", count));
    }

    @PatchMapping("/{id}/read")
    @RequireRole({"ADMIN", "TEACHER"})
    public ResponseEntity<Void> markAsRead(@PathVariable Long id, HttpServletRequest httpRequest) {
        User currentUser = (User) httpRequest.getAttribute("currentUser");
        notificationService.markAsRead(id, currentUser.getId());
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/read-all")
    @RequireRole({"ADMIN", "TEACHER"})
    public ResponseEntity<Void> markAllAsRead(HttpServletRequest httpRequest) {
        User currentUser = (User) httpRequest.getAttribute("currentUser");
        notificationService.markAllAsRead(currentUser.getId());
        return ResponseEntity.noContent().build();
    }
}
