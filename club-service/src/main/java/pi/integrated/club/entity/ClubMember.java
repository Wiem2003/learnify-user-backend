package pi.integrated.club.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "club_members")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClubMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "club_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Club club;

    private Long userId;

    private String userEmail;

    private LocalDateTime joinedAt;
}
