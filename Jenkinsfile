pipeline {
    agent { label 'Taskify-Agent' }

    environment {
        BACKEND_IMAGE = 'arvindh01/docker-backend-taskify:latest'
        FRONTEND_IMAGE = 'arvindh01/docker-frontend-taskify:latest'
        WORKER_NODE_IP = '3.128.94.230'

        SONAR_HOME = tool "Sonar"  
    }

    stages {
        stage('Clone Code from GitHub') {
            steps {
                git branch: 'Docker', url: 'https://github.com/arvindhvetri/Taskify-DevSecOps.git'
            }
        }

        stage('Create .env Files') {
            steps {
                withCredentials([string(credentialsId: 'jwt-secret', variable: 'JWT_SECRET')]) {
                    writeFile file: 'backend/.env', text: """PORT=8000
MONGO_URI=mongodb://mongo:27017/taskdb
JWT_SECRET=${JWT_SECRET}
ADMIN_INVITE_TOKEN=123456
"""
                    writeFile file: 'frontend/Task-Manager/.env', text: """VITE_BASE_URL=http://${WORKER_NODE_IP}:8000
"""
                }
            }
        }

        stage('SonarQube Quality Analysis') {
            steps {
                withSonarQubeEnv('Sonar') {
                    sh '''
                        ${SONAR_HOME}/bin/sonar-scanner \
                        -Dsonar.projectName=taskify \
                        -Dsonar.projectKey=taskify
                    '''
                }
            }
        }

        stage('OWASP Dependency Check') {
            steps {
                dependencyCheck additionalArguments: '--scan ./', odcInstallation: 'Depcheck'
                dependencyCheckPublisher pattern: '**/dependency-check-report.xml'
            }
        }

        stage('Sonar Quality Gate Scan') {
            steps {
                timeout(time: 2, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: false
                }
            }
        }

        stage('Trivy File System Scan') {
            steps {
                sh 'trivy fs --format table -o trivy-fs-report.html .'
            }
        }

        stage('Cleanup Existing Containers') {
            steps {
                sh '''
                    echo "🧹 Cleaning up old Backend & Frontend Containers..."
                    docker ps -a --filter "name=backend-service" --format "{{.ID}}" | xargs -r docker rm -f || true
                    docker ps -a --filter "name=frontend-service" --format "{{.ID}}" | xargs -r docker rm -f || true
                    docker ps -a --filter "name=mongodb" --format "{{.ID}}" | xargs -r docker rm -f || true
        
                    echo "🔄 Removing old Docker Images if exist..."
                    docker rmi -f $BACKEND_IMAGE || true
                    docker rmi -f $FRONTEND_IMAGE || true
                '''
            }
        }
        
        stage('Build Docker Images') {
            steps {
                sh '''
                    echo "📦 Building Backend Docker Image..."
                    docker build -t $BACKEND_IMAGE ./backend
        
                    echo "📦 Building Frontend Docker Image..."
                    docker build -t $FRONTEND_IMAGE ./frontend/Task-Manager
                '''
            }
        }
        
        stage('Push Docker Images to Docker Hub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'DOCKERHUB_USERNAME',
                    passwordVariable: 'DOCKERHUB_PASSWORD'
                )]) {
                    sh '''
                        echo "🔐 Logging into Docker Hub..."
                        echo "$DOCKERHUB_PASSWORD" | docker login -u "$DOCKERHUB_USERNAME" --password-stdin
        
                        echo "🚀 Pushing Backend Image to Docker Hub..."
                        docker push $BACKEND_IMAGE
        
                        echo "🚀 Pushing Frontend Image to Docker Hub..."
                        docker push $FRONTEND_IMAGE
                    '''
                }
            }
        }
        
        stage('Deploy using Docker Compose') {
            steps {
                sh '''
                    echo "🧹 Bringing down existing Docker Compose stack..."
                    docker-compose down || true
        
                    echo "🚀 Deploying with Docker Compose..."
                    docker-compose up -d
                '''
            }
        }
    }
}
