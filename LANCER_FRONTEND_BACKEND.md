# 🚀 Guide : Lancer Frontend + Backend Ensemble

## 📋 Prérequis

- ✅ Node.js installé (version 18+)
- ✅ npm installé
- ✅ Java 17+ installé
- ✅ Maven installé
- ✅ MySQL installé et lancé

---

## 🎯 Méthode 1 : Deux Terminaux Séparés (Recommandé)

### Terminal 1 : Backend (Spring Boot)

```bash
# 1. Aller dans le dossier backend
cd BackRahma

# 2. Lancer Spring Boot
mvn spring-boot:run

# ✅ Attendre le message : "Started BackRahmaApplication"
# 🌐 Backend disponible sur : http://localhost:8080
```

### Terminal 2 : Frontend (Angular)

```bash
# 1. Aller dans le dossier frontend
cd FrontOffice-main

# 2. Installer les dépendances (première fois seulement)
npm install

# 3. Lancer Angular
npm start

# ✅ Attendre le message : "Compiled successfully"
# 🌐 Frontend disponible sur : http://localhost:4200
```

---

## 🎯 Méthode 2 : Script Automatique (Windows)

Créer un fichier `start-all.bat` à la racine du projet :

```batch
@echo off
echo 🚀 Démarrage Backend + Frontend...
echo.

REM Démarrer le backend
start "Backend Spring Boot" cmd /k "cd BackRahma && mvn spring-boot:run"

REM Attendre 10 secondes pour que le backend démarre
timeout /t 10 /nobreak

REM Démarrer le frontend
start "Frontend Angular" cmd /k "cd FrontOffice-main && npm start"

echo.
echo ✅ Backend : http://localhost:8080
echo ✅ Frontend : http://localhost:4200
echo.
pause
```

Puis exécuter :
```bash
start-all.bat
```

---

## 🎯 Méthode 3 : Script Automatique (Linux/Mac)

Créer un fichier `start-all.sh` à la racine du projet :

```bash
#!/bin/bash

echo "🚀 Démarrage Backend + Frontend..."
echo ""

# Démarrer le backend en arrière-plan
cd BackRahma
mvn spring-boot:run &
BACKEND_PID=$!

# Attendre 15 secondes pour que le backend démarre
echo "⏳ Attente du démarrage du backend..."
sleep 15

# Démarrer le frontend
cd ../FrontOffice-main
npm start &
FRONTEND_PID=$!

echo ""
echo "✅ Backend : http://localhost:8080 (PID: $BACKEND_PID)"
echo "✅ Frontend : http://localhost:4200 (PID: $FRONTEND_PID)"
echo ""
echo "Pour arrêter :"
echo "  kill $BACKEND_PID $FRONTEND_PID"
echo ""

# Attendre que l'utilisateur appuie sur Ctrl+C
wait
```

Rendre le script exécutable et lancer :
```bash
chmod +x start-all.sh
./start-all.sh
```

---

## 🔧 Configuration du Frontend pour l'API Backend

Le fichier `proxy.conf.json` est déjà configuré dans `FrontOffice-main` :

```json
{
  "/api": {
    "target": "http://localhost:8080",
    "secure": false,
    "changeOrigin": true
  }
}
```

Cela signifie que toutes les requêtes vers `/api/*` depuis le frontend seront automatiquement redirigées vers `http://localhost:8080/api/*`.

---

## 📝 Commandes Utiles

### Vérifier que tout fonctionne

```bash
# Backend
curl http://localhost:8080/api/events

# Frontend (ouvrir dans le navigateur)
http://localhost:4200
```

### Arrêter les serveurs

**Méthode 1 (Terminaux séparés) :**
- Dans chaque terminal : `Ctrl + C`

**Méthode 2/3 (Scripts) :**
- Fermer les fenêtres de terminal
- Ou utiliser `Ctrl + C` dans le terminal principal

### Relancer après modification

**Backend :**
```bash
# Arrêter avec Ctrl+C
# Puis relancer
mvn spring-boot:run
```

**Frontend :**
```bash
# Arrêter avec Ctrl+C
# Puis relancer
npm start
```

---

## 🌐 URLs d'Accès

| Service | URL | Description |
|---------|-----|-------------|
| **Backend API** | http://localhost:8080/api | API REST Spring Boot |
| **Frontend** | http://localhost:4200 | Application Angular |
| **API Events** | http://localhost:8080/api/events | Liste des événements |
| **API Stats** | http://localhost:8080/api/events/statistics | Statistiques |

---

## 🔍 Vérification du Bon Fonctionnement

### 1. Backend

