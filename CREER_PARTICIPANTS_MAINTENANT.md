# 🔧 CRÉER LES PARTICIPANTS MAINTENANT

## ❌ Erreur actuelle
```
Failed to reserve spot. Please try again.
```

## 🎯 Cause
Il n'y a pas de participant avec l'ID 1 dans votre base de données.

## ✅ Solution (3 options)

### Option 1: Via MySQL Workbench (RECOMMANDÉ)

1. Ouvrir MySQL Workbench
2. Se connecter à votre base de données
3. Cliquer sur "Query" → "New Query Tab"
4. Copier-coller ce code:

```sql
USE backrahma;

-- Créer des participants
INSERT INTO participant (first_name, last_name, email, phone) VALUES
('John', 'Doe', 'john.doe@example.com', '+216 12345678'),
('Jane', 'Smith', 'jane.smith@example.com', '+216 23456789'),
('Ahmed', 'Ben Ali', 'ahmed.benali@example.com', '+216 34567890');

-- Vérifier que ça a marché
SELECT * FROM participant;
```

5. Cliquer sur l'éclair ⚡ pour exécuter
6. Vérifier que 3 lignes sont affichées

### Option 2: Via phpMyAdmin

1. Ouvrir phpMyAdmin
2. Sélectionner la base `backrahma`
3. Cliquer sur l'onglet "SQL"
4. Copier-coller le même code SQL ci-dessus
5. Cliquer sur "Exécuter"

### Option 3: Via ligne de commande

```bash
# Ouvrir un terminal
mysql -u root -p

# Entrer votre mot de passe MySQL
# Puis exécuter:
USE backrahma;

INSERT INTO participant (first_name, last_name, email, phone) VALUES
('John', 'Doe', 'john.doe@example.com', '+216 12345678'),
('Jane', 'Smith', 'jane.smith@example.com', '+216 23456789'),
('Ahmed', 'Ben Ali', 'ahmed.benali@example.com', '+216 34567890');

SELECT * FROM participant;

# Taper 'exit' pour quitter
```

## 🔍 Vérification

Après avoir créé les participants, vérifiez qu'ils existent:

```sql
SELECT id, first_name, last_name, email FROM participant;
```

Vous devriez voir:
```
+----+------------+-----------+---------------------------+
| id | first_name | last_name | email                     |
+----+------------+-----------+---------------------------+
|  1 | John       | Doe       | john.doe@example.com      |
|  2 | Jane       | Smith     | jane.smith@example.com    |
|  3 | Ahmed      | Ben Ali   | ahmed.benali@example.com  |
+----+------------+-----------+---------------------------+
```

## 🚀 Tester la réservation

1. Rafraîchir la page dans le navigateur (F5)
2. Cliquer sur "Réserver"
3. Vous devriez voir:
   - ✅ Message "Spot Reserved Successfully!"
   - Code ticket
   - QR Code
   - Bouton "Download PDF Ticket"

## 📊 Test rapide via API

Pour vérifier que tout fonctionne, testez directement l'API:

```bash
# Test 1: Vérifier que le participant existe
curl http://localhost:8080/back/api/reservations/participant/1

# Test 2: Créer une réservation
curl -X POST http://localhost:8080/back/api/reservations \
  -H "Content-Type: application/json" \
  -d '{"eventId":1,"participantId":1}'
```

## ❓ Si ça ne marche toujours pas

### Vérifier les logs backend

Dans le terminal où tourne le backend, vous devriez voir:
```
POST /api/reservations - 200 OK
```

Si vous voyez une erreur 404 ou 500, regardez le message d'erreur.

### Vérifier la console du navigateur (F12)

Ouvrez la console et regardez les erreurs. Vous devriez voir:
```javascript
✅ Attempting reservation: { eventId: 1, participantId: 1 }
✅ Reservation successful: { id: 1, ticketCode: "...", ... }
```

## 🎯 Résumé

1. **Créer les participants** avec le SQL ci-dessus
2. **Rafraîchir la page** (F5)
3. **Cliquer sur "Réserver"**
4. **Profiter!** ✅

---

**Note**: Le participant avec ID 1 sera utilisé pour toutes les réservations de test. En production, ceci devrait venir de l'authentification de l'utilisateur.
