-- Script de vérification des tables dans event-db1
-- Exécuter dans phpMyAdmin pour vérifier que toutes les tables existent

USE `event-db1`;

-- Afficher toutes les tables
SHOW TABLES;

-- Vérifier la structure de chaque table importante
SELECT 'Structure de la table EVENT:' AS info;
DESCRIBE event;

SELECT 'Structure de la table PARTICIPANT:' AS info;
DESCRIBE participant;

SELECT 'Structure de la table ORGANIZER:' AS info;
DESCRIBE organizer;

SELECT 'Structure de la table EVENT_LIKE:' AS info;
DESCRIBE event_like;

SELECT 'Structure de la table RESERVATION (doit exister):' AS info;
DESCRIBE reservation;

-- Compter les enregistrements
SELECT 'Nombre d\'événements:' AS info, COUNT(*) AS count FROM event;
SELECT 'Nombre de participants:' AS info, COUNT(*) AS count FROM participant;
SELECT 'Nombre de réservations:' AS info, COUNT(*) AS count FROM reservation;

-- Vérifier les contraintes de clés étrangères
SELECT 
    TABLE_NAME,
    COLUMN_NAME,
    CONSTRAINT_NAME,
    REFERENCED_TABLE_NAME,
    REFERENCED_COLUMN_NAME
FROM
    INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE
    REFERENCED_TABLE_SCHEMA = 'event-db1'
    AND TABLE_NAME = 'reservation';
