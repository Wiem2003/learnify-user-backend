# Event Service - Kubernetes Deployment

## Fichiers de déploiement

- `event-db-secret.yaml` - Secrets pour la base de données MySQL
- `event-db-deployment.yaml` - Déploiement de la base de données MySQL
- `event-service-deployment.yaml` - Déploiement du service Event

## Déploiement

1. Créer le namespace (si nécessaire):
```bash
kubectl apply -f ../../k8s/namespace.yaml
```

2. Appliquer les secrets:
```bash
kubectl apply -f event-db-secret.yaml
```

3. Déployer la base de données:
```bash
kubectl apply -f event-db-deployment.yaml
```

4. Déployer le service:
```bash
kubectl apply -f event-service-deployment.yaml
```

## Vérification

```bash
kubectl get pods -n learnify | grep event
kubectl get svc -n learnify | grep event
```

## Logs

```bash
kubectl logs -f deployment/event-service -n learnify
kubectl logs -f deployment/event-db -n learnify
```
