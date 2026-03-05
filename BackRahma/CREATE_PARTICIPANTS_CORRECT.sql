-- Script SQL corrigé pour créer des participants
-- Basé sur la vraie structure de votre table participant

USE backrahma;

-- Créer des participants avec la bonne structure
INSERT INTO participant (full_name, email, attended) VALUES
('John Doe', 'john.doe@example.com', 0),
('Jane Smith', 'jane.smith@example.com', 0),
('Ahmed Ben Ali', 'ahmed.benali@example.com', 0),
('Fatma Trabelsi', 'fatma.trabelsi@example.com', 0),
('Mohamed Gharbi', 'mohamed.gharbi@example.com', 0);

-- Vérifier les participants créés
SELECT * FROM participant;

-- Vérifier l'ID du premier participant (devrait être 1)
SELECT id, full_name, email FROM participant ORDER BY id LIMIT 1;
