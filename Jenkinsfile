pipeline {
    agent any

    tools {
        maven 'Maven'
        jdk 'Java17'
    }

    stages {

        stage('Clone') {
            steps {
                git branch: 'user_wiem',
                url: 'https://github.com/Wiem2003/learnify-user-backend.git'
            }
        }

        stage('Build') {
            steps {
                sh 'mvn clean package -DskipTests'
            }
        }

        stage('Test') {
            steps {
                sh 'mvn test'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    sh '''
                    mvn sonar:sonar \
                    -Dsonar.projectKey=user-service \
                    -Dsonar.projectName=user-service
                    '''
                }
            }
        }

        stage('Docker Build') {
            steps {
                sh 'docker build -t user-service .'
            }
        }

        stage('Run Container') {
            steps {
                sh 'docker rm -f user-service-container || true'
                sh 'docker run -d -p 8087:8087 --name user-service-container user-service'
            }
        }

        stage('Show Running Containers') {
            steps {
                sh 'docker ps'
            }
        }
    }
}git checkout user_final_user
