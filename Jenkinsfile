// Jenkinsfile — Microservice User Service
// Pipeline CI pour le user-service selon le guide Sprint 3 DevOps

pipeline {
    agent any

    environment {
        IMAGE_NAME = 'wiwi2003/user-service'
        IMAGE_TAG = 'latest'
        DOCKER_CREDS = credentials('docker-hub-credentials')
    }

    stages {
        stage('Checkout') {
            steps {
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: '*/user_final_user']],
                    userRemoteConfigs: [[
                        url: 'https://github.com/wissemkarous/learnify-user-backend.git',
                        credentialsId: 'github-credentials'
                    ]]
                ])
                echo "✅ Code récupéré depuis GitHub — branche user_final_user"
            }
        }

        stage('Build Maven') {
            steps {
                script {
                    try {
                        sh 'mvn clean package -DskipTests'
                        echo "✅ Build Maven terminé"
                    } catch (Exception e) {
                        echo "⚠️ Build Maven échoué: ${e.message}"
                        currentBuild.result = 'FAILURE'
                    }
                }
            }
        }

        stage('Build Docker') {
            steps {
                script {
                    try {
                        sh "docker build -t ${IMAGE_NAME}:${IMAGE_TAG} ."
                        echo "✅ Image Docker construite : ${IMAGE_NAME}:${IMAGE_TAG}"
                    } catch (Exception e) {
                        echo "⚠️ Build Docker échoué: ${e.message}"
                        currentBuild.result = 'FAILURE'
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
                        sh '''
                            echo ${DOCKER_CREDS_PSW} | docker login -u ${DOCKER_CREDS_USR} --password-stdin
                            docker push ${IMAGE_NAME}:${IMAGE_TAG}
                        '''
                        echo "✅ Image publiée sur Docker Hub"
                    } catch (Exception e) {
                        echo "⚠️ Push Docker Hub échoué: ${e.message}"
                        currentBuild.result = 'FAILURE'
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
                } catch (Exception e) {
                    echo "Nettoyage échoué (non critique)"
                }
            }
        }
        success {
            echo "✅ Pipeline CI réussi — image ${IMAGE_NAME}:${IMAGE_TAG} disponible sur Docker Hub"
        }
        failure {
            echo "❌ Pipeline CI échoué"
        }
    }
}
