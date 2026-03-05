# 🔍 VÉRIFIER L'ERREUR EXACTE

## 📋 ÉTAPE 1: Vérifier la console du navigateur

Ouvrez la console (F12) et cherchez cette ligne:
```
Error details: Object
```

Cliquez sur le petit triangle à côté de "Object" pour voir les détails.

Vous devriez voir quelque chose comme:
```javascript
{
  status: 400,
  statusText: "Bad Request",
  message: "Le message d'erreur exact ici",
  error: "..."
}
```

## 📋 ÉTAPE 2: Vérifier si la table reservation existe

### Dans phpMyAdmin:
1. Ouvrez: http://localhost/phpmyadmin
2. Sélectionnez `event-db1`
3. Regardez la liste des tables à gauche

**Question**: Est-ce que vous voyez la table `reservation` dans la liste?

- ✅ OUI → La table existe, le problème est ailleurs
- ❌ NON → Vous devez créer la table (voir ci-dessous)

## 📋 ÉTAPE 3: Si la table n'existe PAS

Exécutez ce script dans phpMyAdmin (onglet SQL):

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

## 📋 ÉTAPE 4: Vérifier les logs du backend

Dans le terminal où le backend tourne, cherchez les erreurs.

Vous devriez voir quelque chose comme:
```
ERROR: ...
```

**Copiez l'erreur exacte et envoyez-la moi.**

## 📋 ÉTAPE 5: Vérifier que participant id=1 existe

Dans phpMyAdmin, exécutez:
```sql
SELECT * FROM participant WHERE id = 1;
```

**Question**: Est-ce que vous voyez un participant?

- ✅ OUI → Bon, continuez
- ❌ NON → Créez-le:

```sql
INSERT INTO participant (id, full_name, email, attended) 
VALUES (1, 'Guest User', 'guest@example.com', 0);
```

## 📋 ÉTAPE 6: Test direct avec curl

Ouvrez un terminal et exécutez:

```bash
curl -X POST http://localhost:8080/back/api/reservations \
  -H "Content-Type: application/json" \
  -d "{\"eventId\": 1, \"participantId\": 1}"
```

**Question**: Qu'est-ce que vous voyez?

- ✅ Succès → JSON avec ticketCode
- ❌ Erreur → Message d'erreur exact

## 🎯 RÉSUMÉ DES VÉRIFICATIONS

Cochez ce que vous avez vérifié:

- [ ] Console du navigateur (F12) - Message d'erreur exact
- [ ] Table `reservation` existe dans phpMyAdmin
- [ ] Participant id=1 existe dans la base
- [ ] Logs du backend dans le terminal
- [ ] Test curl direct

## 💡 ERREURS POSSIBLES

### Erreur 1: "Table 'event-db1.reservation' doesn't exist"
**Solution**: Créer la table avec le script SQL ci-dessus

### Erreur 2: "Cannot add or update a child row: a foreign key constraint fails"
**Solution**: Vérifier que l'événement et le participant existent

### Erreur 3: "Événement introuvable"
**Solution**: Vérifier que l'événement avec cet ID existe:
```sql
SELECT * FROM event WHERE id = 1;
```

### Erreur 4: "Cet événement n'est plus disponible"
**Solution**: Vérifier le status de l'événement:
```sql
UPDATE event SET status = 'Upcoming' WHERE id = 1;
```

### Erreur 5: "Cet événement est complet"
**Solution**: Vérifier les places:
```sql
SELECT name, reserved_places, places_limit FROM event WHERE id = 1;
```

## 🚀 PROCHAINE ÉTAPE

Une fois que vous avez fait ces vérifications, envoyez-moi:
1. Le message d'erreur exact de la console (F12)
2. Si la table `reservation` existe ou non
3. Les logs du backend
4. Le résultat du test curl

Je pourrai alors vous donner la solution exacte!
