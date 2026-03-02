package learnifyapp.userandpreevaluation.usermanagement.service;

import com.sendgrid.*;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Value("${sendgrid.api-key}")
    private String apiKey;

    @Value("${sendgrid.from}")
    private String fromEmail;

    // ✅ Optionnel : lien logo (pas de téléchargement). Laisse vide si tu veux juste du texte.
    // Exemple: https://learnify.com/assets/logo.png
    @Value("${learnify.logo-url:}")
    private String logoUrl;

    @Value("${learnify.app-url:http://localhost:4200}")
    private String appUrl;

    // ==================== PUBLIC METHODS (ASYNC) ====================

    @Async
    public void sendWelcomeEmail(String to, String name) {
        String subject = "Welcome to Learnify 🎉";
        String safeName = safe(name, "User");

        String html =
                wrapEmail(
                        headerBlock("Welcome " + escapeHtml(safeName) + " 👋") +
                                "<p style='font-size:15px; color:#555;'>Your student account has been successfully created.</p>" +
                                "<p style='font-size:15px; color:#555;'>You can now log in and start using the platform.</p>" +
                                button(appUrl + "/login", "Go to Learnify") +
                                footerBlock("© Learnify - All rights reserved")
                );

        sendHtml(to, subject, html, "sendWelcomeEmail");
    }

    @Async
    public void sendResetPinEmail(String to, String name, String pin) {
        String subject = "Reset your Learnify password";
        String safeName = safe(name, "User");

        String html =
                wrapEmail(
                        headerBlock("Password Reset") +
                                "<p style='color:#555;'>Hello " + escapeHtml(safeName) + ",</p>" +
                                "<p style='color:#555;'>Use this PIN to reset your password:</p>" +
                                "<div style='font-size:28px; font-weight:bold; letter-spacing:6px; text-align:center; margin:20px 0;'>" +
                                escapeHtml(pin) +
                                "</div>" +
                                "<p style='color:#999; font-size:12px;'>This PIN expires in 10 minutes. If you did not request this, please ignore this email.</p>" +
                                footerBlock("© Learnify")
                );

        sendHtml(to, subject, html, "sendResetPinEmail");
    }

    @Async
    public void sendNewDeviceEmail(String to, String name,
                                   String ip, String userAgent,
                                   String platform, String language, String timezone,
                                   LocalDateTime loginAt,
                                   String confirmUrl,
                                   String rejectUrl) {

        String subject = "New login detected on your Learnify account";
        String safeName = safe(name, "User");

        String whenText = formatWhen(loginAt, timezone);

        String html =
                wrapEmail(
                        headerBlock("New Device Login") +
                                "<p style='color:#555;'>Hello " + escapeHtml(safeName) + ",</p>" +
                                "<p style='color:#555;'>We detected a login attempt from a <b>new device</b>. Please confirm to allow access.</p>" +
                                "<div style='background:#fafafa; border:1px solid #eee; padding:12px; border-radius:6px;'>" +
                                "<p style='margin:6px 0;'><b>Date:</b> " + escapeHtml(whenText) + "</p>" +
                                "<p style='margin:6px 0;'><b>IP:</b> " + escapeHtml(safe(ip, "-")) + "</p>" +
                                "<p style='margin:6px 0;'><b>User-Agent:</b> " + escapeHtml(safe(userAgent, "-")) + "</p>" +
                                "<p style='margin:6px 0;'><b>Platform:</b> " + escapeHtml(safe(platform, "-")) + "</p>" +
                                "<p style='margin:6px 0;'><b>Language:</b> " + escapeHtml(safe(language, "-")) + "</p>" +
                                "<p style='margin:6px 0;'><b>Timezone:</b> " + escapeHtml(safe(timezone, "-")) + "</p>" +
                                "</div>" +
                                "<div style='text-align:center; margin:22px 0;'>" +
                                "<a href='" + escapeHtml(confirmUrl) + "' style='background:#28a745; color:white; padding:12px 18px; text-decoration:none; border-radius:6px; font-weight:bold; margin-right:10px;'>Confirm this device</a>" +
                                "<a href='" + escapeHtml(rejectUrl) + "' style='background:#dc3545; color:white; padding:12px 18px; text-decoration:none; border-radius:6px; font-weight:bold;'>Reject</a>" +
                                "</div>" +
                                "<p style='color:#555;'>If this wasn't you, click Reject and change your password immediately.</p>" +
                                footerBlock("© Learnify - Security")
                );

        sendHtml(to, subject, html, "sendNewDeviceEmail");
    }

    /**
     * Envoyé au personalEmail après création admin/tutor : identifiants Learnify.
     */
    @Async
    public void sendLearnifyAccountCreated(String toPersonalEmail, String learnifyEmail, String plainPassword) {
        String subject = "Your Learnify account has been created";

        String html =
                wrapEmail(
                        headerBlock("Your Learnify account has been created") +
                                "<p style='color:#555;'>Your Learnify credentials:</p>" +
                                "<div style='background:#fafafa; border:1px solid #eee; padding:12px; border-radius:6px;'>" +
                                "<p style='margin:6px 0;'><b>Learnify email:</b> " + escapeHtml(safe(learnifyEmail, "")) + "</p>" +
                                "<p style='margin:6px 0;'><b>Password:</b> " + escapeHtml(safe(plainPassword, "")) + "</p>" +
                                "</div>" +
                                "<p style='color:#555;'>You can change your password after login.</p>" +
                                footerBlock("© Learnify")
                );

        sendHtml(toPersonalEmail, subject, html, "sendLearnifyAccountCreated");
    }

    // ==================== CORE SENDGRID SENDER ====================

    private void sendHtml(String to, String subject, String html, String tag) {
        long t0 = System.currentTimeMillis();

        try {
            Email from = new Email(fromEmail);
            Email toEmail = new Email(to);

            Content content = new Content("text/html", html);
            Mail mail = new Mail(from, subject, toEmail, content);

            SendGrid sg = new SendGrid(apiKey);
            Request request = new Request();
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());

            logger.info("[Email:{}] Sending -> to={}, subject={}", tag, to, subject);

            Response response = sg.api(request);

            long dt = System.currentTimeMillis() - t0;
            int status = response.getStatusCode();

            if (status >= 400) {
                logger.error("[Email:{}] SendGrid ERROR status={} in {}ms body={}", tag, status, dt, response.getBody());
                // throw si tu veux propager l'erreur
                // throw new RuntimeException("SendGrid error: " + status + " body=" + response.getBody());
                return;
            }

            logger.info("[Email:{}] Sent OK status={} in {}ms", tag, status, dt);

        } catch (Exception e) {
            long dt = System.currentTimeMillis() - t0;
            logger.error("[Email:{}] FAILED after {}ms -> to={}, subject={}", tag, dt, to, subject, e);
        }
    }

    // ==================== HTML HELPERS ====================

    private String wrapEmail(String inner) {
        return "<div style='font-family: Arial, sans-serif; max-width:600px; margin:auto; border:1px solid #eee; padding:20px;'>" +
                brandBlock() +
                inner +
                "</div>";
    }

    private String brandBlock() {
        // ✅ Aucun téléchargement. Soit texte, soit <img src="...">
        if (logoUrl != null && !logoUrl.isBlank()) {
            return "<div style='text-align:center; margin-bottom:16px;'>" +
                    "<img src='" + escapeHtml(logoUrl) + "' alt='Learnify' style='max-width:180px; height:auto;'/>" +
                    "</div>";
        }
        return "<div style='text-align:center; margin-bottom:16px; font-weight:700; font-size:22px; color:#333;'>Learnify</div>";
    }

    private String headerBlock(String title) {
        return "<h2 style='color:#333; margin-top:0;'>" + escapeHtml(title) + "</h2>";
    }

    private String footerBlock(String text) {
        return "<p style='font-size:12px; color:#999; text-align:center; margin-top:20px;'>" + escapeHtml(text) + "</p>";
    }

    private String button(String url, String text) {
        return "<div style='text-align:center; margin:26px 0;'>" +
                "<a href='" + escapeHtml(url) + "' style='background-color:#4CAF50; color:white; padding:12px 20px; text-decoration:none; border-radius:5px; font-weight:bold;'>" +
                escapeHtml(text) +
                "</a>" +
                "</div>";
    }

    private String safe(String s, String fallback) {
        return (s == null || s.isBlank()) ? fallback : s;
    }

    private String formatWhen(LocalDateTime loginAt, String timezone) {
        LocalDateTime dt = (loginAt == null) ? LocalDateTime.now() : loginAt;

        try {
            ZoneId zone = (timezone == null || timezone.isBlank())
                    ? ZoneId.systemDefault()
                    : ZoneId.of(timezone);

            DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
            return dt.atZone(ZoneId.systemDefault())
                    .withZoneSameInstant(zone)
                    .format(fmt) + " (" + zone + ")";
        } catch (Exception ignored) {
            DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
            return dt.format(fmt);
        }
    }

    // Petit escape simple pour éviter injection HTML
    private String escapeHtml(String s) {
        if (s == null) return "";
        return s.replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&#39;");
    }
}