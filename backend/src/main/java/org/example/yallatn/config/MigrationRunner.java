package org.example.yallatn.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

/**
 * Exécute les migrations SQL au démarrage (tables/colonnes ajoutées après coup).
 * Permet de ne pas dépendre du client MySQL en ligne de commande.
 */
@Component
@Order(100)
public class MigrationRunner implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(MigrationRunner.class);

    private final JdbcTemplate jdbcTemplate;

    public MigrationRunner(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(ApplicationArguments args) {
        runTeacherCvProfileTable();
        runApplicationsCvExtractedTextColumn();
        runJobStatusAllowExpired();
        runJobPublicationScheduleTable();
        runEmailDomainYallatnToLearnify();
    }

    /** Met à jour les emails @yallatn.com en @learnify.com dans la table users. */
    private void runEmailDomainYallatnToLearnify() {
        try {
            int updated = jdbcTemplate.update("UPDATE users SET email = REPLACE(email, '@yallatn.com', '@learnify.com') WHERE email LIKE '%@yallatn.com'");
            if (updated > 0) {
                log.info("Migration: {} user(s) email updated from @yallatn.com to @learnify.com", updated);
            }
        } catch (Exception e) {
            log.warn("Migration email domain: {}", e.getMessage());
        }
    }

    private void runJobPublicationScheduleTable() {
        try {
            jdbcTemplate.execute(
                "CREATE TABLE IF NOT EXISTS job_publication_schedule (" +
                "id BIGINT PRIMARY KEY AUTO_INCREMENT, " +
                "job_id BIGINT NOT NULL UNIQUE, " +
                "opens_at TIMESTAMP NOT NULL, " +
                "FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE, " +
                "KEY idx_jps_opens_at (opens_at)" +
                ") ENGINE=InnoDB"
            );
            log.info("Migration: job_publication_schedule table OK (created if missing)");
        } catch (Exception e) {
            log.warn("Migration job_publication_schedule: {} (table may already exist)", e.getMessage());
        }
    }

    private void runTeacherCvProfileTable() {
        try {
            jdbcTemplate.execute(
                "CREATE TABLE IF NOT EXISTS teacher_cv_profile (" +
                "id BIGINT PRIMARY KEY AUTO_INCREMENT, " +
                "user_id BIGINT NOT NULL UNIQUE, " +
                "cv_path VARCHAR(500), " +
                "cv_extracted_text TEXT, " +
                "created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, " +
                "updated_at TIMESTAMP NULL, " +
                "FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE, " +
                "KEY idx_teacher_cv_user_id (user_id)" +
                ") ENGINE=InnoDB"
            );
            log.info("Migration: teacher_cv_profile table OK (created if missing)");
        } catch (Exception e) {
            log.warn("Migration teacher_cv_profile: {} (table may already exist)", e.getMessage());
        }
    }

    private void runApplicationsCvExtractedTextColumn() {
        try {
            jdbcTemplate.execute("ALTER TABLE applications ADD COLUMN cv_extracted_text TEXT AFTER cv_path");
            log.info("Migration: applications.cv_extracted_text column OK (added if missing)");
        } catch (Exception e) {
            if (e.getMessage() != null && e.getMessage().contains("Duplicate column")) {
                log.debug("Migration applications.cv_extracted_text: column already exists");
            } else {
                log.warn("Migration applications.cv_extracted_text: {}", e.getMessage());
            }
        }
    }

    /** Autorise le statut EXPIRED sur la table jobs (évite "Data truncated for column 'status'"). */
    private void runJobStatusAllowExpired() {
        // Si la colonne est en ENUM('OPEN','CLOSED'), la passer en VARCHAR pour accepter EXPIRED
        try {
            jdbcTemplate.execute("ALTER TABLE jobs MODIFY COLUMN status VARCHAR(20) NOT NULL DEFAULT 'OPEN'");
            log.info("Migration: jobs.status column is VARCHAR(20)");
        } catch (Exception e) {
            log.debug("Migration jobs MODIFY status: {}", e.getMessage());
        }
        // Supprimer l'ancienne contrainte CHECK (OPEN, CLOSED uniquement)
        try {
            jdbcTemplate.execute("ALTER TABLE jobs DROP CONSTRAINT chk_job_status");
            log.info("Migration: jobs chk_job_status dropped");
        } catch (Exception e) {
            try {
                jdbcTemplate.execute("ALTER TABLE jobs DROP CHECK chk_job_status");
                log.info("Migration: jobs chk_job_status dropped (CHECK)");
            } catch (Exception e2) {
                log.debug("Migration jobs drop constraint: {}", e2.getMessage());
            }
        }
        // Ajouter la contrainte avec EXPIRED
        try {
            jdbcTemplate.execute("ALTER TABLE jobs ADD CONSTRAINT chk_job_status CHECK (status IN ('OPEN', 'EXPIRED', 'CLOSED'))");
            log.info("Migration: jobs.status allows OPEN, EXPIRED, CLOSED");
        } catch (Exception e) {
            if (e.getMessage() != null && (e.getMessage().contains("Duplicate") || e.getMessage().contains("already exists"))) {
                log.debug("Migration jobs: constraint already present");
            } else {
                log.warn("Migration jobs ADD constraint: {}", e.getMessage());
            }
        }
    }
}
