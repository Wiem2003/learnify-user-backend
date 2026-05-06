# 🚀 Learnify Backend - Microservices Platform

## 📋 Vue d'Ensemble

Plateforme de microservices pour Learnify - Application d'apprentissage en ligne.

### Services Disponibles

| Service | Port | Description | Status |
|---------|------|-------------|--------|
| eureka-server | 8761 | Service Discovery | ✅ |
| api-gateway | 8080 | API Gateway | ✅ |
| user-service | 8081 | Gestion des utilisateurs | ✅ |
| **payment-service** | **8082** | **Gestion des paiements** | ✅ |
| **certificate-service** | **8083** | **Gestion des certificats** | ✅ |
| ai-service | 8084 | Services IA | ✅ |
| course-service | 8085 | Gestion des cours | ✅ |
| event-service | 8086 | Gestion des événements | ✅ |
| job-service | 8087 | Gestion des emplois | ✅ |
| quiz-feedback-service | 8088 | Quiz et feedback | ✅ |
| preevaluation-service | 8089 | Pré-évaluation | ✅ |

---

## 🎯 Quick Start

### Prérequis
- Java 17+
- Maven 3.9+
- Docker 20.10+
- MySQL 8.0+
- RabbitMQ 3.x

### Build Local
```bash
# Build un service spécifique
cd payment-service
mvn clean package -DskipTests

cd ../certificate-service
mvn clean package -DskipTests
```

### Run avec Docker
```bash
# Build les images
docker build -t payment-service:latest ./payment-service
docker build -t certificate-service:latest ./certificate-service

# Run avec docker-compose
docker-compose up -d
```

---

## 📁 Structure du Projet

```
integrated/
├── Jenkinsfile                    # Pipeline multi-services
├── docker-compose.yml             # Configuration Docker
├── docs/                          # 📚 Documentation complète
│   ├── README_JENKINS.md          # Guide Jenkins (START HERE!)
│   ├── JENKINS_SETUP_GUIDE.md     # Installation Jenkins
│   ├── JENKINS_QUICK_REFERENCE.md # Référence rapide
│   ├── JENKINS_FILES_SUMMARY.md   # Résumé des pipelines
│   ├── DOCKER_ENVIRONMENT_CONFIG.md # Config Docker
│   ├── DEVOPS_CLEANUP_SUMMARY.md  # Résumé DevOps
│   └── QUICK_START_GUIDE.md       # Guide de démarrage
│
├── payment-service/
│   ├── Jenkinsfile                # Pipeline CI/CD
│   ├── Dockerfile                 # Image Docker
│   ├── pom.xml
│   └── src/
│
├── certificate-service/
│   ├── Jenkinsfile                # Pipeline CI/CD
│   ├── Dockerfile                 # Image Docker
│   ├── pom.xml
│   └── src/
│
└── [autres services]/
```

---

## 🔧 CI/CD avec Jenkins

### Pipelines Disponibles

#### 1. Pipeline Payment Service
**Fichier**: `payment-service/Jenkinsfile`  
**Branch**: `payment`  
**Stages**: 15 stages (Build → Test → Deploy)

#### 2. Pipeline Certificate Service
**Fichier**: `certificate-service/Jenkinsfile`  
**Branch**: `certificate`  
**Stages**: 15 stages (Build → Test → Deploy)

#### 3. Pipeline Multi-Services
**Fichier**: `Jenkinsfile` (racine)  
**Branches**: `all`, `develop`, `certificate`, `payment`  
**Features**: Build parallèle, sélection de service

### 📚 Documentation Jenkins

**🎯 COMMENCEZ ICI**: [`docs/README_JENKINS.md`](docs/README_JENKINS.md)

Autres guides:
- [Installation Jenkins](docs/JENKINS_SETUP_GUIDE.md) - Guide complet d'installation
- [Référence Rapide](docs/JENKINS_QUICK_REFERENCE.md) - Commandes et troubleshooting
- [Résumé des Pipelines](docs/JENKINS_FILES_SUMMARY.md) - Détails des pipelines
- [Configuration Docker](docs/DOCKER_ENVIRONMENT_CONFIG.md) - Variables d'environnement

---

## 🐳 Docker

### Build Images
```bash
# Payment Service
docker build -t payment-service:latest ./payment-service

# Certificate Service
docker build -t certificate-service:latest ./certificate-service
```

### Run Services
```bash
# Avec docker-compose
docker-compose up -d

# Vérifier les services
docker-compose ps

# Voir les logs
docker-compose logs -f payment-service
docker-compose logs -f certificate-service
```

### Health Checks
```bash
# Payment Service
curl http://localhost:8082/actuator/health

# Certificate Service
curl http://localhost:8083/actuator/health
```

---

## 🔐 Configuration

### Variables d'Environnement

#### Payment Service
```bash
SPRING_PROFILES_ACTIVE=docker
SPRING_DATASOURCE_URL=jdbc:mysql://mysql:3306/payment_db
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=rootpassword
EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=http://eureka-server:8761/eureka/
RABBITMQ_HOST=rabbitmq
EMAIL_USERNAME=${EMAIL_USERNAME}
EMAIL_PASSWORD=${EMAIL_PASSWORD}
```

