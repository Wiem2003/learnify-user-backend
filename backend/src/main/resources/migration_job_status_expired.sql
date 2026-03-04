-- Migration: ne plus utiliser le statut EXPIRED (si vous l'aviez ajouté).
-- Les offres à date dépassée passent en CLOSED. Ce script remet la contrainte à OPEN/CLOSED uniquement.

-- Si des lignes ont déjà status='EXPIRED', les passer en CLOSED
UPDATE jobs SET status = 'CLOSED' WHERE status = 'EXPIRED';

-- Remettre la contrainte (MySQL)
ALTER TABLE jobs DROP CONSTRAINT chk_job_status;
ALTER TABLE jobs ADD CONSTRAINT chk_job_status CHECK (status IN ('OPEN', 'CLOSED'));
