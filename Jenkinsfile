pipeline {
    agent any
    
    options {
        timestamps()
        timeout(time: 1, unit: 'HOURS')
    }

    stages {
        stage('Info') {
            steps {
                echo "=========================================="
                echo "Pipeline: user-service"
                echo "Branch: user_final_user"
                echo "=========================================="
                sh 'pwd && ls -la'
            }
        }
        
        stage('Build') {
            steps {
                echo "🔨 Building..."
                sh 'mvn --version || echo "Maven not found"'
                sh 'docker --version || echo "Docker not found"'
            }
        }
    }
    
    post {
        always {
            echo "✅ Pipeline terminé"
        }
    }
}
