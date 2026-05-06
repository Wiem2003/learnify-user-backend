# Club Service - Kubernetes Deployment

## Fichiers de déploiement

- `club-db-secret.yaml` - Secrets pour la base de données MySQL et email
- `club-db-deployment.yaml` - Déploiement de la base de données MySQL
- `club-service-deployment.yaml` - Déploiement du service Club

## Déploiement

1. Créer le namespace (si nécessaire):
```bash
kubectl apply -f ../../k8s/namespace.yaml
```

2. Appliquer les secrets:
```bash
kubectl apply -f club-db-secret.yaml
```

3. Déployer la base de données:
```bash
kubectl apply -f club-db-deployment.yaml
```

4. Déployer le service:
```bash
kubectl apply -f club-service-deployment.yaml
```

## Vérification

```bash
kubectl get pods -n learnify | grep club
kubectl get svc -n learnify | grep club
```

## Logs

```bash
kubectl logs -f deployment/club-service -n learnify
kubectl logs -f deployment/club-db -n learnify
```
