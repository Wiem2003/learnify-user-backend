# Configuration Docker - Variables d'Environnement

## 📋 Réponses à vos Questions

### 1. ✅ Configuration Base de Données

**OUI**, vos services ont bien des configurations DB dans `application.yml`:

#### Payment Service (port 8082)
```yaml
spring:
  datasource:
    url: ${SPRING_DATASOURCE_URL:jdbc:mysql://localhost:3306/learnify?useSSL=false&allowPublicKeyRetrieval=true&useUnicode=true&characterEncoding=utf8}
    username: ${SPRING_DATASOURCE_USERNAME:root}
    password: ${SPRING_DATASOURCE_PASSWORD:}
    driver-class-name: com.mysql.cj.jdbc.Driver
```

#### Certificate Service (port 8083)
```yaml
spring:
  datasource:
    url: ${SPRING_DATASOURCE_URL:jdbc:mysql://localhost:3306/learnify?useSSL=false&allowPublicKeyRetrieval=true&useUnicode=true&characterEncoding=utf8}
    username: ${SPRING_DATASOURCE_USERNAME:root}
    password: ${SPRING_DATASOURCE_PASSWORD:}
    driver-class-name: com.mysql.cj.jdbc.Driver
```

**⚠️ PROBLÈME IDENTIFIÉ**: Les deux services utilisent la **même base de données** `learnify`. C'est un anti-pattern en microservices!

---

### 2. ✅ Configuration Eureka

**OUI**, vos services se connectent à Eureka:

#### Payment Service
```yaml
eureka:
  client:
    service-url:
      defaultZone: http://localhost:8761/eureka/
    register-with-eureka: true
    fetch-registry: true
  instance:
    prefer-ip-address: false
    hostname: localhost
```

#### Certificate Service
```yaml
eureka:
  client:
    service-url:
      defaultZone: ${EUREKA_CLIENT_SERVICEURL_DEFAULTZONE:http://localhost:8761/eureka/}
    register-with-eureka: true
    fetch-registry: true
  instance:
    prefer-ip-address: true
```

**⚠️ PROBLÈME IDENTIFIÉ**: L'URL Eureka pointe sur `localhost:8761` - cela **NE FONCTIONNERA PAS** dans Docker!

---

## 🚨 PROBLÈMES À CORRIGER POUR DOCKER

### Problème 1: Hostname "localhost" dans Docker
Dans Docker, `localhost` fait référence au conteneur lui-même, pas à l'hôte ou aux autres conteneurs.

### Problème 2: Base de données partagée
Les deux services utilisent la même DB `learnify` - chaque microservice devrait avoir sa propre base de données.

### Problème 3: Credentials en clair
- Email password visible: `ofswwnnicgclvatr`
- Gemini API key visible: `AIzaSyDRjSoMWQKu7htQMlG9TWTjOEU8Nc_EvGA`

---

## 🔧 SOLUTIONS RECOMMANDÉES

### Solution 1: Créer des fichiers application-docker.yml

#### Pour Payment Service
Créer `integrated/payment-service/src/main/resources/application-docker.yml`:

```yaml
server:
  port: 8082

spring:
  application:
    name: payment-service

  datasource:
    url: ${SPRING_DATASOURCE_URL:jdbc:mysql://mysql:3306/payment_db?useSSL=false&allowPublicKeyRetrieval=true&useUnicode=true&characterEncoding=utf8}
    username: ${SPRING_DATASOURCE_USERNAME:root}
    password: ${SPRING_DATASOURCE_PASSWORD:rootpassword}
    driver-class-name: com.mysql.cj.jdbc.Driver

  jpa:
    hibernate:
      ddl-auto: update
    show-sql: false
    properties:
      hibernate:
        dialect: org.hibernate.dialect.MySQL8Dialect

  mail:
    host: smtp.gmail.com
    port: 587
    username: ${EMAIL_USERNAME}
    password: ${EMAIL_PASSWORD}
    properties:
      mail:
        smtp:
          auth: true
          starttls:
            enable: true

  rabbitmq:
    host: ${RABBITMQ_HOST:rabbitmq}
    port: ${RABBITMQ_PORT:5672}
    username: ${RABBITMQ_USERNAME:guest}
    password: ${RABBITMQ_PASSWORD:guest}

eureka:
  client:
    service-url:
      defaultZone: ${EUREKA_CLIENT_SERVICEURL_DEFAULTZONE:http://eureka-server:8761/eureka/}
    register-with-eureka: true
    fetch-registry: true
  instance:
    prefer-ip-address: true
    instance-id: ${spring.application.name}:${server.port}
```

