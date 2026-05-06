# Jenkins - Quick Reference Guide

## 🚀 Quick Start

### Start Jenkins (Docker)
```bash
docker run -d -p 8080:8080 -p 50000:50000 \
  -v jenkins_home:/var/jenkins_home \
  -v /var/run/docker.sock:/var/run/docker.sock \
  --name jenkins jenkins/jenkins:lts-jdk17
```

### Access Jenkins
```
URL: http://localhost:8080
Initial Password: docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```

---

## 📁 Fichiers Jenkins Créés

### 1. Jenkinsfile (Racine)
**Emplacement**: `/Jenkinsfile`  
**Usage**: Pipeline multi-services (payment + certificate)  
**Branches**: all, develop, certificate, payment

### 2. Payment Service Jenkinsfile
**Emplacement**: `/integrated/payment-service/Jenkinsfile`  
**Port**: 8082  
**Database**: payment_db  
**Branches**: payment, develop, main

### 3. Certificate Service Jenkinsfile
**Emplacement**: `/integrated/certificate-service/Jenkinsfile`  
**Port**: 8083  
**Database**: certificate_db  
**Branches**: certificate, develop, main

---

## 🔧 Configuration Minimale

### 1. Credentials à Créer
```
ID: dockerhub-credentials
Type: Username with password
Usage: Push Docker images

ID: github-credentials
Type: Username with password
Usage: Clone repository
```

### 2. Tools à Configurer
```
Maven: Maven-3.9 (version 3.9.6)
JDK: JDK-17 (version 17)
Docker: Docker (latest)
```

### 3. Plugins Essentiels
```
- Pipeline
- Git
- Docker Pipeline
- Maven Integration
- JUnit
- JaCoCo
```

---

## 📊 Stages du Pipeline

### Payment Service Pipeline
```
1. Checkout          → Clone le code
2. Build             → mvn compile
3. Unit Tests        → mvn test
4. Code Quality      → SonarQube
5. Quality Gate      → Vérification qualité
6. Package           → mvn package
7. Security Scan     → OWASP + Trivy
8. Build Docker      → docker build
9. Scan Docker       → trivy image
10. Push Registry    → docker push
11. Deploy Dev       → docker-compose (develop)
12. Deploy Staging   → docker-compose (certificate/payment)
13. Integration Tests → mvn verify
14. Smoke Tests      → curl health checks
15. Deploy Prod      → docker-compose (main) + approval
```

### Certificate Service Pipeline
```
Identique au Payment Service
```

---

## 🎯 Commandes Utiles

### Créer un Job
```groovy
// Via Jenkins UI
New Item → Pipeline → Configure → Pipeline script from SCM
```

### Déclencher un Build
```bash
# Manuellement
Jenkins UI → Job → Build Now

# Via Git Push
git push origin payment  # Déclenche payment-service
git push origin certificate  # Déclenche certificate-service
```

### Voir les Logs
```bash
# Via UI
Job → Build #X → Console Output

# Via CLI
curl http://localhost:8080/job/payment-service/lastBuild/consoleText
```

---

## 🔍 Vérifications Post-Build

### Health Checks
```bash
# Payment Service
curl http://localhost:8082/actuator/health

# Certificate Service
curl http://localhost:8083/actuator/health
```

### Docker Images
```bash
# Lister les images
docker images | grep -E "payment|certificate"

# Vérifier les tags
docker images payment-service
docker images certificate-service
```

### Services Running
```bash
# Via Docker
docker ps | grep -E "payment|certificate"

# Via docker-compose
docker-compose ps
```

---

## 🚨 Troubleshooting

### Build Fails: "Docker not found"
```bash
sudo usermod -aG docker jenkins
sudo systemctl restart jenkins
```

### Build Fails: "Maven not found"
```bash
# Vérifier dans Jenkins
Manage Jenkins → Global Tool Configuration → Maven
```

### Build Fails: "Permission denied"
```bash
sudo chown -R jenkins:jenkins /var/jenkins_home
```

### Build Fails: "Port already in use"
```bash
# Trouver le processus
netstat -ano | findstr :8082
netstat -ano | findstr :8083

# Tuer le processus (Windows)
taskkill /PID <process-id> /F
```