#### Certificate Service
```bash
SPRING_PROFILES_ACTIVE=docker
SPRING_DATASOURCE_URL=jdbc:mysql://mysql:3306/certificate_db
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=rootpassword
EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=http://eureka-server:8761/eureka/
RABBITMQ_HOST=rabbitmq
GEMINI_API_KEY=${GEMINI_API_KEY}
```

Voir [`docs/DOCKER_ENVIRONMENT_CONFIG.md`](docs/DOCKER_ENVIRONMENT_CONFIG.md) pour plus de détails.

---

## 🧪 Tests

### Tests Unitaires
```bash
mvn test
```

### Tests d'Intégration
```bash
mvn verify -Pintegration-tests
```

### Coverage
```bash
mvn jacoco:report
# Rapport: target/site/jacoco/index.html
```

---

## 📊 Monitoring

### Endpoints Actuator
```bash
# Health
curl http://localhost:8082/actuator/health
curl http://localhost:8083/actuator/health

# Info
curl http://localhost:8082/actuator/info
curl http://localhost:8083/actuator/info

# Metrics
curl http://localhost:8082/actuator/metrics
curl http://localhost:8083/actuator/metrics
```

### Eureka Dashboard
```
http://localhost:8761
```

### RabbitMQ Management
```
http://localhost:15672
Username: guest
Password: guest
```

---

## 🚀 Déploiement

### Environnements

| Environment | Branch | Auto-Deploy | Approval |
|-------------|--------|-------------|----------|
| Development | develop | ✅ Yes | ❌ No |
| Staging | certificate, payment | ✅ Yes | ❌ No |
| Production | main | ❌ No | ✅ Yes |

### Workflow Git
```bash
# Développement
git checkout develop
git add .
git commit -m "feat: nouvelle fonctionnalité"
git push origin develop
# → Auto-deploy vers Dev

# Staging
git checkout certificate  # ou payment
git merge develop
git push origin certificate
# → Auto-deploy vers Staging

# Production
git checkout main
git merge certificate
git push origin main
# → Demande d'approbation → Deploy vers Production
```

---

## 🛠️ Troubleshooting

### Service ne démarre pas
```bash
# Vérifier les logs
docker logs payment-service
docker logs certificate-service

# Vérifier la configuration
docker exec payment-service env | grep SPRING
```

### Port déjà utilisé
```bash
# Windows
netstat -ano | findstr :8082
taskkill /PID <process-id> /F

# Linux
lsof -i :8082
kill -9 <process-id>
```

### Base de données inaccessible
```bash
# Vérifier MySQL
docker exec -it mysql mysql -uroot -p
SHOW DATABASES;
```

---

## 📚 Documentation Complète

### Guides Disponibles
1. **[README_JENKINS.md](docs/README_JENKINS.md)** - 🎯 **START HERE!**
2. **[JENKINS_SETUP_GUIDE.md](docs/JENKINS_SETUP_GUIDE.md)** - Installation Jenkins
3. **[JENKINS_QUICK_REFERENCE.md](docs/JENKINS_QUICK_REFERENCE.md)** - Référence rapide
4. **[JENKINS_FILES_SUMMARY.md](docs/JENKINS_FILES_SUMMARY.md)** - Résumé pipelines
5. **[DOCKER_ENVIRONMENT_CONFIG.md](docs/DOCKER_ENVIRONMENT_CONFIG.md)** - Config Docker
6. **[DEVOPS_CLEANUP_SUMMARY.md](docs/DEVOPS_CLEANUP_SUMMARY.md)** - Résumé DevOps
7. **[QUICK_START_GUIDE.md](docs/QUICK_START_GUIDE.md)** - Guide démarrage

---

## 🤝 Contribution

### Workflow
1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'feat: Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

### Conventions de Commit
```
feat: Nouvelle fonctionnalité
fix: Correction de bug
docs: Documentation
style: Formatage
refactor: Refactoring
test: Tests
chore: Maintenance
```

---

## 📞 Support

### Liens Utiles
- Jenkins: http://localhost:8080
- Eureka: http://localhost:8761
- RabbitMQ: http://localhost:15672
- SonarQube: http://localhost:9000

### Contact
- Email: team@learnify.com
- GitHub: https://github.com/Wiem2003/learnify-user-backend

---

## 📝 License

Ce projet est sous licence MIT.

---

**Status**: ✅ **Production Ready**  
**Version**: 1.0  
**Last Updated**: May 6, 2026  
**Team**: Learnify DevOps

---

## 🎯 Next Steps

1. ✅ Lire [`docs/README_JENKINS.md`](docs/README_JENKINS.md)
2. ✅ Installer Jenkins (voir [`docs/JENKINS_SETUP_GUIDE.md`](docs/JENKINS_SETUP_GUIDE.md))
3. ✅ Configurer les pipelines
4. ✅ Tester les builds
5. ✅ Déployer en staging
6. ✅ Déployer en production

**🚀 Bonne chance avec votre projet Learnify!**
