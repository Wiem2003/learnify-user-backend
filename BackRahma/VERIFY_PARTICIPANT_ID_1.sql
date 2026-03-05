-- Vérifier que le participant avec id=1 existe
-- Si non, le créer

USE `event-db1`;

-- Vérifier si le participant id=1 existe
SELECT * FROM participant WHERE id = 1;

-- Si le résultat est vide, exécuter cette commande pour créer un participant par défaut:
INSERT INTO participant (id, full_name, email, attended) 
VALUES (1, 'Guest User', 'guest@example.com', 0)
ON DUPLICATE KEY UPDATE full_name = full_name;

-- Vérifier à nouveau
SELECT * FROM participant WHERE id = 1;

-- Afficher tous les participants
SELECT * FROM participant;
