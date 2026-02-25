package learnifyapp.userandpreevaluation.usermanagement.service;

import com.sendgrid.*;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Attachments;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.net.URL;
import java.util.Base64;

// ✅ NEW imports (date/heure)
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;

@Service
public class EmailService {

    @Value("${sendgrid.api-key}")
    private String apiKey;

    @Value("${sendgrid.from}")
    private String fromEmail;

    public void sendWelcomeEmail(String to, String name) {
        try {
            Email from = new Email(fromEmail);
            Email toEmail = new Email(to);

            String subject = "Welcome to Learnify 🎉";

            // ✅ Logo URL (Imgur)
            String logoUrl = "https://i.imgur.com/kFYblvw.jpeg";

            // ✅ We'll embed it inline with CID
            String cid = "learnify-logo";

            String html =
                    "<div style='font-family: Arial, sans-serif; max-width:600px; margin:auto; border:1px solid #eee; padding:20px;'>" +
                            "  <div style='text-align:center; margin-bottom:20px;'>" +
                            "    <img src='cid:" + cid + "' alt='Learnify Logo' style='max-width:200px; height:auto;'/>" +
                            "  </div>" +
                            "  <h2 style='color:#333;'>Welcome " + name + " 👋</h2>" +
                            "  <p style='font-size:15px; color:#555;'>Your student account has been successfully created.</p>" +
                            "  <p style='font-size:15px; color:#555;'>You can now log in and start using the platform.</p>" +
                            "  <div style='text-align:center; margin:30px 0;'>" +
                            "    <a href='http://localhost:4200/login' " +
                            "       style='background-color:#4CAF50; color:white; padding:12px 20px; text-decoration:none; border-radius:5px; font-weight:bold;'>" +
                            "       Go to Learnify" +
                            "    </a>" +
                            "  </div>" +
                            "  <p style='font-size:12px; color:#999; text-align:center;'>© Learnify - All rights reserved</p>" +
                            "</div>";

            Content content = new Content("text/html", html);
            Mail mail = new Mail(from, subject, toEmail, content);

            // ✅ Download image and attach inline
            Attachments logoAttachment = new Attachments();
            logoAttachment.setType("image/jpeg");
            logoAttachment.setFilename("logo.jpeg");
            logoAttachment.setDisposition("inline");
            logoAttachment.setContentId(cid);

            byte[] imageBytes = downloadBytes(logoUrl);
            String base64 = Base64.getEncoder().encodeToString(imageBytes);
            logoAttachment.setContent(base64);

            mail.addAttachments(logoAttachment);

            SendGrid sg = new SendGrid(apiKey);
            Request request = new Request();
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());

            Response response = sg.api(request);

            if (response.getStatusCode() >= 400) {
                throw new RuntimeException("SendGrid error: " + response.getStatusCode()
                        + " body=" + response.getBody());
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private byte[] downloadBytes(String url) throws Exception {
        try (InputStream in = new URL(url).openStream()) {
            return in.readAllBytes();
        }
    }

    public void sendResetPinEmail(String to, String name, String pin) {
        try {
            Email from = new Email(fromEmail);
            Email toEmail = new Email(to);

            String subject = "Reset your Learnify password";

            String html =
                    "<div style='font-family: Arial, sans-serif; max-width:600px; margin:auto; border:1px solid #eee; padding:20px;'>" +
                            "  <h2 style='color:#333;'>Password Reset</h2>" +
                            "  <p style='color:#555;'>Hello " + name + ",</p>" +
                            "  <p style='color:#555;'>Use this PIN to reset your password:</p>" +
                            "  <div style='font-size:28px; font-weight:bold; letter-spacing:6px; text-align:center; margin:20px 0;'>" + pin + "</div>" +
                            "  <p style='color:#999; font-size:12px;'>This PIN expires in 10 minutes. If you did not request this, please ignore this email.</p>" +
                            "</div>";

            Content content = new Content("text/html", html);
            Mail mail = new Mail(from, subject, toEmail, content);

            SendGrid sg = new SendGrid(apiKey);
            Request request = new Request();
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());

            Response response = sg.api(request);
            if (response.getStatusCode() >= 400) {
                throw new RuntimeException("SendGrid error: " + response.getStatusCode()
                        + " body=" + response.getBody());
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    // ✅ MODIFIED: ajout loginAt pour afficher la date/heure
    public void sendNewDeviceEmail(String to, String name,
                                   String ip, String userAgent,
                                   String platform, String language, String timezone,
                                   LocalDateTime loginAt) {
        try {
            Email from = new Email(fromEmail);
            Email toEmail = new Email(to);

            String subject = "New login detected on your Learnify account";

            String safeName = (name == null || name.isBlank()) ? "User" : name;

            // ✅ format date/heure
            String whenText;
            LocalDateTime dt = (loginAt == null) ? LocalDateTime.now() : loginAt;

            try {
                ZoneId zone = (timezone == null || timezone.isBlank())
                        ? ZoneId.systemDefault()
                        : ZoneId.of(timezone);

                DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
                whenText = dt.atZone(ZoneId.systemDefault())
                        .withZoneSameInstant(zone)
                        .format(fmt) + " (" + zone + ")";
            } catch (Exception ignored) {
                DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
                whenText = dt.format(fmt);
            }

            String html =
                    "<div style='font-family: Arial, sans-serif; max-width:600px; margin:auto; border:1px solid #eee; padding:20px;'>" +
                            "  <h2 style='color:#333;'>New Device Login</h2>" +
                            "  <p style='color:#555;'>Hello " + safeName + ",</p>" +
                            "  <p style='color:#555;'>We detected a login to your Learnify account from a <b>new device</b>.</p>" +
                            "  <div style='background:#fafafa; border:1px solid #eee; padding:12px; border-radius:6px;'>" +
                            "    <p style='margin:6px 0;'><b>Date:</b> " + whenText + "</p>" + // ✅ NEW
                            "    <p style='margin:6px 0;'><b>IP:</b> " + (ip == null ? "-" : ip) + "</p>" +
                            "    <p style='margin:6px 0;'><b>User-Agent:</b> " + (userAgent == null ? "-" : userAgent) + "</p>" +
                            "    <p style='margin:6px 0;'><b>Platform:</b> " + (platform == null ? "-" : platform) + "</p>" +
                            "    <p style='margin:6px 0;'><b>Language:</b> " + (language == null ? "-" : language) + "</p>" +
                            "    <p style='margin:6px 0;'><b>Timezone:</b> " + (timezone == null ? "-" : timezone) + "</p>" +
                            "  </div>" +
                            "  <p style='color:#555; margin-top:16px;'>If this wasn't you, please change your password immediately.</p>" +
                            "  <p style='font-size:12px; color:#999; text-align:center; margin-top:20px;'>© Learnify - Security</p>" +
                            "</div>";

            Content content = new Content("text/html", html);
            Mail mail = new Mail(from, subject, toEmail, content);

            SendGrid sg = new SendGrid(apiKey);
            Request request = new Request();
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());

            Response response = sg.api(request);
            if (response.getStatusCode() >= 400) {
                throw new RuntimeException("SendGrid error: " + response.getStatusCode()
                        + " body=" + response.getBody());
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}