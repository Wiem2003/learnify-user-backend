-- Migration: autoriser le statut EXPIRED pour les offres dont la date limite est dépassée.
-- À exécuter à la main si l'erreur "Data truncated for column 'status'" persiste après redémarrage.

-- 1) Supprimer l'ancienne contrainte (essayer l'une des deux lignes selon votre version MySQL)
ALTER TABLE jobs DROP CONSTRAINT chk_job_status;
-- ou si erreur "Unknown constraint" :
-- ALTER TABLE jobs DROP CHECK chk_job_status;

-- 2) Ajouter la contrainte avec EXPIRED
ALTER TABLE jobs ADD CONSTRAINT chk_job_status CHECK (status IN ('OPEN', 'EXPIRED', 'CLOSED'));
