package learnifyapp.userandpreevaluation.usermanagement.controller;

import jakarta.servlet.http.HttpServletRequest;
import learnifyapp.userandpreevaluation.usermanagement.dto.NewDeviceInfo;
import learnifyapp.userandpreevaluation.usermanagement.entity.User;
import learnifyapp.userandpreevaluation.usermanagement.service.DeviceService;
import learnifyapp.userandpreevaluation.usermanagement.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.context.SecurityContextHolder;

@RestController
@RequestMapping("/api/security")
@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
public class SecurityController {

    private final UserService userService;
    private final DeviceService deviceService;

    @PostMapping("/register-device")
    public void registerDevice(@RequestBody NewDeviceInfo info, HttpServletRequest request) {

        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isBlank()) ip = request.getRemoteAddr();
        else ip = ip.split(",")[0].trim();

        info.setIp(ip);

        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userService.getByEmail(email);

        deviceService.registerOrUpdateAndNotify(user, info);
    }
}