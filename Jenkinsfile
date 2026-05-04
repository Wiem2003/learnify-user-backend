// Jenkinsfile — Microservice User Service
// Pipeline CI pour le user-service selon le guide Sprint 3 DevOps

pipeline {
    agent any

    environment {
        IMAGE_NAME = 'wiwi2003/user-service'
        IMAGE_TAG = 'latest'
    }

    stages {
        stage('Build Maven') {
            steps {
                script {
                    try {
                        echo "🔨 Démarrage du build Maven..."
                        sh 'mvn clean package -DskipTests'
                        echo "✅ Build Maven terminé"
                    } catch (Exception e) {
                        echo "❌ Build Maven échoué: ${e.message}"
                        currentBuild.result = 'FAILURE'
                        error("Build Maven échoué")
                    }
                }
            }
        }

        stage('Build Docker') {
            when {
                expression { currentBuild.result != 'FAILURE' }
            }
            steps {
                script {
                    try {
                        echo "🐳 Construction de l'image Docker..."
                        sh "docker build -t ${IMAGE_NAME}:${IMAGE_TAG} ."
                        echo "✅ Image Docker construite : ${IMAGE_NAME}:${IMAGE_TAG}"
                    } catch (Exception e) {
                        echo "❌ Build Docker échoué: ${e.message}"
                        currentBuild.result = 'FAILURE'
                        error("Build Docker échoué")
                    }
                }
            }
        }

        stage('Push Docker Hub') {
            when {
                expression { currentBuild.result != 'FAILURE' }
            }
            steps {
                script {
                    try {
                        echo "📤 Connexion à Docker Hub..."
                        withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                            sh '''
                                echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                                docker push ${IMAGE_NAME}:${IMAGE_TAG}
                                docker logout
                            '''
                        }
                        echo "✅ Image publiée sur Docker Hub : ${IMAGE_NAME}:${IMAGE_TAG}"
                    } catch (Exception e) {
                        echo "❌ Push Docker Hub échoué: ${e.message}"
                        currentBuild.result = 'FAILURE'
                        error("Push Docker Hub échoué")
                    }
                }
            }
        }
    }

    post {
        always {
            script {
                try {
                    sh "docker rmi ${IMAGE_NAME}:${IMAGE_TAG} || true"
                    echo "🧹 Nettoyage terminé"
                } catch (Exception e) {
                    echo "⚠️ Nettoyage échoué (non critique)"
                }
            }
        }
        success {
            echo "✅ Pipeline CI réussi — image ${IMAGE_NAME}:${IMAGE_TAG} disponible sur Docker Hub"
        }
        failure {
            echo "❌ Pipeline CI échoué — vérifier les logs ci-dessus"
        }
    }
}
