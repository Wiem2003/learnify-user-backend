-- Script pour créer la table reservation dans event-db1
-- Exécuter ce script dans phpMyAdmin ou MySQL Workbench

USE `event-db1`;

-- Créer la table reservation
CREATE TABLE IF NOT EXISTS `reservation` (
  `id` BIGINT(20) NOT NULL AUTO_INCREMENT,
  `ticket_code` VARCHAR(255) NOT NULL,
  `reservation_date` DATETIME(6) DEFAULT NULL,
  `status` ENUM('CONFIRMED', 'CANCELLED', 'PENDING') NOT NULL DEFAULT 'CONFIRMED',
  `event_id` BIGINT(20) NOT NULL,
  `participant_id` BIGINT(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_ticket_code` (`ticket_code`),
  KEY `FK_reservation_event` (`event_id`),
  KEY `FK_reservation_participant` (`participant_id`),
  CONSTRAINT `FK_reservation_event` FOREIGN KEY (`event_id`) REFERENCES `event` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_reservation_participant` FOREIGN KEY (`participant_id`) REFERENCES `participant` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Vérifier que la table a été créée
SELECT 'Table reservation créée avec succès!' AS message;
DESCRIBE reservation;
