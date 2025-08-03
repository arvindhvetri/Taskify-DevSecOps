pipeline {
    agent { label 'Tasky-Build-Master' }

    environment {
        BACKEND_IMAGE = 'arvindh01/backend-taskify:latest'
        FRONTEND_IMAGE = 'arvindh01/frontend-taskify:latest'
        KUBE_NAMESPACE = 'taskify'
    }

    stages {
        stage('Clone Code from GitHub') {
            steps {
                git branch: 'K8s', url: 'https://github.com/arvindhvetri/Taskify-DevSecOps.git'
            }
        }

        stage('Create .env Files') {
            steps {
                withCredentials([
                    string(credentialsId: 'jwt-secret', variable: 'JWT_SECRET')
                ]) {
                    writeFile file: 'backend/.env', text: """PORT=8000
MONGO_URI=mongodb://mongo-service:27017/taskdb
JWT_SECRET=${JWT_SECRET}
ADMIN_INVITE_TOKEN=123456
"""

                    writeFile file: 'frontend/Task-Manager/.env', text: """VITE_BASE_URL=http://backend-service:31100
"""
                }
            }
        }

        stage('Build & Push Docker Images') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'DOCKERHUB_USERNAME',
                    passwordVariable: 'DOCKERHUB_PASSWORD'
                )]) {
                    sh '''
                        echo "Removing old images if exist..."
                        docker rmi -f $BACKEND_IMAGE || true
                        docker rmi -f $FRONTEND_IMAGE || true

                        echo "Building Backend Image..."
                        docker build -t $BACKEND_IMAGE ./backend

                        echo "Building Frontend Image..."
                        docker build -t $FRONTEND_IMAGE ./frontend/Task-Manager

                        echo "Pushing Images to Docker Hub..."
                        echo "$DOCKERHUB_PASSWORD" | docker login -u "$DOCKERHUB_USERNAME" --password-stdin
                        docker push $BACKEND_IMAGE
                        docker push $FRONTEND_IMAGE
                    '''
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh '''
                    echo "Applying Kubernetes Manifests..."

                    # Clean previous deployments
                    sudo kubectl delete -f K8s/mongodb.yaml --ignore-not-found
                    sudo kubectl delete -f K8s/backend.yaml --ignore-not-found
                    sudo kubectl delete -f K8s/frontend.yaml --ignore-not-found

                    # Re-Apply Persistent Volumes
                    sudo kubectl apply -f K8s/mpv.yaml
                    sudo kubectl apply -f K8s/mpvc.yaml

                    sudo kubectl apply -f K8s/upv.yaml
                    sudo kubectl apply -f K8s/upvc.yaml

                    # Deploy MongoDB, Backend, Frontend
                    sudo kubectl apply -f K8s/mongodb.yaml
                    sudo kubectl apply -f K8s/backend.yaml
                    sudo kubectl apply -f K8s/frontend.yaml

                    echo "Waiting for Pods to be Ready..."
                    sudo kubectl rollout status deployment/backend-deployment -n $KUBE_NAMESPACE
                    sudo kubectl rollout status deployment/frontend-deployment -n $KUBE_NAMESPACE
                    sudo kubectl rollout status deployment/mongo-deployment -n $KUBE_NAMESPACE

                    echo "Deployment Successful!"
                '''
            }
        }
    }

    post {
        always {
            echo 'Pipeline Execution Completed!'
        }
    }
}
