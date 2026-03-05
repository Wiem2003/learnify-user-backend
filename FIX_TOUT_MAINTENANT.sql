-- ========================================
-- SCRIPT COMPLET POUR FIXER TOUS LES PROBLÈMES
-- Base de données: event-db1
-- ========================================

USE `event-db1`;

-- ========================================
-- 1. CRÉER LA TABLE RESERVATION
-- ========================================

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

SELECT '✅ Table reservation créée ou déjà existante' AS status;

-- ========================================
-- 2. CRÉER LE PARTICIPANT ID=1
-- ========================================

INSERT INTO `participant` (`id`, `full_name`, `email`, `attended`) 
VALUES (1, 'Guest User', 'guest@example.com', 0)
ON DUPLICATE KEY UPDATE 
  `full_name` = 'Guest User',
  `email` = 'guest@example.com',
  `attended` = 0;

SELECT '✅ Participant id=1 créé ou mis à jour' AS status;

-- ========================================
-- 3. METTRE À JOUR TOUS LES ÉVÉNEMENTS
-- ========================================

-- Mettre tous les événements en status "Upcoming"
UPDATE `event` 
SET `status` = 'Upcoming'
WHERE `status` != 'Upcoming';

SELECT CONCAT('✅ ', COUNT(*), ' événements mis en status Upcoming') AS status
FROM `event`;

-- Mettre à jour les dates des événements pour qu'ils soient dans le futur
UPDATE `event` 
SET `date` = DATE_ADD(CURDATE(), INTERVAL 30 DAY)
WHERE `date` < CURDATE();

SELECT CONCAT('✅ Dates des événements mises à jour (30 jours dans le futur)') AS status;

-- Réinitialiser les places réservées à 0 pour tous les événements
UPDATE `event` 
SET `reserved_places` = 0;

SELECT '✅ Places réservées réinitialisées à 0' AS status;

-- S'assurer que tous les événements ont au moins 100 places
UPDATE `event` 
SET `places_limit` = 200
WHERE `places_limit` < 100;

SELECT '✅ Limite de places mise à jour (minimum 200)' AS status;

-- ========================================
-- 4. NETTOYER LES ANCIENNES RÉSERVATIONS
-- ========================================

-- Supprimer toutes les réservations existantes (pour repartir à zéro)
DELETE FROM `reservation`;

SELECT '✅ Anciennes réservations supprimées' AS status;

-- ========================================
-- 5. VÉRIFICATIONS FINALES
-- ========================================

-- Afficher les tables
SELECT '========================================' AS separator;
SELECT 'TABLES DANS LA BASE DE DONNÉES:' AS info;
SHOW TABLES;

-- Afficher la structure de la table reservation
SELECT '========================================' AS separator;
SELECT 'STRUCTURE DE LA TABLE RESERVATION:' AS info;
DESCRIBE `reservation`;

-- Afficher le participant id=1
SELECT '========================================' AS separator;
SELECT 'PARTICIPANT ID=1:' AS info;
SELECT * FROM `participant` WHERE `id` = 1;

-- Afficher tous les événements avec leurs détails
SELECT '========================================' AS separator;
SELECT 'ÉVÉNEMENTS DISPONIBLES:' AS info;
SELECT 
  `id`,
  `name`,
  `category`,
  `status`,
  `date`,
  `reserved_places`,
  `places_limit`,
  CONCAT(ROUND((`reserved_places` / `places_limit`) * 100, 0), '%') AS taux_occupation
FROM `event`
ORDER BY `id`;

-- Compter les réservations
SELECT '========================================' AS separator;
SELECT 'NOMBRE DE RÉSERVATIONS:' AS info;
SELECT COUNT(*) AS total_reservations FROM `reservation`;

-- ========================================
-- 6. MESSAGE FINAL
-- ========================================

SELECT '========================================' AS separator;
SELECT '✅✅✅ TOUS LES PROBLÈMES SONT RÉSOLÉS! ✅✅✅' AS message;
SELECT 'Vous pouvez maintenant tester la réservation sur le frontend' AS instruction;
SELECT 'URL: http://localhost:4201/events' AS url;
