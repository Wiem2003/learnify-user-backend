# Kubernetes Manifests — LearnifyEnglish

## Structure

```
k8s/
├── namespace.yaml                        # learnify namespace
├── eureka/
│   └── eureka-deployment.yaml            # Eureka server + Service
├── api-gateway/
│   ├── api-gateway-deployment.yaml       # Gateway Deployment (2 replicas)
│   └── api-gateway-service.yaml          # ClusterIP Service + Ingress
├── club-service/
│   ├── club-db-secret.yaml               # MySQL credentials (Secret)
│   ├── club-db-deployment.yaml           # MySQL DB + Service + PVC
│   └── club-service-deployment.yaml      # club-service + Service
└── event-service/
    ├── event-db-secret.yaml              # MySQL credentials (Secret)
    ├── event-db-deployment.yaml          # MySQL DB + Service + PVC
    └── event-service-deployment.yaml     # event-service + Service + uploads PVC
```

## Deploy order

```bash
# 1. Namespace
kubectl apply -f k8s/namespace.yaml

# 2. Secrets (update credentials before applying)
kubectl apply -f k8s/club-service/club-db-secret.yaml
kubectl apply -f k8s/event-service/event-db-secret.yaml

# 3. Databases
kubectl apply -f k8s/club-service/club-db-deployment.yaml
kubectl apply -f k8s/event-service/event-db-deployment.yaml

# 4. Eureka (wait ~30s for it to be ready)
kubectl apply -f k8s/eureka/eureka-deployment.yaml

# 5. Microservices
kubectl apply -f k8s/club-service/club-service-deployment.yaml
kubectl apply -f k8s/event-service/event-service-deployment.yaml

# 6. API Gateway
kubectl apply -f k8s/api-gateway/api-gateway-deployment.yaml
kubectl apply -f k8s/api-gateway/api-gateway-service.yaml
```

## Build Docker images first

```bash
# From each service directory
docker build -t learnify/eureka-server:latest   ./eureka-server
docker build -t learnify/api-gateway:latest     ./api-gateway
docker build -t learnify/club-service:latest    ./club-service
docker build -t learnify/event-service:latest   ./event-service
```

## Check status

```bash
kubectl get all -n learnify
kubectl logs -n learnify deployment/club-service
kubectl logs -n learnify deployment/event-service
```
