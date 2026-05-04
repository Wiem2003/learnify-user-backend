// Jenkinsfile — Microservice User Service
// Pipeline CI pour le user-service selon le guide Sprint 3 DevOps

pipeline {
    agent any

    environment {
        IMAGE_NAME = 'wiwi2003/user-service'        // nom de l'image sur Docker Hub
        IMAGE_TAG = 'latest'
        DOCKER_CREDS = credentials('docker-hub-credentials') // config Jenkins
    }

    stages {
        stage('1 — Checkout') {
            steps {
                // Récupérer le code source depuis GitHub
                git branch: 'user_final_user',
                    url: 'https://github.com/wissemkarous/learnify-user-backend.git',
                    credentialsId: 'github-credentials'
                echo "Code récupéré depuis GitHub — branche user_final_user"
            }
        }

        stage('2 — Build Maven') {
            steps {
                sh 'mvn clean package -DskipTests'
                echo "Build Maven terminé : user-service"
            }
        }

        stage('3 — Tests') {
            steps {
                sh 'mvn test'
            }
            post {
                always {
                    // Publier les résultats de tests dans Jenkins
                    junit "target/surefire-reports/*.xml"
                }
                failure {
                    error 'Tests échoués — arrêt du pipeline'
                }
            }
        }

        stage('4 — Build Image Docker') {
            steps {
                // Construire l'image Docker depuis le Dockerfile
                sh "docker build -t ${IMAGE_NAME}:${IMAGE_TAG} ."
                echo "Image Docker construite : ${IMAGE_NAME}:${IMAGE_TAG}"
            }
        }

        stage('5 — Push Docker Hub') {
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
