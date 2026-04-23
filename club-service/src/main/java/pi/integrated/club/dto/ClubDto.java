package pi.integrated.club.dto;

import lombok.Data;

@Data
public class ClubDto {
    private String name;
    private String description;
    private String category;
    private String schedule;
    private String requiredLevel;
    private int capacity;
    private String image;
    private Long tutorId;
    private String tutorName;
    private Long createdBy;
}
