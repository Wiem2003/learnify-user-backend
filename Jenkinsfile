pipeline {
    agent any

    tools {
        jdk 'jdk17'
        nodejs 'node18'
    }

    environment {
        IMAGE_NAME = 'wiwi2003/learnify-frontend'
        TAG = 'latest'
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'front_fonctionnel',
                url: 'https://github.com/Wiem2003/learnify-user-backend.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build Angular') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Docker Build') {
            steps {
                sh 'docker build -t $IMAGE_NAME:$TAG .'
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
                    echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                    docker push $IMAGE_NAME:$TAG
                    '''
                }
            }
        }

        stage('Deploy Kubernetes') {
            steps {
                sh '''
                kubectl rollout restart deployment frontend -n learnify
                kubectl rollout status deployment frontend -n learnify
                '''
            }
        }
    }
}