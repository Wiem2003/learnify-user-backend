package pi.integrated.club.dto;

import lombok.Data;

@Data
public class JoinRequestDto {
    private Long userId;
    private String userEmail;
    private String userLevel; // e.g. A1, B1, C2
}