#### Pour Certificate Service
Créer `integrated/certificate-service/src/main/resources/application-docker.yml`:

```yaml
server:
  port: 8083

spring:
  application:
    name: certificate-service

  datasource:
    url: ${SPRING_DATASOURCE_URL:jdbc:mysql://mysql:3306/certificate_db?useSSL=false&allowPublicKeyRetrieval=true&useUnicode=true&characterEncoding=utf8}
    username: ${SPRING_DATASOURCE_USERNAME:root}
    password: ${SPRING_DATASOURCE_PASSWORD:rootpassword}
    driver-class-name: com.mysql.cj.jdbc.Driver

  jpa:
    hibernate:
      ddl-auto: update
    show-sql: false
    properties:
      hibernate:
        dialect: org.hibernate.dialect.MySQLDialect

  mail:
    host: smtp.gmail.com
    port: 587
    username: ${EMAIL_USERNAME}
    password: ${EMAIL_PASSWORD}
    properties:
      mail:
        smtp:
          auth: true
          starttls:
            enable: true

  rabbitmq:
    host: ${RABBITMQ_HOST:rabbitmq}
    port: ${RABBITMQ_PORT:5672}
    username: ${RABBITMQ_USERNAME:guest}
    password: ${RABBITMQ_PASSWORD:guest}

eureka:
  client:
    service-url:
      defaultZone: ${EUREKA_CLIENT_SERVICEURL_DEFAULTZONE:http://eureka-server:8761/eureka/}
    register-with-eureka: true
    fetch-registry: true
  instance:
    prefer-ip-address: true
    instance-id: ${spring.application.name}:${server.port}

gemini:
  api:
    key: ${GEMINI_API_KEY}
    url: https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent

certificate:
  verification-base-url: ${CERTIFICATE_VERIFICATION_URL:http://certificate-service:8083/api/certificates/verify}
```

---

### Solution 2: Mettre à jour les Dockerfiles

#### Payment Service Dockerfile
```dockerfile
# Multi-stage build for payment-service
FROM maven:3.9-eclipse-temurin-17 AS build

WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -B

COPY src ./src
RUN mvn clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8082

ENV JAVA_OPTS="-Xmx512m -Xms256m"
ENV SPRING_PROFILES_ACTIVE=docker

HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8082/actuator/health || exit 1

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -Dspring.profiles.active=${SPRING_PROFILES_ACTIVE} -jar app.jar"]
```

#### Certificate Service Dockerfile
```dockerfile
# Multi-stage build for certificate-service
FROM maven:3.9-eclipse-temurin-17 AS build

WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -B

COPY src ./src
RUN mvn clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8083

ENV JAVA_OPTS="-Xmx512m -Xms256m"
ENV SPRING_PROFILES_ACTIVE=docker

HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8083/actuator/health || exit 1

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -Dspring.profiles.active=${SPRING_PROFILES_ACTIVE} -jar app.jar"]
```

---

### Solution 3: Créer un docker-compose.yml complet

