-- Migration: table CV profil enseignant pour recommandations ATS.
-- Exécuter une fois si la table n'existe pas.

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
