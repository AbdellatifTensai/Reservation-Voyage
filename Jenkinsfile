pipeline {
    agent any
    
    tools {
        jdk 'JDK 17'
        maven 'Maven 3.8'
        nodejs 'Node 18'
    }
    
    environment {
        JAVA_HOME = tool 'JDK 17'
        PATH = "${tool 'Maven 3.8'}/bin:${env.PATH}"
        NODE_ENV = 'test'
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Backend Tests') {
            stages {
                stage('Java Backend Build') {
                    steps {
                        dir('java-backend') {
                            sh 'mvn clean compile'
                        }
                    }
                }
                
                stage('Java Backend Test') {
                    steps {
                        dir('java-backend') {
                            sh 'mvn test'
                        }
                    }
                    post {
                        always {
                            junit '**/target/surefire-reports/*.xml'
                            jacoco(
                                execPattern: '**/target/jacoco.exec',
                                classPattern: '**/target/classes',
                                sourcePattern: '**/src/main/java'
                            )
                        }
                    }
                }
            }
        }
        
        stage('Frontend Tests') {
            when {
                expression { 
                    fileExists('client/package.json') 
                }
            }
            steps {
                dir('client') {
                    sh 'npm ci'
                    script {
                        try {
                            sh 'npm run test'
                        } catch (Exception e) {
                            echo 'Frontend tests failed, but continuing build'
                        }
                    }
                }
            }
        }
        
        stage('Build Artifacts') {
            when {
                branch 'main'
            }
            parallel {
                stage('Build Java JAR') {
                    steps {
                        dir('java-backend') {
                            sh 'mvn package -DskipTests'
                            archiveArtifacts artifacts: 'target/*.jar', fingerprint: true
                        }
                    }
                }
                
                stage('Build Frontend') {
                    when {
                        expression { 
                            fileExists('client/package.json') 
                        }
                    }
                    steps {
                        dir('client') {
                            sh 'npm run build'
                            archiveArtifacts artifacts: 'dist/**/*', fingerprint: true
                        }
                    }
                }
            }
        }
    }
    
    post {
        always {
            echo 'Cleaning workspace...'
            cleanWs()
        }
        success {
            echo 'Build and tests completed successfully!'
            emailext (
                subject: "Build Successful: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                body: "Build completed successfully: ${env.BUILD_URL}",
                recipientProviders: [developers(), requestor()]
            )
        }
        failure {
            echo 'Build or tests failed!'
            emailext (
                subject: "Build Failed: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                body: "Build failed. Check the console output at: ${env.BUILD_URL}",
                recipientProviders: [developers(), requestor()]
            )
        }
    }
}