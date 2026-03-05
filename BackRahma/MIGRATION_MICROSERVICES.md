# 🔄 MIGRATION VERS MICROSERVICES

## ✅ MODIFICATIONS APPLIQUÉES

### 1. pom.xml
**Ajouté:**
```xml
<properties>
    <spring-cloud.version>2023.0.3</spring-cloud.version>
</properties>

<dependencies>
    <!-- Eureka Client -->
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
    </dependency>
    
    <!-- Spring Boot Actuator -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-actuator</artifactId>
    </dependency>
</dependencies>

<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-dependencies</artifactId>
            <version>${spring-cloud.version}</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>
```

---

### 2. BackRahmaApplication.java
**Ajouté:**
```java
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@EnableDiscoveryClient  // ← NOUVEAU
```

---

### 3. application.yml (NOUVEAU)
**Créé:** `src/main/resources/application.yml`

**Changements clés:**
- Port: 8080 → 8081
- Context-path: /back → /
- Application name: BackRahma → EVENT-SERVICE
- Base de données: event-db1 → event-service-db
- Ajouté: Configuration Eureka Client
- Ajouté: Configuration Actuator

---

### 4. application.properties
**Renommé en:** `application.properties.bak` (backup)

---

## 🎯 NOUVELLE CONFIGURATION

### Port
```yaml
server:
  port: 8081  # Changé de 8080
```

### Nom du service
```yaml
spring:
  application:
    name: EVENT-SERVICE  # Important pour Eureka
```

### Base de données
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/event-service-db  # Nouvelle DB
```

### Eureka Client
```yaml
eureka:
  client:
    service-url:
      defaultZone: http://localhost:8761/eureka/
    register-with-eureka: true
    fetch-registry: true
```

---

## 🚀 DÉMARRAGE

### Prérequis:
1. Créer la base de données:
```sql
CREATE DATABASE `event-service-db` CHARACTER SET utf8mb4;
```

2. Démarrer Eureka Server (port 8761)
3. Démarrer API Gateway (port 8080)

### Commandes:
```bash
cd BackRahma
mvn clean install
mvn spring-boot:run
```

### Message attendu:
```
🎯 EVENT-SERVICE started on http://localhost:8081
📍 Registered with Eureka Server
🚪 Accessible via API Gateway on http://localhost:8080
```

---

## ✅ VÉRIFICATION

### 1. Vérifier l'enregistrement dans Eureka:
```
http://localhost:8761
```
Doit afficher: EVENT-SERVICE (1 instance)

### 2. Tester via API Gateway:
```bash
curl http://localhost:8080/api/events
```

### 3. Vérifier la santé du service:
```bash
curl http://localhost:8081/actuator/health
```

---

## 📊 AVANT / APRÈS

### AVANT (Monolithe):
```
Frontend → BackRahma (8080) → event-db1
           /back/api/events
```

### APRÈS (Microservices):
```
Frontend → API Gateway (8080) → EVENT-SERVICE (8081) → event-service-db
           /api/events            (via Eureka)
```

---

## 🔧 FONCTIONNALITÉS CONSERVÉES

Toutes les fonctionnalités existantes sont conservées:
- ✅ CRUD Events
- ✅ Pagination & Search
- ✅ Like/Unlike Events
- ✅ Event Statistics
- ✅ Reservations Management
- ✅ QR Code Generation
- ✅ PDF Ticket Generation
- ✅ AI Predictions (Google Gemini)
- ✅ AI Recommendations

---

## 📍 NOUVEAUX ENDPOINTS ACTUATOR

```
http://localhost:8081/actuator/health
http://localhost:8081/actuator/info
http://localhost:8081/actuator/metrics
http://localhost:8081/actuator/env
```

---

## ⚠️ IMPORTANT

### Après premier démarrage:
Changez dans `application.yml`:
```yaml
spring:
  jpa:
    hibernate:
      ddl-auto: update  # Changé de 'create'
```

### Accès au service:
- ✅ Via Gateway: http://localhost:8080/api/events
- ⚠️ Direct: http://localhost:8081/api/events (ne pas utiliser)

---

## 🎉 MIGRATION TERMINÉE!

Le service BackRahma est maintenant un microservice EVENT-SERVICE intégré dans l'architecture microservices!
