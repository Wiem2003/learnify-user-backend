# 🔧 SOLUTION: Créer la table RESERVATION

## ❌ PROBLÈME IDENTIFIÉ
La table `reservation` n'existe PAS dans la base de données `event-db1`.
C'est pourquoi vous obtenez l'erreur 400 lors de la réservation.

## ✅ SOLUTION IMMÉDIATE

### Étape 1: Ouvrir phpMyAdmin
1. Allez sur: http://localhost/phpmyadmin
2. Sélectionnez la base de données `event-db1` dans le menu de gauche

### Étape 2: Exécuter le script SQL
1. Cliquez sur l'onglet "SQL" en haut
2. Copiez-collez ce script COMPLET:

```sql
USE `event-db1`;

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
```

3. Cliquez sur "Exécuter" (bouton en bas à droite)

### Étape 3: Vérifier la création
Après l'exécution, vous devriez voir:
- ✅ Message de succès
- La table `reservation` apparaît dans la liste des tables à gauche

### Étape 4: Vérifier la structure
Cliquez sur la table `reservation` et vérifiez qu'elle contient ces colonnes:
- `id` (BIGINT, AUTO_INCREMENT, PRIMARY KEY)
- `ticket_code` (VARCHAR(255), UNIQUE)
- `reservation_date` (DATETIME)
- `status` (ENUM: CONFIRMED, CANCELLED, PENDING)
- `event_id` (BIGINT, FOREIGN KEY vers event)
- `participant_id` (BIGINT, FOREIGN KEY vers participant)

## 🎯 APRÈS LA CRÉATION

### 1. Redémarrer le backend (optionnel mais recommandé)
```bash
cd BackRahma
mvn spring-boot:run
```

### 2. Tester la réservation
1. Allez sur: http://localhost:4201/events
2. Cliquez sur un événement
3. Cliquez sur "Réserver"
4. ✅ La réservation devrait fonctionner maintenant!

## 📊 TABLES DANS event-db1

Après cette opération, vous devriez avoir ces 5 tables:
1. ✅ `event` (existe déjà)
2. ✅ `participant` (existe déjà)
3. ✅ `organizer` (existe déjà)
4. ✅ `event_like` (existe déjà)
5. ✅ `reservation` (NOUVELLE - à créer maintenant)
6. ✅ `event_participants` (table de liaison ManyToMany - créée automatiquement)

## 🔍 POURQUOI CE PROBLÈME?

Hibernate est configuré avec `spring.jpa.hibernate.ddl-auto=update`, ce qui devrait créer automatiquement les tables.
Cependant, parfois la table n'est pas créée si:
- Le backend n'a jamais été démarré après l'ajout de l'entité Reservation
- Il y a eu une erreur lors du démarrage précédent
- La connexion à la base de données a échoué

## ⚠️ IMPORTANT

Une fois la table créée, NE PAS la supprimer! Elle contient toutes les réservations des utilisateurs.

## 🎉 RÉSULTAT ATTENDU

Après avoir créé la table `reservation`:
- ✅ Les réservations fonctionneront
- ✅ Les QR codes seront générés
- ✅ Les PDF de tickets seront créés
- ✅ Le scan de tickets fonctionnera
- ✅ Les prédictions IA fonctionneront
- ✅ Les recommandations IA fonctionneront
