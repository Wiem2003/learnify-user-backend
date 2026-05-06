# Jenkins Setup Guide - Payment & Certificate Services

## 📋 Table des Matières
1. [Prérequis](#prérequis)
2. [Installation Jenkins](#installation-jenkins)
3. [Configuration Jenkins](#configuration-jenkins)
4. [Création des Jobs](#création-des-jobs)
5. [Configuration des Credentials](#configuration-des-credentials)
6. [Plugins Requis](#plugins-requis)
7. [Webhooks GitHub](#webhooks-github)

---

## 🔧 Prérequis

### Logiciels Requis
- ✅ Jenkins 2.400+
- ✅ Java JDK 17
- ✅ Maven 3.9+
- ✅ Docker 20.10+
- ✅ Git 2.30+

### Comptes Requis
- ✅ Compte Docker Hub (ou autre registry)
- ✅ Compte GitHub (avec accès au repository)
- ✅ Compte SonarQube (optionnel)

---

## 📦 Installation Jenkins

### Option 1: Docker (Recommandé)

```bash
# Créer un réseau Docker
docker network create jenkins

# Lancer Jenkins avec Docker
docker run -d \
  --name jenkins \
  --network jenkins \
  -p 8080:8080 \
  -p 50000:50000 \
  -v jenkins_home:/var/jenkins_home \
  -v /var/run/docker.sock:/var/run/docker.sock \
  jenkins/jenkins:lts-jdk17

# Récupérer le mot de passe initial
docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```

### Option 2: Installation Native (Windows)

1. Télécharger Jenkins depuis: https://www.jenkins.io/download/
2. Installer Jenkins
3. Accéder à http://localhost:8080
4. Suivre l'assistant d'installation

---

## ⚙️ Configuration Jenkins

### 1. Configuration Globale des Outils

**Manage Jenkins → Global Tool Configuration**

#### Maven Configuration
```
Name: Maven-3.9
Version: 3.9.6
Install automatically: ✅
```

#### JDK Configuration
```
Name: JDK-17
Version: 17
Install automatically: ✅
JAVA_HOME: /usr/lib/jvm/java-17-openjdk (Linux)
           C:\Program Files\Java\jdk-17 (Windows)
```

#### Docker Configuration
```
Name: Docker
Install automatically: ✅
Docker version: latest
```

#### Git Configuration
```
Name: Default
Path to Git executable: git
```

### 2. Configuration SonarQube (Optionnel)

**Manage Jenkins → Configure System → SonarQube servers**

```
Name: SonarQube
Server URL: http://localhost:9000
Server authentication token: [Créer un token dans SonarQube]
```

---

## 🔐 Configuration des Credentials

**Manage Jenkins → Manage Credentials → Global → Add Credentials**

### 1. Docker Hub Credentials
```
Kind: Username with password
Scope: Global
Username: [votre-username-dockerhub]
Password: [votre-password-dockerhub]
ID: dockerhub-credentials
Description: Docker Hub Credentials
```

### 2. GitHub Credentials
```
Kind: Username with password (ou SSH Key)
Scope: Global
Username: [votre-username-github]
Password: [votre-token-github]
ID: github-credentials
Description: GitHub Credentials
```

### 3. SonarQube Token (Optionnel)
```
Kind: Secret text
Scope: Global
Secret: [votre-token-sonarqube]
ID: sonarqube-token
Description: SonarQube Authentication Token
```

### 4. Email Credentials
```
Kind: Username with password
Scope: Global
Username: team@learnify.com
Password: [app-password]
ID: email-credentials
Description: Email Notification Credentials
```

---

## 🔌 Plugins Requis

**Manage Jenkins → Manage Plugins → Available**

### Plugins Essentiels
- ✅ **Pipeline** - Pipeline as Code
- ✅ **Git** - Git integration
- ✅ **Docker Pipeline** - Docker support
- ✅ **Maven Integration** - Maven builds
- ✅ **JUnit** - Test results
- ✅ **JaCoCo** - Code coverage

### Plugins Recommandés
- ✅ **SonarQube Scanner** - Code quality
- ✅ **OWASP Dependency-Check** - Security scanning
- ✅ **Email Extension** - Email notifications
- ✅ **Slack Notification** - Slack integration
- ✅ **Blue Ocean** - Modern UI
- ✅ **Pipeline Stage View** - Visual pipeline
- ✅ **Timestamper** - Timestamps in logs
- ✅ **Workspace Cleanup** - Clean workspace

### Installation des Plugins
```bash
# Via Jenkins CLI
java -jar jenkins-cli.jar -s http://localhost:8080/ install-plugin \
  pipeline-model-definition \
  git \
  docker-workflow \
  maven-plugin \
  junit \
  jacoco \
  sonar \
  dependency-check-jenkins-plugin \
  email-ext \
  blueocean
```

---

## 🚀 Création des Jobs

### Option 1: Pipeline Individuel pour Chaque Service

#### Job 1: Payment Service Pipeline

1. **New Item** → Nom: `payment-service-pipeline`
2. Type: **Pipeline**
3. Configuration:
   - **General**:
     - Description: `CI/CD Pipeline for Payment Service`
     - ✅ GitHub project: `https://github.com/Wiem2003/learnify-user-backend`
   
   - **Build Triggers**:
     - ✅ GitHub hook trigger for GITScm polling
     - ✅ Poll SCM: `H/5 * * * *` (toutes les 5 minutes)
   
   - **Pipeline**:
     - Definition: `Pipeline script from SCM`
     - SCM: `Git`
     - Repository URL: `https://github.com/Wiem2003/learnify-user-backend.git`
     - Credentials: `github-credentials`
     - Branch: `*/payment`
     - Script Path: `integrated/payment-service/Jenkinsfile`

#### Job 2: Certificate Service Pipeline

1. **New Item** → Nom: `certificate-service-pipeline`
2. Type: **Pipeline**
3. Configuration identique mais:
   - Branch: `*/certificate`
   - Script Path: `integrated/certificate-service/Jenkinsfile`

### Option 2: Multibranch Pipeline (Recommandé)

#### Job: Learnify Services Multibranch

1. **New Item** → Nom: `learnify-services`
2. Type: **Multibranch Pipeline**
3. Configuration:
   - **Branch Sources**:
     - Add source: `Git`
     - Project Repository: `https://github.com/Wiem2003/learnify-user-backend.git`
     - Credentials: `github-credentials`
     - Behaviors:
       - ✅ Discover branches
       - ✅ Discover pull requests from origin
   
   - **Build Configuration**:
     - Mode: `by Jenkinsfile`
     - Script Path: `Jenkinsfile`
   
   - **Scan Multibranch Pipeline Triggers**:
     - ✅ Periodically if not otherwise run
     - Interval: `5 minutes`

---

## 🔔 Configuration des Notifications

### Email Notifications

**Manage Jenkins → Configure System → Extended E-mail Notification**

```
SMTP server: smtp.gmail.com
SMTP Port: 587
Use SSL: ✅
Credentials: email-credentials
Default Recipients: team@learnify.com
```

### Slack Notifications (Optionnel)

**Manage Jenkins → Configure System → Slack**

```
Workspace: learnify-team
Credential: [Slack Token]
Default channel: #jenkins-builds
```

---

## 🔗 Webhooks GitHub

### Configuration du Webhook

1. Aller sur GitHub: `Settings → Webhooks → Add webhook`
2. Configuration:
   ```
   Payload URL: http://[jenkins-url]:8080/github-webhook/
   Content type: application/json
   Secret: [optionnel]
   Events: 
     ✅ Just the push event
     ✅ Pull requests
   Active: ✅
   ```

### Test du Webhook
```bash
# Faire un commit et push
git add .
git commit -m "test: trigger Jenkins build"
git push origin payment

# Vérifier dans Jenkins que le build démarre automatiquement
```

---

## 📊 Vérification de l'Installation

### Checklist de Vérification

- [ ] Jenkins accessible sur http://localhost:8080
- [ ] Tous les plugins installés
- [ ] Maven configuré (version 3.9+)
- [ ] JDK configuré (version 17)
- [ ] Docker accessible depuis Jenkins
- [ ] Credentials Docker Hub configurés
- [ ] Credentials GitHub configurés
- [ ] Jobs créés (payment-service et certificate-service)
- [ ] Webhooks GitHub configurés
- [ ] Email notifications configurées
- [ ] Premier build réussi

### Test Rapide

```bash
# Tester la connexion Docker
docker ps

# Tester Maven
mvn --version

# Tester Java
java -version

# Tester Git
git --version
```

---

## 🎯 Utilisation des Pipelines

### Démarrer un Build Manuellement

1. Aller sur le job: `payment-service-pipeline`
2. Cliquer sur **Build Now**
3. Voir les logs: **Console Output**

### Démarrer un Build avec Paramètres

1. Aller sur le job: `learnify-services`
2. Cliquer sur **Build with Parameters**
3. Sélectionner:
   - Service: `payment-service` ou `certificate-service` ou `all`
   - Skip Tests: `false`
   - Deploy: `true`
4. Cliquer sur **Build**

### Voir les Résultats

- **Blue Ocean**: http://localhost:8080/blue/organizations/jenkins/
- **Stage View**: Voir les étapes du pipeline
- **Test Results**: Résultats des tests unitaires
- **Code Coverage**: Couverture de code JaCoCo
- **SonarQube**: Qualité du code

---

## 🐛 Troubleshooting

### Problème: Docker not found

**Solution**:
```bash
# Ajouter Jenkins au groupe docker
sudo usermod -aG docker jenkins
sudo systemctl restart jenkins
```

### Problème: Maven not found

**Solution**:
- Vérifier la configuration dans **Global Tool Configuration**
- S'assurer que Maven est installé sur le système

### Problème: Permission denied

**Solution**:
```bash
# Donner les permissions nécessaires
sudo chown -R jenkins:jenkins /var/jenkins_home
```

### Problème: Build fails with "No space left on device"

**Solution**:
```bash
# Nettoyer les anciens builds
docker system prune -a
```

---

## 📚 Ressources Supplémentaires

- [Jenkins Documentation](https://www.jenkins.io/doc/)
- [Pipeline Syntax](https://www.jenkins.io/doc/book/pipeline/syntax/)
- [Docker Pipeline Plugin](https://plugins.jenkins.io/docker-workflow/)
- [Maven Integration](https://plugins.jenkins.io/maven-plugin/)

---

## 🎓 Bonnes Pratiques

1. ✅ **Utiliser des Multibranch Pipelines** pour gérer plusieurs branches
2. ✅ **Activer les webhooks** pour des builds automatiques
3. ✅ **Configurer les notifications** pour être alerté des échecs
4. ✅ **Utiliser des stages parallèles** pour accélérer les builds
5. ✅ **Archiver les artifacts** pour traçabilité
6. ✅ **Nettoyer le workspace** après chaque build
7. ✅ **Utiliser des credentials** pour les secrets
8. ✅ **Activer les health checks** pour les déploiements
9. ✅ **Faire des smoke tests** après déploiement
10. ✅ **Documenter les pipelines** avec des commentaires

---

**Status**: ✅ Ready for Production  
**Last Updated**: May 6, 2026  
**Maintainer**: DevOps Team
