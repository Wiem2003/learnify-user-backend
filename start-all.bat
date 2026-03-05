@echo off
echo ========================================
echo 🚀 Demarrage Backend + Frontend
echo ========================================
echo.

REM Vérifier que MySQL tourne
echo 📊 Verification MySQL...
mysql --version >nul 2>&1
if errorlevel 1 (
    echo ❌ MySQL n'est pas installe ou pas dans le PATH
    echo    Installez MySQL ou ajoutez-le au PATH
    pause
    exit /b 1
)

REM Démarrer le backend
echo.
echo 🔧 Demarrage du Backend (Spring Boot)...
echo    Port: 8080
echo    URL: http://localhost:8080/api
echo.
start "Backend Spring Boot" cmd /k "cd BackRahma && echo 🔧 Backend Spring Boot && echo. && mvn spring-boot:run"

REM Attendre que le backend démarre
echo ⏳ Attente du demarrage du backend (15 secondes)...
timeout /t 15 /nobreak >nul

REM Démarrer le frontend
echo.
echo 🎨 Demarrage du Frontend (Angular)...
echo    Port: 4200
echo    URL: http://localhost:4200
echo.
start "Frontend Angular" cmd /k "cd FrontOffice-main && echo 🎨 Frontend Angular && echo. && npm start"

REM Attendre un peu
timeout /t 3 /nobreak >nul

echo.
echo ========================================
echo ✅ Services lances !
echo ========================================
echo.
echo 🔧 Backend API : http://localhost:8080/api
echo 🎨 Frontend    : http://localhost:4200
echo.
echo 📚 Documentation :
echo    - API_DOCUMENTATION.md
echo    - LANCER_FRONTEND_BACKEND.md
echo.
echo ⚠️  Pour arreter : Fermer les fenetres de terminal
echo.
pause
