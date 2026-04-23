# Deploy on KillerKoda — Step by Step Guide

## What is KillerKoda?
A free browser-based Linux environment. No installation needed.
URL: https://killercoda.com

---

## Step 1 — Start a KillerKoda session

1. Go to https://killercoda.com
2. Click **"Playgrounds"** in the top menu
3. Choose **"Ubuntu"** (the plain Ubuntu playground)
4. Click **"Start"** — a terminal opens in your browser

---

## Step 2 — Install prerequisites

Paste these commands in the terminal:

```bash
# Update packages
apt-get update -y

# Install Java 17
apt-get install -y openjdk-17-jdk

# Verify Java
java -version

# Install Maven
apt-get install -y maven

# Verify Maven
mvn -version

# Docker is pre-installed on KillerKoda — verify
docker --version
docker-compose --version
```

---

## Step 3 — Clone the project

```bash
# Replace with your actual GitHub repo URL
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Enter the integrated folder
cd YOUR_REPO/merge_integ/integrated
```

> If you don't have a GitHub repo yet:
> 1. Create one at https://github.com/new
> 2. Push your project: `git init && git add . && git commit -m "init" && git remote add origin YOUR_URL && git push -u origin main`

---

## Step 4 — Build all Spring Boot JARs

```bash
# Make build script executable
chmod +x build.sh

# Run it (builds all Maven jars — takes ~5 minutes)
./build.sh
```

Or build manually one by one:

```bash
for svc in eureka-server config-server event-service payment-service \
           certificate-service quiz-feedback-service ai-service \
           course-service user-service job-service preevaluation-service \
           club-service api-gateway; do
  echo "Building $svc..."
  (cd $svc && mvn clean package -DskipTests -q)
  echo "✓ $svc done"
done
```

---

## Step 5 — Set environment variables (optional)

Create a `.env` file for secrets:

```bash
cat > .env << 'EOF'
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/learnify_mongo
SENDGRID_API_KEY=your_sendgrid_key
EMAIL_USERNAME=your@gmail.com
EMAIL_PASSWORD=your_app_password
EOF
```

> MongoDB URI is required for `mongo-event-service`.
> All other services will start without it.

---

## Step 6 — Build Docker images and start all services

```bash
# Build images + start all containers in background
docker-compose up --build -d

# Watch startup logs
docker-compose logs -f
```

Wait about 60–90 seconds for all services to register with Eureka.

---

## Step 7 — Verify everything is running

```bash
# Check all containers are up
docker-compose ps

# Expected output: all services showing "Up"
# ─────────────────────────────────────────────────────
# NAME                    STATUS
# eureka-server           Up
# config-server           Up
# api-gateway             Up
# user-service            Up
# event-service           Up
# payment-service         Up
# certificate-service     Up
# quiz-feedback-service   Up
# ai-service              Up
# course-service          Up
# job-service             Up
# club-service            Up
# preevaluation-service   Up
# mongo-event-service     Up
# ─────────────────────────────────────────────────────

# Check Eureka dashboard (all services should appear)
curl http://localhost:8761

# Test API Gateway
curl http://localhost:8080/api/clubs
curl http://localhost:8080/api/courses
curl http://localhost:8080/api/events
```

---

## Step 8 — Access the application via public URL

KillerKoda exposes ports through its UI:

1. Look at the **top bar** of the KillerKoda interface
2. Click the **"Traffic / Ports"** button (looks like a network icon)
3. Enter port **`8761`** → opens Eureka dashboard (see all registered services)
4. Enter port **`8080`** → opens API Gateway (all API calls go here)

Or use the direct URL pattern:
```
https://PORT-INSTANCE_ID.environments.katacoda.com
```
KillerKoda shows you the exact URL when you click the port button.

---

## Step 9 — Check individual service logs

```bash
# View logs of a specific service
docker-compose logs -f eureka-server
docker-compose logs -f user-service
docker-compose logs -f api-gateway

# Check if a service crashed
docker-compose ps
docker inspect <container-name>
```

---

## Step 10 — Tear down

```bash
# Stop all containers
docker-compose down

# Stop and remove volumes (clean slate)
docker-compose down -v
```

---

## Port Reference

| Service               | Port  | URL                              |
|-----------------------|-------|----------------------------------|
| Eureka Dashboard      | 8761  | http://localhost:8761            |
| API Gateway           | 8080  | http://localhost:8080            |
| Config Server         | 8888  | http://localhost:8888            |
| User Service          | 8087  | http://localhost:8087            |
| Event Service         | 8081  | http://localhost:8081            |
| Payment Service       | 8082  | http://localhost:8082            |
| Certificate Service   | 8083  | http://localhost:8083            |
| Quiz-Feedback Service | 8084  | http://localhost:8084            |
| AI Service            | 8085  | http://localhost:8085            |
| Course Service        | 8086  | http://localhost:8086            |
| Job Service           | 8088  | http://localhost:8088            |
| Preevaluation Service | 8089  | http://localhost:8089            |
| Mongo Event Service   | 8090  | http://localhost:8090            |
| Club Service          | 8091  | http://localhost:8091            |

---

## Troubleshooting

**Service won't start / exits immediately:**
```bash
docker-compose logs <service-name>
```

**Eureka shows service as DOWN:**
- Wait 30 more seconds — services take time to register
- Check the service logs for connection errors

**Database connection refused:**
- The MySQL container may not be ready yet
- Spring Boot retries automatically — wait 60s

**Port already in use:**
```bash
docker-compose down
docker-compose up -d
```

**Out of memory on KillerKoda:**
- Start only core services first:
```bash
docker-compose up -d eureka-server config-server api-gateway user-service
```

---

## Running locally on Windows (once Docker is installed)

```powershell
# From merge_integ/integrated/
docker-compose up --build -d
docker-compose ps
docker-compose logs -f
```

To install Docker on Windows, run as Administrator:
```powershell
.\install-docker-windows.ps1
```
Then restart your PC and run Docker Desktop before using docker-compose.
