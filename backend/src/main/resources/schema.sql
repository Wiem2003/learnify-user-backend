-- YallaTn Database Schema

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_role CHECK (role IN ('USER', 'TEACHER', 'ADMIN'))
) ENGINE=InnoDB;

-- User sessions table (name "user_sessions" to avoid MySQL reserved word "session")
CREATE TABLE IF NOT EXISTS user_sessions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    session_id VARCHAR(255) NOT NULL UNIQUE,
    user_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    KEY idx_sessions_user_id (user_id),
    KEY idx_sessions_session_id (session_id)
) ENGINE=InnoDB;

-- Jobs table
CREATE TABLE IF NOT EXISTS jobs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    titre VARCHAR(255) NOT NULL,
    nb_places INT NOT NULL CHECK (nb_places >= 1),
    description TEXT,
    requirements TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deadline DATETIME NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'OPEN',
    CONSTRAINT chk_job_status CHECK (status IN ('OPEN', 'EXPIRED', 'CLOSED'))
) ENGINE=InnoDB;

-- Saved jobs (favoris candidat / comme LinkedIn)
CREATE TABLE IF NOT EXISTS saved_jobs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    job_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    UNIQUE KEY unique_saved_job (user_id, job_id),
    KEY idx_saved_jobs_user_id (user_id),
    KEY idx_saved_jobs_job_id (job_id)
) ENGINE=InnoDB;

-- CV profil enseignant pour recommandations ATS (meilleures offres selon le CV)
CREATE TABLE IF NOT EXISTS teacher_cv_profile (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL UNIQUE,
    cv_path VARCHAR(500),
    cv_extracted_text TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    KEY idx_teacher_cv_user_id (user_id)
) ENGINE=InnoDB;

-- Applications table
CREATE TABLE IF NOT EXISTS applications (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    job_id BIGINT NOT NULL,
    teacher_id BIGINT NOT NULL,
    cv_path VARCHAR(500),
    cv_extracted_text TEXT,
    certificat_path VARCHAR(500),
    motivation TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT chk_app_status CHECK (status IN ('PENDING', 'ACCEPTED', 'REJECTED')),
    CONSTRAINT unique_application UNIQUE (job_id, teacher_id),
    KEY idx_applications_job_id (job_id),
    KEY idx_applications_teacher_id (teacher_id)
) ENGINE=InnoDB;

-- Meetings table
CREATE TABLE IF NOT EXISTS meetings (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    application_id BIGINT NULL,
    assigned_to BIGINT NULL,
    meeting_date DATETIME NOT NULL,
    notes TEXT,
    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_meeting_per_application (application_id),
    KEY idx_meetings_assigned_to (assigned_to),
    KEY idx_meetings_date (meeting_date)
) ENGINE=InnoDB;

-- Notifications table (for meeting reminders and countdown)
CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT,
    meeting_id BIGINT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    KEY idx_notifications_user_id (user_id),
    KEY idx_notifications_meeting_id (meeting_id)
) ENGINE=InnoDB;

-- Ratings table
CREATE TABLE IF NOT EXISTS ratings (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    teacher_id BIGINT NOT NULL,
    student_id BIGINT NOT NULL,
    note INT NOT NULL CHECK (note BETWEEN 1 AND 5),
    commentaire TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT unique_rating UNIQUE (teacher_id, student_id),
    KEY idx_ratings_teacher_id (teacher_id),
    KEY idx_ratings_student_id (student_id)
) ENGINE=InnoDB;