```yaml
version: '3.8'

services:
  # MySQL Database
  mysql:
    image: mysql:8.0
    container_name: learnify-mysql
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: learnify
    ports:
      - "3306:3306"
    volumes:
      - mysql-data:/var/lib/mysql
      - ./init-db.sql:/docker-entrypoint-initdb.d/init-db.sql
    networks:
      - learnify-network
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 10s
      timeout: 5s
      retries: 5

  # RabbitMQ
  rabbitmq:
    image: rabbitmq:3-management-alpine
    container_name: learnify-rabbitmq
    environment:
      RABBITMQ_DEFAULT_USER: guest
      RABBITMQ_DEFAULT_PASS: guest
    ports:
      - "5672:5672"
      - "15672:15672"
    networks:
      - learnify-network
    healthcheck:
      test: ["CMD", "rabbitmq-diagnostics", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Eureka Server
  eureka-server:
    image: learnify/eureka-server:latest
    container_name: eureka-server
    ports:
      - "8761:8761"
    networks:
      - learnify-network
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:8761/actuator/health"]
      interval: 30s
      timeout: 10s
      retries: 5

  # Payment Service
  payment-service:
    build:
      context: ./integrated/payment-service
      dockerfile: Dockerfile
    container_name: payment-service
    environment:
      SPRING_PROFILES_ACTIVE: docker
      SPRING_DATASOURCE_URL: jdbc:mysql://mysql:3306/payment_db?useSSL=false&allowPublicKeyRetrieval=true
      SPRING_DATASOURCE_USERNAME: root
      SPRING_DATASOURCE_PASSWORD: rootpassword
      EUREKA_CLIENT_SERVICEURL_DEFAULTZONE: http://eureka-server:8761/eureka/
      RABBITMQ_HOST: rabbitmq
      RABBITMQ_PORT: 5672
      EMAIL_USERNAME: ${EMAIL_USERNAME}
      EMAIL_PASSWORD: ${EMAIL_PASSWORD}
    ports:
      - "8082:8082"
    depends_on:
      mysql:
        condition: service_healthy
      rabbitmq:
        condition: service_healthy
      eureka-server:
        condition: service_healthy
    networks:
      - learnify-network
    restart: unless-stopped

  # Certificate Service
  certificate-service:
    build:
      context: ./integrated/certificate-service
      dockerfile: Dockerfile
    container_name: certificate-service
    environment:
      SPRING_PROFILES_ACTIVE: docker
      SPRING_DATASOURCE_URL: jdbc:mysql://mysql:3306/certificate_db?useSSL=false&allowPublicKeyRetrieval=true
      SPRING_DATASOURCE_USERNAME: root
      SPRING_DATASOURCE_PASSWORD: rootpassword
      EUREKA_CLIENT_SERVICEURL_DEFAULTZONE: http://eureka-server:8761/eureka/
      RABBITMQ_HOST: rabbitmq
      RABBITMQ_PORT: 5672
      EMAIL_USERNAME: ${EMAIL_USERNAME}
      EMAIL_PASSWORD: ${EMAIL_PASSWORD}
      GEMINI_API_KEY: ${GEMINI_API_KEY}
    ports:
      - "8083:8083"
    depends_on:
      mysql:
        condition: service_healthy
      rabbitmq:
        condition: service_healthy
      eureka-server:
        condition: service_healthy
    networks:
      - learnify-network
    restart: unless-stopped

networks:
  learnify-network:
    driver: bridge

volumes:
  mysql-data:
```

---

### Solution 4: Créer un fichier .env pour les secrets

