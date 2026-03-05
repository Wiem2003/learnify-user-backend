# 🔍 Eureka Server

Service Discovery pour l'architecture microservices.

## 🚀 Démarrage

```bash
mvn clean install
mvn spring-boot:run
```

## 📍 URLs

- Dashboard: http://localhost:8761
- Health: http://localhost:8761/actuator/health

## ⚙️ Configuration

- Port: 8761
- Application Name: eureka-server

## 📊 Fonctionnalités

- Service Registry
- Service Discovery
- Health Monitoring
- Load Balancing Information

## ✅ Vérification

Ouvrez http://localhost:8761 et vérifiez que les services sont enregistrés:
- API-GATEWAY
- EVENT-SERVICE
