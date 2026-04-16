package pi.integrated.club.service;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendAcceptanceEmail(String to, String clubName) {
        try {
            MimeMessage msg = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(msg, true, "UTF-8");
            helper.setTo(to);
            helper.setSubject("✅ Welcome to " + clubName + "!");
            helper.setText("""
                <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:32px;background:#f9f9f9;border-radius:12px;">
                  <div style="background:linear-gradient(135deg,#3d3d60,#6c63ff);padding:24px;border-radius:10px;text-align:center;">
                    <h1 style="color:#fff;margin:0;font-size:24px;">🎉 Request Accepted!</h1>
                  </div>
                  <div style="padding:24px;background:#fff;border-radius:10px;margin-top:16px;">
                    <p style="font-size:16px;color:#333;">Congratulations!</p>
                    <p style="font-size:15px;color:#555;">Your request to join <strong>%s</strong> has been <span style="color:#10b981;font-weight:bold;">accepted</span>.</p>
                    <p style="font-size:15px;color:#555;">You can now access the club chat and participate in all activities.</p>
                    <div style="text-align:center;margin-top:24px;">
                      <a href="http://localhost:4200/clubs" style="background:#6c63ff;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:bold;">Go to Clubs</a>
                    </div>
                  </div>
                  <p style="text-align:center;color:#aaa;font-size:12px;margin-top:16px;">LearnifyEnglish Platform</p>
                </div>
                """.formatted(clubName), true);
            mailSender.send(msg);
            log.info("Acceptance email sent to {}", to);
        } catch (Exception e) {
            log.error("Failed to send acceptance email to {}: {}", to, e.getMessage(), e);
        }
    }

    public void sendRejectionEmail(String to, String clubName, String reason) {
        try {
            MimeMessage msg = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(msg, true, "UTF-8");
            helper.setTo(to);
            helper.setSubject("❌ Club Request Update — " + clubName);
            helper.setText("""
                <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:32px;background:#f9f9f9;border-radius:12px;">
                  <div style="background:linear-gradient(135deg,#3d3d60,#c84630);padding:24px;border-radius:10px;text-align:center;">
                    <h1 style="color:#fff;margin:0;font-size:24px;">Club Request Update</h1>
                  </div>
                  <div style="padding:24px;background:#fff;border-radius:10px;margin-top:16px;">
                    <p style="font-size:16px;color:#333;">Hello,</p>
                    <p style="font-size:15px;color:#555;">Your request to join <strong>%s</strong> has been <span style="color:#c84630;font-weight:bold;">rejected</span>.</p>
                    <div style="background:#fff3f3;border-left:4px solid #c84630;padding:12px 16px;border-radius:6px;margin:16px 0;">
                      <p style="margin:0;color:#c84630;font-size:14px;"><strong>Reason:</strong> %s</p>
                    </div>
                    <p style="font-size:14px;color:#888;">You may apply to other clubs that match your level.</p>
                    <div style="text-align:center;margin-top:24px;">
                      <a href="http://localhost:4200/clubs" style="background:#3d3d60;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:bold;">Browse Clubs</a>
                    </div>
                  </div>
                  <p style="text-align:center;color:#aaa;font-size:12px;margin-top:16px;">LearnifyEnglish Platform</p>
                </div>
                """.formatted(clubName, reason != null ? reason : "Request rejected by admin"), true);
            mailSender.send(msg);
            log.info("Rejection email sent to {}", to);
        } catch (Exception e) {
            log.error("Failed to send rejection email to {}: {}", to, e.getMessage(), e);
        }
    }
}
