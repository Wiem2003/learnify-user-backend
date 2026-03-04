package org.example.yallatn.dto;

import java.time.LocalDateTime;

/**
 * Prochain meeting pour afficher le décompte (temps restant).
 */
public class NextMeetingDTO {

    private Long id;
    private LocalDateTime meetingDate;
    private String applicationJobTitle;
    private Long applicationId;
    private String assignedToName;

    public NextMeetingDTO() {
    }

    public NextMeetingDTO(Long id, LocalDateTime meetingDate, String applicationJobTitle, Long applicationId, String assignedToName) {
        this.id = id;
        this.meetingDate = meetingDate;
        this.applicationJobTitle = applicationJobTitle;
        this.applicationId = applicationId;
        this.assignedToName = assignedToName;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public LocalDateTime getMeetingDate() { return meetingDate; }
    public void setMeetingDate(LocalDateTime meetingDate) { this.meetingDate = meetingDate; }
    public String getApplicationJobTitle() { return applicationJobTitle; }
    public void setApplicationJobTitle(String applicationJobTitle) { this.applicationJobTitle = applicationJobTitle; }
    public Long getApplicationId() { return applicationId; }
    public void setApplicationId(Long applicationId) { this.applicationId = applicationId; }
    public String getAssignedToName() { return assignedToName; }
    public void setAssignedToName(String assignedToName) { this.assignedToName = assignedToName; }
}
