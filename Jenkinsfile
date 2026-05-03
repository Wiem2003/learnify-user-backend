pipeline {
    agent any

    tools {
        maven 'Maven'
        jdk 'Java17'
    }

    environment {
        IMAGE_NAME = 'wiwi2003/eureka-server:latest'
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'eureka-only',
                url: 'https://github.com/Wiem2003/learnify-user-backend.git'
            }
        }

        stage('Build') {
            steps {
                sh 'mvn clean compile'
            }
        }

        stage('Test') {
            steps {
                sh 'mvn test'
            }
        }

        stage('Package') {
            steps {
                sh 'mvn package -DskipTests'
            }
        }

        stage('Docker Build') {
            steps {
                sh 'docker build --no-cache -t $IMAGE_NAME .'
            }
        }

        stage('Docker Push') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh '''
                    docker logout || true
                    echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                    docker push $IMAGE_NAME
                    '''
                }
            }
        }

        stage('Deploy Kubernetes') {
            steps {
                sh '''
                kubectl rollout restart deployment eureka-server -n learnify
                kubectl rollout status deployment eureka-server -n learnify
                '''
            }
        }
    }
}