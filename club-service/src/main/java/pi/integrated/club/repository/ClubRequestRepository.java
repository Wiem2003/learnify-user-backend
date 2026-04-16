package pi.integrated.club.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pi.integrated.club.entity.ClubRequest;
import java.util.List;
import java.util.Optional;

public interface ClubRequestRepository extends JpaRepository<ClubRequest, Long> {
    List<ClubRequest> findByStatus(ClubRequest.RequestStatus status);
    Optional<ClubRequest> findByClubIdAndUserId(Long clubId, Long userId);
    List<ClubRequest> findByUserId(Long userId);
}
