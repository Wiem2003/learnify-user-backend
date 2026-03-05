# 📁 Dossier Uploads

Ce dossier contient les images uploadées pour les événements.

## 📸 Image par Défaut

Si aucune photo n'est fournie lors de la création d'un événement, l'application utilise :
```
/uploads/default-event.jpg
```

## 🎨 Créer une Image par Défaut

Vous pouvez créer votre propre image par défaut :

1. Créez une image (recommandé : 800x600px)
2. Nommez-la `default-event.jpg`
3. Placez-la dans ce dossier

Ou utilisez un placeholder en ligne :
```
https://via.placeholder.com/800x600/4A90E2/FFFFFF?text=Event
```

## 📂 Structure

```
uploads/
├── README.md (ce fichier)
├── default-event.jpg (image par défaut)
└── [autres images uploadées]
```

## 🔒 Sécurité

- Les images sont accessibles publiquement via `/uploads/`
- Taille maximale : 10MB
- Formats acceptés : JPG, PNG, GIF

## 🧹 Nettoyage

Pour nettoyer les anciennes images :

```bash
# Supprimer toutes les images sauf default-event.jpg
find uploads/ -type f ! -name 'default-event.jpg' ! -name 'README.md' -delete
```
