package learnifyapp.userandpreevaluation.usermanagement.repository;

import learnifyapp.userandpreevaluation.usermanagement.entity.KnownDevice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

public interface KnownDeviceRepository extends JpaRepository<KnownDevice, Long> {

    Optional<KnownDevice> findByUserIdAndDeviceId(Long userId, String deviceId);

    boolean existsByUserIdAndDeviceId(Long userId, String deviceId);

    // ✅ NEW: delete all known devices for a user (important before deleting user)
    @Modifying
    @Transactional
    @Query("delete from KnownDevice d where d.user.id = :userId")
    void deleteAllByUserId(Long userId);
}