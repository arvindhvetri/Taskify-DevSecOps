pipeline {
    agent { label 'Tasky-Build-Master' }

    environment {
        BACKEND_IMAGE = 'arvindh01/new-backend-taskify:latest'
        FRONTEND_IMAGE = 'arvindh01/new-frontend-taskify:latest'
        WORKER_NODE_IP = '18.118.93.188'  // Replace this with your Node IP
    }

    stages {
        stage('Clone Code from GitHub') {
            steps {
                git branch: 'Docker', url: 'https://github.com/arvindhvetri/Taskify-DevSecOps.git'
            }
        }

        stage('Create .env Files') {
            steps {
                withCredentials([
                    string(credentialsId: 'jwt-secret', variable: 'JWT_SECRET')
                ]) {
                    writeFile file: 'backend/.env', text: """PORT=8000
MONGO_URI=mongodb://mongo:27017/taskdb
JWT_SECRET=${JWT_SECRET}
ADMIN_INVITE_TOKEN=4588944
"""
                    writeFile file: 'frontend/.env', text: """VITE_BASE_URL=http://${WORKER_NODE_IP}:8000
"""
                }
            }
        }

        stage('Build, Push and Deploy Docker Image') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'DOCKERHUB_USERNAME',
                    passwordVariable: 'DOCKERHUB_PASSWORD'
                )]) {
                    sh '''
                        echo "Cleaning up old Backend & Frontend Containers..."
                        docker ps -a --filter "name=backend-service" --format "{{.ID}}" | xargs -r docker rm -f || true
docker ps -a --filter "name=frontend-service" --format "{{.ID}}" | xargs -r docker rm -f || true
docker ps -a --filter "name=mongodb" --format "{{.ID}}" | xargs -r docker rm -f || true


                        echo "Removing old Docker Images if exist..."
                        docker rmi -f $BACKEND_IMAGE || true
                        docker rmi -f $FRONTEND_IMAGE || true
                        
                        echo "Building Backend Docker Image..."
                        docker build -t $BACKEND_IMAGE ./backend

                        echo "Building Frontend Docker Image..."
                        docker build -t $FRONTEND_IMAGE ./frontend/Task-Manager
                        
                        echo "Logging into Docker Hub..."
                        echo "$DOCKERHUB_PASSWORD" | docker login -u "$DOCKERHUB_USERNAME" --password-stdin

                        echo "Pushing Backend Image & Frontend Image to Docker Hub..."
                        docker push $BACKEND_IMAGE
                        docker push $FRONTEND_IMAGE

                        echo "Bringing down existing Docker Compose stack..."
                        docker-compose down || true
                        
                        echo "Bringing up Docker Compose stack..."
                        docker-compose up -d
                    '''
                }
            }
        }
    }
}
