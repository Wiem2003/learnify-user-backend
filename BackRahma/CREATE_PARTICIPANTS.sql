-- Script pour créer des participants de test
-- Exécutez ce script dans votre base de données MySQL

USE backrahma;

-- Créer des participants de test
INSERT INTO participant (first_name, last_name, email, phone) VALUES
('John', 'Doe', 'john.doe@example.com', '+216 12345678'),
('Jane', 'Smith', 'jane.smith@example.com', '+216 23456789'),
('Ahmed', 'Ben Ali', 'ahmed.benali@example.com', '+216 34567890'),
('Fatma', 'Trabelsi', 'fatma.trabelsi@example.com', '+216 45678901'),
('Mohamed', 'Gharbi', 'mohamed.gharbi@example.com', '+216 56789012');

-- Vérifier les participants créés
SELECT id, first_name, last_name, email, phone FROM participant;

-- Note: Le premier participant aura l'ID 1 (utilisé par défaut dans le frontend)
