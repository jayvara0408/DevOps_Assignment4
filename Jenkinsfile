pipeline {
    agent any

    environment {
        // Using the pre-configured NodeJS installation from Jenkins tools
        NODEJS_HOME = tool name: 'NodeJS', type: 'NodeJSInstallation'
        PATH = "${NODEJS_HOME}/bin:${env.PATH}"
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
                // Using Node.js to install dependencies
                sh 'npm install'
            }
        }

        stage('Build') {
            steps {
                // Using Node.js to run the build
                sh 'npm run build'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    // Running SonarQube scanner for analysis
                    sh 'sonar-scanner -Dsonar.projectKey=my-nodejs-project'
                }
            }
        }

        stage('Quality Gate') {
            steps {
                script {
                    timeout(time: 1, unit: 'MINUTES') {
                        // Wait for quality gate results
                        waitForQualityGate abortPipeline: true
                    }
                }
            }
        }

        stage('Archive Artifact') {
            steps {
                // Archiving the build artifacts (e.g., dist directory)
                archiveArtifacts artifacts: 'dist/**', allowEmptyArchive: true
            }
        }

        stage('Deploy to Nexus') {
            steps {
                // Deploy the artifact to Nexus repository
                nexusArtifactUploader artifacts: [
                    [artifactId: 'my-app', classifier: '', file: 'dist/my-app.zip', type: 'zip']
                ],
                credentialsId: "${NEXUS_CREDENTIALS_ID}",
                groupId: 'com.example',
                nexusUrl: "${NEXUS_URL}",
                repository: "${NEXUS_REPO}",
                version: '1.0.0',
                nexusVersion: '3',
                protocol: 'http'  // or 'https' based on your Nexus configuration
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
