package org.example.yallatn.dto;

import java.time.LocalDateTime;

public class MeetingDTO {

    private Long id;
    private Long applicationId;
    private String applicationJobTitle;
    /** Nested for frontend: meeting.application?.id */
    private IdRef application;
    private Long assignedToId;
    private String assignedToName;
    /** Nested for frontend: meeting.assignedTo (id, name) */
    private UserRef assignedTo;
    private LocalDateTime meetingDate;
    private String notes;

    public static class IdRef {
        public Long id;
        public IdRef() {}
        public IdRef(Long id) { this.id = id; }
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
    }

    public static class UserRef {
        public Long id;
        public String name;
        public UserRef() {}
        public UserRef(Long id, String name) { this.id = id; this.name = name; }
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
    }

    public MeetingDTO() {
    }

    public MeetingDTO(Long id, Long applicationId, String applicationJobTitle,
                     IdRef application, Long assignedToId, String assignedToName, UserRef assignedTo,
                     LocalDateTime meetingDate, String notes) {
        this.id = id;
        this.applicationId = applicationId;
        this.applicationJobTitle = applicationJobTitle;
        this.application = application;
        this.assignedToId = assignedToId;
        this.assignedToName = assignedToName;
        this.assignedTo = assignedTo;
        this.meetingDate = meetingDate;
        this.notes = notes;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getApplicationId() { return applicationId; }
    public void setApplicationId(Long applicationId) { this.applicationId = applicationId; }
    public String getApplicationJobTitle() { return applicationJobTitle; }
    public void setApplicationJobTitle(String applicationJobTitle) { this.applicationJobTitle = applicationJobTitle; }
    public IdRef getApplication() { return application; }
    public void setApplication(IdRef application) { this.application = application; }
    public Long getAssignedToId() { return assignedToId; }
    public void setAssignedToId(Long assignedToId) { this.assignedToId = assignedToId; }
    public String getAssignedToName() { return assignedToName; }
    public void setAssignedToName(String assignedToName) { this.assignedToName = assignedToName; }
    public UserRef getAssignedTo() { return assignedTo; }
    public void setAssignedTo(UserRef assignedTo) { this.assignedTo = assignedTo; }
    public LocalDateTime getMeetingDate() { return meetingDate; }
    public void setMeetingDate(LocalDateTime meetingDate) { this.meetingDate = meetingDate; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
