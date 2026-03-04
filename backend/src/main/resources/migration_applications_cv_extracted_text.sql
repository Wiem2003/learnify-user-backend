-- Migration: ajout du texte extrait des CV pour l'ATS (filtrage / score de correspondance).
-- Exécuter une fois si la table applications existe déjà sans cette colonne.
-- (MySQL : si la colonne existe déjà, ignorer l'erreur.)

ALTER TABLE applications ADD COLUMN cv_extracted_text TEXT AFTER cv_path;
