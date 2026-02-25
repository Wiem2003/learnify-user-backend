package learnifyapp.userandpreevaluation.usermanagement.service;

import learnifyapp.userandpreevaluation.usermanagement.dto.NewDeviceInfo;
import learnifyapp.userandpreevaluation.usermanagement.entity.KnownDevice;
import learnifyapp.userandpreevaluation.usermanagement.entity.User;
import learnifyapp.userandpreevaluation.usermanagement.repository.KnownDeviceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class DeviceService {

    private final KnownDeviceRepository knownDeviceRepository;
    private final EmailService emailService;

    /**
     * @return true si c'est un nouveau device, false sinon
     */
    public boolean registerOrUpdateAndNotify(User user, NewDeviceInfo info) {

        // deviceId obligatoire pour détecter un nouvel appareil
        if (info.getDeviceId() == null || info.getDeviceId().isBlank()) {
            return false;
        }

        LocalDateTime now = LocalDateTime.now();

        var existingOpt = knownDeviceRepository.findByUserIdAndDeviceId(user.getId(), info.getDeviceId());

        if (existingOpt.isPresent()) {
            // ✅ device déjà connu -> update lastSeen
            KnownDevice kd = existingOpt.get();
            kd.setLastSeenAt(now);
            kd.setLastIp(info.getIp());
            if (info.getUserAgent() != null) kd.setUserAgent(info.getUserAgent());
            if (info.getPlatform() != null) kd.setPlatform(info.getPlatform());
            if (info.getLanguage() != null) kd.setLanguage(info.getLanguage());
            if (info.getTimezone() != null) kd.setTimezone(info.getTimezone());
            knownDeviceRepository.save(kd);
            return false;
        }

        // ✅ nouveau device -> save + envoyer mail
        KnownDevice kd = KnownDevice.builder()
                .user(user)
                .deviceId(info.getDeviceId())
                .userAgent(info.getUserAgent())
                .platform(info.getPlatform())
                .language(info.getLanguage())
                .timezone(info.getTimezone())
                .lastIp(info.getIp())
                .firstSeenAt(now)
                .lastSeenAt(now)
                .build();

        knownDeviceRepository.save(kd);

        // ✅ Mail alerte avec date/heure
        sendNewDeviceEmail(user, info, now);
        return true;
    }

    private void sendNewDeviceEmail(User user, NewDeviceInfo info, LocalDateTime loginAt) {
        String name = user.getFirstName();

        emailService.sendNewDeviceEmail(
                user.getEmail(),
                name,
                info.getIp(),
                info.getUserAgent(),
                info.getPlatform(),
                info.getLanguage(),
                info.getTimezone(),
                loginAt // ✅ NEW: date/heure ouverture
        );
    }
}