pipeline {
    agent any

    environment {
        IMAGE_NAME = 'wiwi2003/user-service'
        IMAGE_TAG = 'latest'
    }

    stages {

        stage('1 — Checkout') {
            steps {
                // Utilise la config du job Jenkins (repo + branche)
                checkout scm
                echo "Code récupéré depuis GitHub"
            }
        }

        stage('2 — Build Maven') {
            steps {
                sh 'mvn clean package -DskipTests'
                echo "Build Maven terminé"
            }
        }

        stage('3 — Tests') {
            steps {
                sh 'mvn test'
            }
            post {
                always {
                    junit "target/surefire-reports/*.xml"
                }
                failure {
                    error 'Tests échoués — arrêt du pipeline'
                }
            }
        }

        stage('4 — Build Image Docker') {
            steps {
                sh "docker build -t ${IMAGE_NAME}:${IMAGE_TAG} ."
                echo "Image Docker construite : ${IMAGE_NAME}:${IMAGE_TAG}"
            }
        }

        stage('5 — Push Docker Hub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'docker-hub-credentials',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {

                    sh "echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin"
                    sh "docker push ${IMAGE_NAME}:${IMAGE_TAG}"
                }

                echo "Image publiée sur Docker Hub"
            }
        }
    }

    post {
        success {
            echo "Pipeline réussi — image disponible sur Docker Hub"
        }
        failure {
            echo "Pipeline échoué — vérifier les logs"
        }
        always {
            sh "docker rmi ${IMAGE_NAME}:${IMAGE_TAG} || true"
        }
    }
}