Créer `.env` à la racine (et l'ajouter à .gitignore):

```bash
# Database
MYSQL_ROOT_PASSWORD=rootpassword

# Email Configuration
EMAIL_USERNAME=tahersahbi7@gmail.com
EMAIL_PASSWORD=ofswwnnicgclvatr

# Gemini AI
GEMINI_API_KEY=AIzaSyDRjSoMWQKu7htQMlG9TWTjOEU8Nc_EvGA

# RabbitMQ
RABBITMQ_USERNAME=guest
RABBITMQ_PASSWORD=guest
```

---

### Solution 5: Script d'initialisation de la base de données

Créer `init-db.sql`:

```sql
-- Create separate databases for each service
CREATE DATABASE IF NOT EXISTS payment_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS certificate_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS learnify CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Grant privileges
GRANT ALL PRIVILEGES ON payment_db.* TO 'root'@'%';
GRANT ALL PRIVILEGES ON certificate_db.* TO 'root'@'%';
GRANT ALL PRIVILEGES ON learnify.* TO 'root'@'%';

FLUSH PRIVILEGES;
```

---

## 🚀 COMMANDES POUR DÉMARRER

### 1. Construire les images
```bash
# Depuis la racine du projet
docker-compose build
```

### 2. Démarrer tous les services
```bash
docker-compose up -d
```

### 3. Vérifier les logs
```bash
# Tous les services
docker-compose logs -f

# Service spécifique
docker-compose logs -f payment-service
docker-compose logs -f certificate-service
```

### 4. Vérifier le statut
```bash
docker-compose ps
```

### 5. Arrêter les services
```bash
docker-compose down
```

### 6. Arrêter et supprimer les volumes
```bash
docker-compose down -v
```

---

## 🔍 VÉRIFICATION DES SERVICES

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

### Payment Service
```
http://localhost:8082/actuator/health
http://localhost:8082/swagger-ui.html
```

### Certificate Service
```
http://localhost:8083/actuator/health
http://localhost:8083/swagger-ui.html
```

---

## ⚠️ POINTS D'ATTENTION

### 1. Ordre de démarrage
Les services doivent démarrer dans cet ordre:
1. MySQL
2. RabbitMQ
3. Eureka Server
4. Payment Service & Certificate Service

Le `docker-compose.yml` gère cela avec `depends_on` et `healthcheck`.

### 2. Temps de démarrage
- MySQL: ~10-15 secondes
- RabbitMQ: ~5-10 secondes
- Eureka: ~20-30 secondes
- Services métier: ~30-40 secondes

**Total**: Environ 1-2 minutes pour que tout soit opérationnel.

### 3. Réseau Docker
Tous les services communiquent via le réseau `learnify-network`. Les noms de service (mysql, rabbitmq, eureka-server) sont utilisés comme hostnames.

### 4. Persistance des données
Les données MySQL sont persistées dans le volume `mysql-data`. Pour tout réinitialiser:
```bash
docker-compose down -v
```

---

## 📝 CHECKLIST AVANT DE DÉMARRER

- [ ] Créer `application-docker.yml` pour payment-service
- [ ] Créer `application-docker.yml` pour certificate-service
- [ ] Mettre à jour les Dockerfiles avec `SPRING_PROFILES_ACTIVE=docker`
- [ ] Créer `docker-compose.yml` à la racine
- [ ] Créer `init-db.sql` pour initialiser les bases de données
- [ ] Créer `.env` avec les secrets
- [ ] Ajouter `.env` au `.gitignore`
- [ ] Construire l'image Eureka Server
- [ ] Tester le démarrage complet

---

## 🎯 RÉSUMÉ DES CHANGEMENTS NÉCESSAIRES

| Fichier | Action | Priorité |
|---------|--------|----------|
| `application-docker.yml` (payment) | Créer | 🔴 Haute |
| `application-docker.yml` (certificate) | Créer | 🔴 Haute |
| `Dockerfile` (payment) | Modifier | 🔴 Haute |
| `Dockerfile` (certificate) | Modifier | 🔴 Haute |
| `docker-compose.yml` | Créer | 🔴 Haute |
| `init-db.sql` | Créer | 🟡 Moyenne |
| `.env` | Créer | 🟡 Moyenne |
| `.gitignore` | Mettre à jour | 🟢 Basse |

---

**Voulez-vous que je crée ces fichiers pour vous?** 🚀
