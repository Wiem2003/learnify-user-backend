# Learnify — Microservices Backend

## Quick Start on KillerKoda

```bash
# 1. Clone
git clone https://github.com/Wiem2003/learnify-user-backend.git
cd learnify-user-backend

# 2. Install Java 17 + Maven (if not already installed)
apt-get update -y && apt-get install -y openjdk-17-jdk maven

# 3. Build all services and start with Docker
chmod +x build.sh
./build.sh
```

That's it. The script builds all JARs and runs `docker-compose up`.

## Services & Ports

| Service               | Port  |
|-----------------------|-------|
| Eureka Dashboard      | 8761  |
| API Gateway           | 8080  |
| User Service          | 8087  |
| Event Service         | 8081  |
| Payment Service       | 8082  |
| Certificate Service   | 8083  |
| Quiz-Feedback Service | 8084  |
| AI Service            | 8085  |
| Course Service        | 8086  |
| Job Service           | 8088  |
| Preevaluation Service | 8089  |
| Mongo Event Service   | 8090  |
| Club Service          | 8091  |

## Verify

```bash
docker-compose ps
curl http://localhost:8761   # Eureka dashboard
curl http://localhost:8080/api/clubs  # API Gateway
```

## Full deployment guide
See [KILLERKODA_DEPLOY.md](./KILLERKODA_DEPLOY.md)
