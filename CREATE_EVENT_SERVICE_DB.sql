-- ============================================
-- CRÉATION BASE DE DONNÉES EVENT-SERVICE-DB
-- ============================================

-- Créer la base de données pour le microservice Event-Service
CREATE DATABASE IF NOT EXISTS `event-service-db` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_general_ci;

-- Utiliser la base de données
USE `event-service-db`;

-- Message de confirmation
SELECT 'Base de données event-service-db créée avec succès!' AS Message;

-- Afficher les bases de données
SHOW DATABASES LIKE 'event%';
