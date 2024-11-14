pipeline {
    agent any

    environment {
        // Set the manually installed Node.js location
        NODEJS_HOME = 'D:\\FSDT\\SEM 3\\DevOps\\Assignment 4\\node_modules\\.bin'
        PATH = "${NODEJS_HOME}:${env.PATH}"
        SONARQUBE_SERVER = 'SonarQube'
        NEXUS_URL = 'http://localhost:8081'
        NEXUS_REPO = 'devops_assignment4'
        NEXUS_CREDENTIALS_ID = 'nexus_credentials'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                // Run npm install from the specified directory
                dir('D:\\FSDT\\SEM 3\\DevOps\\Assignment 4') {
                    sh 'npm install'
                }
            }
        }

        stage('Build') {
            steps {
                // Run build command in the same directory
                dir('D:\\FSDT\\SEM 3\\DevOps\\Assignment 4') {
                    sh 'npm run build'
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    // Run SonarQube analysis
                    dir('D:\\FSDT\\SEM 3\\DevOps\\Assignment 4') {
                        sh 'sonar-scanner -Dsonar.projectKey=my-nodejs-project'
                    }
                }
            }
        }

        stage('Quality Gate') {
            steps {
                script {
                    timeout(time: 1, unit: 'MINUTES') {
                        waitForQualityGate abortPipeline: true
                    }
                }
            }
        }

        stage('Archive Artifact') {
            steps {
                archiveArtifacts artifacts: 'dist/**', allowEmptyArchive: true
            }
        }

        stage('Deploy to Nexus') {
            steps {
                nexusArtifactUploader artifacts: [
                    [artifactId: 'my-app', classifier: '', file: 'dist/my-app.zip', type: 'zip']
                ],
                credentialsId: "${NEXUS_CREDENTIALS_ID}",
                groupId: 'com.example',
                nexusUrl: "${NEXUS_URL}", // Using the environment variable for flexibility
                repository: "${NEXUS_REPO}",
                version: '1.0.0',
                nexusVersion: '3',  // Added missing parameter
                protocol: 'http'  // Added missing parameter (use 'https' if needed)
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed.'
        }
    }
}
