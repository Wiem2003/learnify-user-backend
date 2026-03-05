# 🚪 API Gateway

Point d'entrée unique pour tous les microservices.

## 🚀 Démarrage

```bash
mvn clean install
mvn spring-boot:run
```

## 📍 URLs

- Gateway: http://localhost:8080
- Health: http://localhost:8080/actuator/health
- Routes: http://localhost:8080/actuator/gateway/routes

## ⚙️ Configuration

- Port: 8080
- Application Name: api-gateway
- Eureka: http://localhost:8761/eureka/

## 🛣️ Routes Configurées

| Route | Destination | Description |
|-------|-------------|-------------|
| /api/events/** | EVENT-SERVICE | Gestion des événements |
| /api/reservations/** | EVENT-SERVICE | Gestion des réservations |
| /api/ai/** | EVENT-SERVICE | IA Prédictions & Recommandations |

## 🔧 CORS

Configuré pour accepter les requêtes de:
- http://localhost:4200
- http://localhost:4201

## ✅ Vérification

```bash
# Vérifier les routes
curl http://localhost:8080/actuator/gateway/routes

# Tester un endpoint
curl http://localhost:8080/api/events
```