---

## 📧 Notifications

### Email (Configuré dans Jenkinsfile)
```
Success: ✅ SUCCESS: Payment Service Build #X
Failure: ❌ FAILURE: Payment Service Build #X
To: team@learnify.com
```

### Slack (À configurer)
```groovy
slackSend(
    color: 'good',
    message: "Build #${BUILD_NUMBER} succeeded"
)
```

---

## 🎨 Blue Ocean UI

### Accès
```
URL: http://localhost:8080/blue
```

### Avantages
- ✅ Interface moderne
- ✅ Visualisation des pipelines
- ✅ Logs colorés
- ✅ Édition visuelle

---

## 📈 Métriques & Rapports

### Test Results
```
Job → Test Result Trend
```

### Code Coverage
```
Job → JaCoCo Coverage Report
```

### SonarQube
```
http://localhost:9000/dashboard?id=learnify-payment-service
http://localhost:9000/dashboard?id=learnify-certificate-service
```

---

## 🔐 Sécurité

### Secrets Management
```
Manage Jenkins → Manage Credentials → Add Credentials
```

### Best Practices
- ✅ Ne jamais commit de credentials
- ✅ Utiliser des tokens au lieu de passwords
- ✅ Activer CSRF protection
- ✅ Limiter les permissions par rôle
- ✅ Activer l'authentification 2FA

---

## 🚀 Déploiement

### Environnements

| Branch | Environment | Auto-Deploy | Approval |
|--------|-------------|-------------|----------|
| develop | Development | ✅ Yes | ❌ No |
| certificate | Staging | ✅ Yes | ❌ No |
| payment | Staging | ✅ Yes | ❌ No |
| main | Production | ❌ No | ✅ Yes |

### Commandes de Déploiement
```bash
# Development
docker-compose -f docker-compose.dev.yml up -d

# Staging
docker-compose -f docker-compose.staging.yml up -d

# Production
docker-compose -f docker-compose.prod.yml up -d
```

---

## 📝 Variables d'Environnement

### Payment Service
```bash
SPRING_PROFILES_ACTIVE=docker
SPRING_DATASOURCE_URL=jdbc:mysql://mysql:3306/payment_db
EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=http://eureka-server:8761/eureka/
RABBITMQ_HOST=rabbitmq
EMAIL_USERNAME=${EMAIL_USERNAME}
EMAIL_PASSWORD=${EMAIL_PASSWORD}
```

### Certificate Service
```bash
SPRING_PROFILES_ACTIVE=docker
SPRING_DATASOURCE_URL=jdbc:mysql://mysql:3306/certificate_db
EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=http://eureka-server:8761/eureka/
RABBITMQ_HOST=rabbitmq
GEMINI_API_KEY=${GEMINI_API_KEY}
```

---

## 🎯 Checklist de Production

- [ ] Jenkins installé et accessible
- [ ] Tous les plugins installés
- [ ] Credentials configurés
- [ ] Tools configurés (Maven, JDK, Docker)
- [ ] Jobs créés (payment + certificate)
- [ ] Webhooks GitHub configurés
- [ ] Premier build réussi
- [ ] Tests passent
- [ ] Docker images créées
- [ ] Services déployés
- [ ] Health checks OK
- [ ] Notifications configurées
- [ ] Documentation à jour

---

## 📞 Support

### Logs Jenkins
```bash
# Via Docker
docker logs jenkins

# Via fichier
tail -f /var/jenkins_home/logs/jenkins.log
```

### Restart Jenkins
```bash
# Via Docker
docker restart jenkins

# Via UI
http://localhost:8080/restart
```

---

**Quick Access Links**:
- Jenkins: http://localhost:8080
- Blue Ocean: http://localhost:8080/blue
- Payment Service: http://localhost:8082
- Certificate Service: http://localhost:8083
- Eureka: http://localhost:8761
- RabbitMQ: http://localhost:15672

**Status**: ✅ Ready to Use  
**Version**: 1.0  
**Last Updated**: May 6, 2026
