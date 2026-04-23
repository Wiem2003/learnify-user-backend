package learnifyapp.userandpreevaluation.usermanagement.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;

/**
 * Runs before DataInitializer (Order 1) to ensure the users table has all
 * required columns even when the DB was created with an older schema.
 * Safe to run on every startup — all ALTER TABLE are guarded by column existence checks.
 */
@Component
@Order(1)
public class SchemaMigrationRunner implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(SchemaMigrationRunner.class);
    private final DataSource dataSource;

    public SchemaMigrationRunner(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public void run(ApplicationArguments args) throws Exception {
        try (Connection conn = dataSource.getConnection(); Statement stmt = conn.createStatement()) {
            addColumnIfMissing(stmt, "users", "created_at",
                    "DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP");
            addColumnIfMissing(stmt, "users", "updated_at",
                    "DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP");
            addColumnIfMissing(stmt, "users", "app_pin_hash",
                    "VARCHAR(255) NULL");
            addColumnIfMissing(stmt, "users", "failed_login_attempts",
                    "INT NOT NULL DEFAULT 0");
            addColumnIfMissing(stmt, "users", "locked_until",
                    "DATETIME NULL");
            addColumnIfMissing(stmt, "users", "preevaluation_final_level",
                    "VARCHAR(8) NULL");
            addColumnIfMissing(stmt, "users", "about",
                    "VARCHAR(2000) NULL");
            addColumnIfMissing(stmt, "users", "avatar_url",
                    "VARCHAR(255) NULL");
            addColumnIfMissing(stmt, "users", "name",
                    "VARCHAR(512) NOT NULL DEFAULT ''");
            log.info("[SchemaMigration] users table schema is up to date.");
        } catch (Exception e) {
            log.warn("[SchemaMigration] Could not run migration: {}", e.getMessage());
        }
    }

    private void addColumnIfMissing(Statement stmt, String table, String column, String definition) throws Exception {
        String db = stmt.getConnection().getCatalog();
        String check = String.format(
                "SELECT COUNT(*) FROM information_schema.COLUMNS " +
                "WHERE TABLE_SCHEMA='%s' AND TABLE_NAME='%s' AND COLUMN_NAME='%s'",
                db, table, column);
        try (ResultSet rs = stmt.executeQuery(check)) {
            if (rs.next() && rs.getInt(1) == 0) {
                stmt.execute(String.format("ALTER TABLE `%s` ADD COLUMN `%s` %s", table, column, definition));
                log.info("[SchemaMigration] Added column {}.{}", table, column);
            }
        }
    }
}
