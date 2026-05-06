// Multi-service Pipeline for Payment and Certificate Services
pipeline {
    agent any
    
    tools {
        maven 'M2_HOME'
        jdk ' JAVA_HOME'
    }
    
    environment {
        DOCKER_REGISTRY = 'docker.io'
        DOCKER_CREDENTIALS_ID = 'dockerhub-credentials'
        SONAR_HOST_URL = 'http://localhost:9000'
    }
    
    parameters {
        choice(
            name: 'SERVICE',
            choices: ['all', 'payment-service', 'certificate-service'],
            description: 'Which service to build?'
        )
        booleanParam(
            name: 'SKIP_TESTS',
            defaultValue: false,
            description: 'Skip tests?'
        )
        booleanParam(
            name: 'DEPLOY',
            defaultValue: true,
            description: 'Deploy after build?'
        )
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo '📥 Checking out code...'
                
                // Configure Git for large repositories
                sh '''
                    git config --global http.postBuffer 524288000
                    git config --global http.lowSpeedLimit 0
                    git config --global http.lowSpeedTime 999999
                    git config --global core.compression 0
                '''
                
                // Shallow clone to reduce download size
                checkout([
                    $class: 'GitSCM',
                    branches: scm.branches,
                    extensions: [
                        [$class: 'CloneOption', depth: 1, noTags: false, shallow: true, timeout: 60],
                        [$class: 'CheckoutOption', timeout: 60]
                    ],
                    userRemoteConfigs: scm.userRemoteConfigs
                ])
                
                script {
                    env.GIT_COMMIT_SHORT = sh(script: "git rev-parse --short HEAD", returnStdout: true).trim()
                    env.GIT_BRANCH = sh(script: "git rev-parse --abbrev-ref HEAD", returnStdout: true).trim()
                }
            }
        }
        
        stage('Determine Services to Build') {
            steps {
                script {
                    if (params.SERVICE == 'all') {
                        env.BUILD_PAYMENT = 'true'
                        env.BUILD_CERTIFICATE = 'true'
                    } else if (params.SERVICE == 'payment-service') {
                        env.BUILD_PAYMENT = 'true'
                        env.BUILD_CERTIFICATE = 'false'
                    } else if (params.SERVICE == 'certificate-service') {
                        env.BUILD_PAYMENT = 'false'
                        env.BUILD_CERTIFICATE = 'true'
                    }
                    
                    echo "Building Payment Service: ${env.BUILD_PAYMENT}"
                    echo "Building Certificate Service: ${env.BUILD_CERTIFICATE}"
                }
            }
        }
        
        stage('Build Services') {
            parallel {
                stage('Payment Service') {
                    when {
                        expression { env.BUILD_PAYMENT == 'true' }
                    }
                    stages {
                        stage('Build Payment') {
                            steps {
                                echo '🔨 Building Payment Service...'
                                dir('payment-service') {
                                    sh 'mvn clean compile -DskipTests'
                                }
                            }
                        }
                        
                        stage('Test Payment') {
                            when {
                                expression { !params.SKIP_TESTS }
                            }
                            steps {
                                echo '🧪 Testing Payment Service...'
                                dir('payment-service') {
                                    sh 'mvn test'
                                }
                            }
                        }
                        
                        stage('Package Payment') {
                            steps {
                                echo '📦 Packaging Payment Service...'
                                dir('payment-service') {
                                    sh 'mvn package -DskipTests'
                                }
                            }
                        }
                        
                        stage('Docker Payment') {
                            steps {
                                echo '🐳 Building Payment Docker image...'
                                dir('payment-service') {
                                    script {
                                        docker.build("payment-service:${BUILD_NUMBER}")
                                    }
                                }
                            }
                        }
                    }
                }
                
                stage('Certificate Service') {
                    when {
                        expression { env.BUILD_CERTIFICATE == 'true' }
                    }
                    stages {
                        stage('Build Certificate') {
                            steps {
                                echo '🔨 Building Certificate Service...'
                                dir('certificate-service') {
                                    sh 'mvn clean compile -DskipTests'
                                }
                            }
                        }
                        
                        stage('Test Certificate') {
                            when {
                                expression { !params.SKIP_TESTS }
                            }
                            steps {
                                echo '🧪 Testing Certificate Service...'
                                dir('certificate-service') {
                                    sh 'mvn test'
                                }
                            }
                        }
                        
                        stage('Package Certificate') {
                            steps {
                                echo '📦 Packaging Certificate Service...'
                                dir('certificate-service') {
                                    sh 'mvn package -DskipTests'
                                }
                            }
                        }
                        
                        stage('Docker Certificate') {
                            steps {
                                echo '🐳 Building Certificate Docker image...'
                                dir('certificate-service') {
                                    script {
                                        docker.build("certificate-service:${BUILD_NUMBER}")
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        
        stage('Push Images') {
            when {
                anyOf {
                    branch 'main'
                    branch 'master'
                    branch 'develop'
                    branch 'certificate'
                    branch 'payment'
                }
            }
            steps {
                echo '📤 Pushing Docker images...'
                script {
                    docker.withRegistry("https://${DOCKER_REGISTRY}", "${DOCKER_CREDENTIALS_ID}") {
                        if (env.BUILD_PAYMENT == 'true') {
                            sh "docker push payment-service:${BUILD_NUMBER}"
                        }
                        if (env.BUILD_CERTIFICATE == 'true') {
                            sh "docker push certificate-service:${BUILD_NUMBER}"
                        }
                    }
                }
            }
        }
        
        stage('Deploy') {
            when {
                expression { params.DEPLOY }
            }
            steps {
                echo '🚀 Deploying services...'
                script {
                    if (env.BUILD_PAYMENT == 'true') {
                        sh 'docker-compose up -d payment-service'
                    }
                    if (env.BUILD_CERTIFICATE == 'true') {
                        sh 'docker-compose up -d certificate-service'
                    }
                }
            }
        }
    }
    
    post {
        always {
            cleanWs()
        }
        success {
            echo '✅ Pipeline completed successfully!'
        }
        failure {
            echo '❌ Pipeline failed!'
        }
    }
}