```bash
# Tester l'API
curl http://localhost:8080/api/events

# Ou ouvrir dans le navigateur
http://localhost:8080/api/events
```

**Réponse attendue :** JSON avec la liste des événements

### 2. Frontend

```bash
# Ouvrir dans le navigateur
http://localhost:4200
```

**Résultat attendu :** Page d'accueil de l'application Angular

### 3. Communication Frontend → Backend

Dans le navigateur (Console F12) :
```javascript
// Tester depuis la console du navigateur
fetch('/api/events')
  .then(r => r.json())
  .then(data => console.log(data));
```

**Résultat attendu :** Liste des événements dans la console

---

## ⚠️ Problèmes Courants

### Port 8080 déjà utilisé (Backend)

```bash
# Modifier le port dans BackRahma/src/main/resources/application.properties
server.port=8081

# Puis modifier le proxy dans FrontOffice-main/proxy.conf.json
{
  "/api": {
    "target": "http://localhost:8081",
    ...
  }
}
```

### Port 4200 déjà utilisé (Frontend)

```bash
# Lancer sur un autre port
ng serve --port 4201

# Ou
npm start -- --port 4201
```

### Erreur CORS

✅ **Déjà résolu** grâce au `proxy.conf.json` !

Si problème persiste, vérifier que le backend a bien la configuration CORS dans `WebConfig.java`.

### Erreur "npm not found"

```bash
# Installer Node.js depuis : https://nodejs.org/
# Puis vérifier
node --version
npm --version
```

### Erreur "mvn not found"

```bash
# Installer Maven depuis : https://maven.apache.org/
# Ou utiliser le wrapper Maven inclus
./mvnw spring-boot:run  # Linux/Mac
mvnw.cmd spring-boot:run  # Windows
```

---

## 📊 Ordre de Démarrage Recommandé

1. **MySQL** (doit être lancé en premier)
2. **Backend** (Spring Boot sur port 8080)
3. **Frontend** (Angular sur port 4200)

---

## 🎨 Développement avec Hot Reload

### Backend (Spring Boot DevTools)

Le backend se recharge automatiquement si vous avez Spring Boot DevTools.

Pour forcer un rechargement :
```bash
# Dans le terminal du backend
Ctrl + C
mvn spring-boot:run
```

### Frontend (Angular)

Le frontend se recharge automatiquement à chaque modification de fichier.

Pas besoin de relancer, juste sauvegarder le fichier !

---

## 📱 Tester l'Application Complète

### Scénario de Test Complet

1. **Lancer Backend + Frontend**
   ```bash
   # Terminal 1
   cd BackRahma && mvn spring-boot:run
   
   # Terminal 2
   cd FrontOffice-main && npm start
   ```

2. **Ouvrir le navigateur**
   ```
   http://localhost:4200
   ```

3. **Tester les fonctionnalités**
   - Voir la liste des événements
   - Rechercher un événement
   - Filtrer par catégorie
   - Liker un événement
   - Réserver un événement
   - Télécharger le ticket PDF

---

## 🔧 Configuration Avancée

### Changer les Ports

**Backend :**
```properties
# BackRahma/src/main/resources/application.properties
server.port=8081
```

**Frontend :**
```bash
# Modifier package.json
"start": "ng serve --port 4201"
```

**Proxy :**
```json
// FrontOffice-main/proxy.conf.json
{
  "/api": {
    "target": "http://localhost:8081",
    ...
  }
}
```

### Mode Production

**Backend :**
```bash
# Créer le JAR
mvn clean package -DskipTests

# Lancer le JAR
java -jar target/BackRahma-0.0.1-SNAPSHOT.jar
```

**Frontend :**
```bash
# Build de production
npm run build

# Les fichiers sont dans dist/
# Déployer sur un serveur web (Nginx, Apache, etc.)
```

---

## 📚 Ressources

- **Backend API :** http://localhost:8080/api
- **Frontend :** http://localhost:4200
- **Documentation API :** `BackRahma/API_DOCUMENTATION.md`
- **Guide Frontend :** `BackRahma/FRONTEND_GUIDE.md`
- **Postman Collection :** `BackRahma/POSTMAN_COLLECTION.json`

---

## ✅ Checklist de Démarrage

- [ ] MySQL lancé
- [ ] Base de données `event_db` créée
- [ ] Dépendances backend installées (`mvn clean install`)
- [ ] Dépendances frontend installées (`npm install`)
- [ ] Backend lancé (port 8080)
- [ ] Frontend lancé (port 4200)
- [ ] Test API : http://localhost:8080/api/events
- [ ] Test Frontend : http://localhost:4200
- [ ] Données de test insérées (optionnel)

---

**Bon développement ! 🚀**
