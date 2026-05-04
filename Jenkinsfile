// Jenkinsfile — Frontend Angular
// Pipeline CI pour le frontend selon le guide Sprint 3 DevOps

pipeline {
    agent any

    environment {
        IMAGE_NAME = 'wiwi2003/learnify-frontend'   // nom de l'image sur Docker Hub
        IMAGE_TAG = 'latest'
        DOCKER_CREDS = credentials('docker-hub-credentials') // config Jenkins
    }

    stages {
        stage('1 — Checkout') {
            steps {
                // Récupérer le code source depuis GitHub
                git branch: 'front_fonctionnel',
                    url: 'https://github.com/wissemkarous/learnify-user-backend.git',
                    credentialsId: 'github-credentials'
                echo "Code récupéré depuis GitHub — branche front_fonctionnel"
            }
        }

        stage('2 — Build Docker Image') {
            steps {
                // Construire l'image Docker (le build Angular se fait dans le Dockerfile)
                sh "docker build -t ${IMAGE_NAME}:${IMAGE_TAG} ."
                echo "Image Docker construite : ${IMAGE_NAME}:${IMAGE_TAG}"
            }
        }

        stage('3 — Push Docker Hub') {
            steps {
                // Se connecter à Docker Hub et pousser l'image
                sh "echo ${DOCKER_CREDS_PSW} | docker login -u ${DOCKER_CREDS_USR} --password-stdin"
                sh "docker push ${IMAGE_NAME}:${IMAGE_TAG}"
                echo "Image publiée sur Docker Hub : ${IMAGE_NAME}:${IMAGE_TAG}"
            }
        }
    } // fin stages

    post {
        success {
            echo "Pipeline CI réussi — image ${IMAGE_NAME}:${IMAGE_TAG} disponible sur Docker Hub"
        }
        failure {
            echo "Pipeline CI échoué — vérifier les logs ci-dessus"
        }
        always {
            // Nettoyer pour libérer l'espace disque Jenkins
            sh "docker rmi ${IMAGE_NAME}:${IMAGE_TAG} || true"
        }
    }
}
