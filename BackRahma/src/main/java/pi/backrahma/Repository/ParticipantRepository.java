package pi.backrahma.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pi.backrahma.entity.Participant;

public interface ParticipantRepository extends JpaRepository<Participant, Long> {}