package pi.backrahma.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pi.backrahma.entity.Organizer;

public interface OrganizerRepository extends JpaRepository<Organizer, Long> {}