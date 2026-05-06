# Learnify Microservices - Quick Start Guide

## 🚀 Quick Commands

### Build All Services
```bash
# Navigate to integrated directory
cd integrated

# Build specific service
cd payment-service
mvn clean package -DskipTests

cd ../certificate-service
mvn clean package -DskipTests
```

### Docker Commands

#### Build Docker Images
```bash
# Payment Service
cd integrated/payment-service
docker build -t payment-service:latest .

# Certificate Service
cd integrated/certificate-service
docker build -t certificate-service:latest .
```

#### Run Docker Containers
```bash
# Payment Service
docker run -d \
  --name payment-service \
  -p 8082:8082 \
  -e SPRING_PROFILES_ACTIVE=dev \
  payment-service:latest

# Certificate Service
docker run -d \
  --name certificate-service \
  -p 8083:8083 \
  -e SPRING_PROFILES_ACTIVE=dev \
  certificate-service:latest
```

#### Stop and Remove Containers
```bash
docker stop payment-service certificate-service
docker rm payment-service certificate-service
```

### Git Workflow

#### Check Status
```bash
# Frontend
git -C frontend status

# Backend
git -C integrated status
```

#### Pull Latest Changes
```bash
# Frontend (certificate branch)
git -C frontend pull origin certificate

# Backend (certificate branch)
git -C integrated pull origin certificate

# Backend (payment branch)
git -C integrated checkout payment
git -C integrated pull origin payment
```

### Development Workflow

#### 1. Make Changes
```bash
# Edit your code
# Files are automatically ignored if in target/, .idea/, etc.
```

#### 2. Build and Test
```bash
cd integrated/<service-name>
mvn clean package -DskipTests
```

#### 3. Test Docker Build
```bash
docker build -t <service-name>:test .
```

#### 4. Commit Changes
```bash
git add <changed-files>
git commit -m "feat: your feature description"
git push origin <branch-name>
```

## 📁 Project Structure

```
merge_integ/
├── frontend/                    # Angular frontend
│   ├── src/
│   ├── .gitignore              # ✅ Updated
│   └── Dockerfile
│
└── integrated/                  # Spring Boot microservices
    ├── .gitignore              # ✅ Created
    ├── payment-service/
    │   ├── src/
    │   ├── pom.xml
    │   └── Dockerfile          # ✅ Created
    │
    ├── certificate-service/
    │   ├── src/
    │   ├── pom.xml
    │   └── Dockerfile          # ✅ Created
    │
    └── [other services]/
```

## 🔧 Service Ports

| Service | Port | Health Check |
|---------|------|--------------|
| Eureka Server | 8761 | http://localhost:8761/actuator/health |
| API Gateway | 8080 | http://localhost:8080/actuator/health |
| User Service | 8081 | http://localhost:8081/actuator/health |
| **Payment Service** | **8082** | **http://localhost:8082/actuator/health** |
| **Certificate Service** | **8083** | **http://localhost:8083/actuator/health** |
| AI Service | 8084 | http://localhost:8084/actuator/health |
| Course Service | 8085 | http://localhost:8085/actuator/health |
| Event Service | 8086 | http://localhost:8086/actuator/health |
| Job Service | 8087 | http://localhost:8087/actuator/health |
| Quiz Service | 8088 | http://localhost:8088/actuator/health |
| Preevaluation Service | 8089 | http://localhost:8089/actuator/health |

## 🐛 Troubleshooting

### Maven Build Fails
```bash
# Clean Maven cache
mvn clean

# Force update dependencies
mvn clean install -U

# Skip tests
mvn clean package -DskipTests
```

### Docker Build Fails
```bash
# Clean Docker cache
docker system prune -a

# Build without cache
docker build --no-cache -t <service-name>:latest .

# Check Docker logs
docker logs <container-name>
```

### Port Already in Use
```bash
# Find process using port
netstat -ano | findstr :8082

# Kill process (Windows)
taskkill /PID <process-id> /F

# Or change port in application.yml
```

### Git Issues
```bash
# Discard local changes
git checkout -- <file>

# Reset to remote
git fetch origin
git reset --hard origin/<branch-name>

# Clean untracked files
git clean -fd
```

## 📝 Important Notes

### What's Ignored by Git
- `target/` - Maven build output
- `.idea/` - IntelliJ IDEA settings
- `*.iml` - IntelliJ module files
- `.angular/cache/` - Angular build cache
- `node_modules/` - NPM dependencies
- `uploads/` - User uploaded files
- `.env` - Environment variables

### What to Commit
- Source code (`src/`)
- Configuration files (`pom.xml`, `application.yml`)
- Dockerfiles
- Documentation
- Scripts

### Never Commit
- Compiled files (`.class`, `.jar`)
- IDE settings
- Build artifacts
- Sensitive data (passwords, API keys)
- User uploads

## 🔐 Environment Variables

### Required for Payment Service
```bash
SPRING_PROFILES_ACTIVE=dev
RABBITMQ_HOST=localhost
RABBITMQ_PORT=5672
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

### Required for Certificate Service
```bash
SPRING_PROFILES_ACTIVE=dev
RABBITMQ_HOST=localhost
RABBITMQ_PORT=5672
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
GEMINI_API_KEY=your-gemini-api-key
```

## 🚦 CI/CD Pipeline (Coming Soon)

The repository is now ready for CI/CD integration. Recommended pipeline:

1. **Build** → Maven compile
2. **Test** → Run unit tests
3. **Package** → Create JAR
4. **Docker Build** → Create container image
5. **Push** → Push to registry
6. **Deploy** → Deploy to environment

## 📚 Additional Resources

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Docker Documentation](https://docs.docker.com/)
- [Maven Documentation](https://maven.apache.org/guides/)
- [Git Documentation](https://git-scm.com/doc)

## 🆘 Need Help?

1. Check `DEVOPS_CLEANUP_SUMMARY.md` for detailed information
2. Review service logs: `docker logs <container-name>`
3. Check application logs in `logs/` directory
4. Verify configuration in `application.yml`

---

**Last Updated**: May 6, 2026  
**Status**: ✅ Production Ready
