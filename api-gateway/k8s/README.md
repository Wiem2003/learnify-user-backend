# API Gateway - Kubernetes Deployment

## Fichiers de déploiement

- `api-gateway-deployment.yaml` - Déploiement de l'API Gateway
- `api-gateway-service.yaml` - Service et Ingress pour l'API Gateway

## Déploiement

1. Créer le namespace (si nécessaire):
```bash
kubectl apply -f ../../k8s/namespace.yaml
```

2. Déployer l'API Gateway:
```bash
kubectl apply -f api-gateway-deployment.yaml
```

3. Déployer le service et l'ingress:
```bash
kubectl apply -f api-gateway-service.yaml
```

## Configuration de l'Ingress

Ajouter à votre fichier hosts:
```
127.0.0.1 learnify.local
```

## Vérification

```bash
kubectl get pods -n learnify | grep api-gateway
kubectl get svc -n learnify | grep api-gateway
kubectl get ingress -n learnify
```

## Logs

```bash
kubectl logs -f deployment/api-gateway -n learnify
```

## Accès

L'API Gateway sera accessible via: http://learnify.local
