pipeline {
    agent any

    tools {
        maven 'Maven'
        jdk 'Java17'
    }

    environment {
        IMAGE_NAME = 'wiwi2003/user-service:latest'
    }

    stages {

        stage('Build') {
            steps {
                sh 'mvn clean compile'
            }
        }

        stage('Test + JaCoCo') {
            steps {
                sh 'mvn test'
            }
        }

        stage('Package') {
            steps {
                sh 'mvn package -DskipTests'
            }
        }

       stage('SonarQube Analysis') {
           steps {
               withSonarQubeEnv('SonarQube') {
                   sh '''
                   ls -la target/site/jacoco/

                   mvn sonar:sonar \
                   -Dsonar.projectKey=user-service \
                   -Dsonar.projectName=user-service \
                   -Dsonar.coverage.jacoco.xmlReportPaths=target/site/jacoco/jacoco.xml
                   '''
               }
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
    }
}