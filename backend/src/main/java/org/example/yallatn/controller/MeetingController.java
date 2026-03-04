package org.example.yallatn.controller;

import org.example.yallatn.annotation.RequireRole;
import org.example.yallatn.dto.MeetingDTO;
import org.example.yallatn.dto.NextMeetingDTO;
import org.example.yallatn.model.User;
import org.example.yallatn.service.MeetingService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/meetings")
public class MeetingController {

    private final MeetingService meetingService;

    public MeetingController(MeetingService meetingService) {
        this.meetingService = meetingService;
    }

    @PostMapping
    @RequireRole({"ADMIN"})
    public ResponseEntity<MeetingDTO> scheduleMeeting(@RequestBody Map<String, Object> request) {
        Long applicationId = request.containsKey("applicationId") && request.get("applicationId") != null
                ? Long.valueOf(request.get("applicationId").toString())
                : null;
        Long evaluatorId = Long.valueOf(request.get("evaluatorId").toString());
        LocalDateTime meetingDate = LocalDateTime.parse(request.get("meetingDate").toString());
        
        MeetingDTO dto = meetingService.scheduleMeeting(applicationId, evaluatorId, meetingDate);
        return ResponseEntity.status(HttpStatus.CREATED).body(dto);
    }

    @GetMapping
    @RequireRole({"ADMIN"})
    public ResponseEntity<List<MeetingDTO>> getAllMeetings() {
        return ResponseEntity.ok(meetingService.getAllMeetings());
    }

    @GetMapping("/my-meetings")
    @RequireRole({"ADMIN", "TEACHER"})
    public ResponseEntity<List<MeetingDTO>> getMyMeetings(HttpServletRequest httpRequest) {
        User currentUser = (User) httpRequest.getAttribute("currentUser");
        return ResponseEntity.ok(meetingService.getMeetingsByEvaluator(currentUser.getId()));
    }

    @GetMapping("/next")
    @RequireRole({"ADMIN", "TEACHER"})
    public ResponseEntity<NextMeetingDTO> getNextMeeting(HttpServletRequest httpRequest) {
        User currentUser = (User) httpRequest.getAttribute("currentUser");
        return meetingService.getNextMeetingForUser(currentUser.getId())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.noContent().build());
    }

    @GetMapping("/{id}")
    @RequireRole({"ADMIN", "TEACHER"})
    public ResponseEntity<MeetingDTO> getMeetingById(@PathVariable Long id) {
        return ResponseEntity.ok(meetingService.getMeetingById(id));
    }

    @GetMapping("/application/{applicationId}")
    @RequireRole({"ADMIN"})
    public ResponseEntity<MeetingDTO> getMeetingByApplication(@PathVariable Long applicationId) {
        return ResponseEntity.ok(meetingService.getMeetingByApplication(applicationId));
    }

    @PutMapping("/{id}")
    @RequireRole({"ADMIN"})
    public ResponseEntity<MeetingDTO> updateMeeting(
            @PathVariable Long id,
            @RequestBody Map<String, Object> request) {
        
        LocalDateTime newDate = request.containsKey("meetingDate") && request.get("meetingDate") != null
                ? LocalDateTime.parse(request.get("meetingDate").toString()) 
                : null;
        Long newEvaluatorId = request.containsKey("evaluatorId") && request.get("evaluatorId") != null
                ? Long.valueOf(request.get("evaluatorId").toString()) 
                : null;
        String notes = request.containsKey("notes") && request.get("notes") != null
                ? request.get("notes").toString() 
                : null;

        return ResponseEntity.ok(meetingService.updateMeeting(id, newDate, newEvaluatorId, notes));
    }


    @DeleteMapping("/{id}")
    @RequireRole({"ADMIN"})
    public ResponseEntity<Map<String, String>> deleteMeeting(@PathVariable Long id) {
        meetingService.deleteMeeting(id);
        return ResponseEntity.ok(Map.of("message", "Meeting deleted successfully"));
    }
}
