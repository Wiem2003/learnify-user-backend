-- Script pour corriger l'erreur 400 (Bad Request)
-- L'erreur vient probablement de réservations en double

USE backrahma;

-- 1. Voir toutes les réservations existantes
SELECT r.id, r.ticket_code, r.status, e.name as event_name, p.full_name as participant_name
FROM reservation r
JOIN event e ON r.event_id = e.id
JOIN participant p ON r.participant_id = p.id;

-- 2. Supprimer toutes les réservations (pour recommencer à zéro)
DELETE FROM reservation;

-- 3. Réinitialiser le compteur de places réservées
UPDATE event SET reserved_places = 0;

-- 4. Vérifier que tout est propre
SELECT id, name, reserved_places, places_limit FROM event;
SELECT * FROM participant;
SELECT * FROM reservation;

-- 5. Maintenant vous pouvez réserver à nouveau!
