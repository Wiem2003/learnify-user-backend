// Jenkinsfile — Frontend Angular
// Pipeline CI pour le frontend selon le guide Sprint 3 DevOps

pipeline {
    agent any

    environment {
        IMAGE_NAME = 'wiwi2003/learnify-frontend'
        IMAGE_TAG = 'latest'
        DOCKER_CREDS = credentials('docker-hub-credentials')
    }

    stages {
        stage('Checkout') {
            steps {
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: '*/front_fonctionnel']],
                    userRemoteConfigs: [[
                        url: 'https://github.com/wissemkarous/learnify-user-backend.git',
                        credentialsId: 'github-credentials'
                    ]]
                ])
                echo "✅ Code récupéré depuis GitHub — branche front_fonctionnel"
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
