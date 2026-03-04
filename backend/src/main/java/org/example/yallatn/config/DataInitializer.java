package org.example.yallatn.config;

import org.example.yallatn.model.Role;
import org.example.yallatn.model.User;
import org.example.yallatn.repository.UserRepository;
import org.mindrot.jbcrypt.BCrypt;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    @Bean
    CommandLineRunner initDatabase(UserRepository userRepository) {
        return args -> {
            try {
                if (userRepository.findByEmail("admin@learnify.com").isEmpty()) {
                    User admin = new User();
                    admin.setName("System Admin");
                    admin.setEmail("admin@learnify.com");
                    admin.setPassword(BCrypt.hashpw("admin123", BCrypt.gensalt()));
                    admin.setRole(Role.ADMIN);
                    userRepository.save(admin);
                    log.info("Default admin created: admin@learnify.com / admin123");
                }
                if (userRepository.findByEmail("teacher@learnify.com").isEmpty()) {
                    User teacher = new User();
                    teacher.setName("John Teacher");
                    teacher.setEmail("teacher@learnify.com");
                    teacher.setPassword(BCrypt.hashpw("teacher123", BCrypt.gensalt()));
                    teacher.setRole(Role.TEACHER);
                    userRepository.save(teacher);
                    log.info("Default teacher created: teacher@learnify.com / teacher123");
                }
                if (userRepository.findByEmail("student@learnify.com").isEmpty()) {
                    User student = new User();
                    student.setName("Jane Student");
                    student.setEmail("student@learnify.com");
                    student.setPassword(BCrypt.hashpw("student123", BCrypt.gensalt()));
                    student.setRole(Role.USER);
                    userRepository.save(student);
                    log.info("Default student created: student@learnify.com / student123");
                }
            } catch (Exception e) {
                log.warn("Seed data not created (database not ready or tables missing). To fix: set learnivo.reset-db-on-startup=true in application.properties and restart once, or run with profile 'dev', or run: mysql -u root -e \"DROP DATABASE IF EXISTS learnivo; CREATE DATABASE learnivo;\" then restart.");
            }
        };
    }
}
