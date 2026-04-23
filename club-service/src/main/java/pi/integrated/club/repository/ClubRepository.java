package pi.integrated.club.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import pi.integrated.club.entity.Club;

public interface ClubRepository extends JpaRepository<Club, Long> {

    @Modifying
    @Query("UPDATE Club c SET c.currentMembers = c.currentMembers + 1 WHERE c.id = :id")
    void incrementMembers(@Param("id") Long id);
}
