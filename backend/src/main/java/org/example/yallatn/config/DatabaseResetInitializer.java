package org.example.yallatn.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.env.Environment;

import java.sql.DriverManager;
import java.sql.Statement;
import java.util.List;

/**
 * Runs before the application context is refreshed. When
 * learnivo.reset-db-on-startup=true, drops and recreates the learnivo database
 * so Hibernate can create tables cleanly (fixes "Tablespace exists" errors).
 */
public final class DatabaseResetInitializer implements org.springframework.context.ApplicationContextInitializer<org.springframework.context.ConfigurableApplicationContext> {

    private static final Logger log = LoggerFactory.getLogger(DatabaseResetInitializer.class);
    private static final String DB_NAME = "learnivo";

    @Override
    public void initialize(org.springframework.context.ConfigurableApplicationContext applicationContext) {
        Environment env = applicationContext.getEnvironment();
        if (!Boolean.parseBoolean(env.getProperty("learnivo.reset-db-on-startup", "false"))) {
            return;
        }
        String url = env.getProperty("spring.datasource.url");
        String username = env.getProperty("spring.datasource.username", "root");
        String password = env.getProperty("spring.datasource.password", "");

        if (url == null || !url.contains(DB_NAME)) {
            return;
        }

        // Connect to server without database: .../learnivo?... -> .../?
        String serverUrl = url.replaceFirst("/" + DB_NAME + "\\?", "/?").replaceFirst("/" + DB_NAME + "$", "/");
        if (serverUrl.endsWith("/")) {
            serverUrl = serverUrl + "?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC";
        } else if (!serverUrl.contains("?")) {
            serverUrl = serverUrl + "?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC";
        }

        try (var conn = DriverManager.getConnection(serverUrl, username, password);
             Statement st = conn.createStatement()) {
            st.executeUpdate("DROP DATABASE IF EXISTS " + DB_NAME);
            st.executeUpdate("CREATE DATABASE " + DB_NAME + " CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
            log.info("Database '{}' was reset (drop + create). Set learnivo.reset-db-on-startup=false after first run.", DB_NAME);
        } catch (Exception e) {
            log.warn("Could not reset database (MySQL may be down or URL wrong). Error: {}", e.getMessage());
        }
    }
}
