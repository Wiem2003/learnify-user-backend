#!/bin/bash

echo "========================================"
echo "🚀 Démarrage Backend + Frontend"
echo "========================================"
echo ""

# Vérifier que MySQL tourne
echo "📊 Vérification MySQL..."
if ! command -v mysql &> /dev/null; then
    echo "❌ MySQL n'est pas installé ou pas dans le PATH"
    echo "   Installez MySQL ou ajoutez-le au PATH"
    exit 1
fi

# Fonction pour nettoyer à la sortie
cleanup() {
    echo ""
    echo "🛑 Arrêt des services..."
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null
        echo "   ✅ Backend arrêté"
    fi
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null
        echo "   ✅ Frontend arrêté"
    fi
    echo "👋 Au revoir !"
    exit 0
}

# Capturer Ctrl+C
trap cleanup SIGINT SIGTERM

# Démarrer le backend
echo ""
echo "🔧 Démarrage du Backend (Spring Boot)..."
echo "   Port: 8080"
echo "   URL: http://localhost:8080/api"
echo ""
cd BackRahma
mvn spring-boot:run > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Attendre que le backend démarre
echo "⏳ Attente du démarrage du backend (20 secondes)..."
sleep 20

# Vérifier que le backend tourne
if ! ps -p $BACKEND_PID > /dev/null; then
    echo "❌ Erreur : Le backend n'a pas démarré"
    echo "   Consultez backend.log pour plus de détails"
    exit 1
fi

# Démarrer le frontend
echo ""
echo "🎨 Démarrage du Frontend (Angular)..."
echo "   Port: 4200"
echo "   URL: http://localhost:4200"
echo ""
cd FrontOffice-main
npm start > ../frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

# Attendre un peu
sleep 3

echo ""
echo "========================================"
echo "✅ Services lancés !"
echo "========================================"
echo ""
echo "🔧 Backend API : http://localhost:8080/api (PID: $BACKEND_PID)"
echo "🎨 Frontend    : http://localhost:4200 (PID: $FRONTEND_PID)"
echo ""
echo "📚 Documentation :"
echo "   - API_DOCUMENTATION.md"
echo "   - LANCER_FRONTEND_BACKEND.md"
echo ""
echo "📋 Logs :"
echo "   - Backend  : backend.log"
echo "   - Frontend : frontend.log"
echo ""
echo "⚠️  Pour arrêter : Appuyez sur Ctrl+C"
echo ""

# Attendre indéfiniment
wait
