package pi.backrahma.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pi.backrahma.entity.EventLike;

import java.util.Optional;

@Repository
public interface EventLikeRepository extends JpaRepository<EventLike, Long> {
    
    Optional<EventLike> findByEventIdAndParticipantId(Long eventId, Long participantId);
    
    boolean existsByEventIdAndParticipantId(Long eventId, Long participantId);
    
    long countByEventId(Long eventId);
    
    void deleteByEventIdAndParticipantId(Long eventId, Long participantId);
}
