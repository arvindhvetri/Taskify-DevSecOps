pipeline {
    agent { label 'Taskify-Agent' }

    environment {
        SONAR_HOME = tool "Sonar"
        BACKEND_IMAGE = 'arvindh01/k8s-backend-taskify:latest'
        FRONTEND_IMAGE = 'arvindh01/k8s-frontend-taskify:latest'
        KUBE_NAMESPACE = 'taskify'
        WORKER_NODE_IP = '52.14.18.176' // k8s slave machine ip
    }

    stages {

        stage('Clone Code from GitHub') {
            steps {
                git branch: 'K8s', url: 'https://github.com/arvindhvetri/Taskify-DevSecOps.git'
            }
        }

        stage('SonarQube Quality Analysis') {
            steps {
                withSonarQubeEnv("Sonar") {
                    sh '''
                        $SONAR_HOME/bin/sonar-scanner \
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

        stage('Sonar Quality Gate Check') {
            steps {
                timeout(time: 2, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: false
                }
            }
        }

        stage('Trivy Filesystem Scan') {
            steps {
                sh 'trivy fs --format table -o trivy-fs-report.html .'
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

                    writeFile file: 'frontend/Task-Manager/.env', text: """VITE_BASE_URL=http://${WORKER_NODE_IP}:31100
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
                    echo "Checking if namespace '$KUBE_NAMESPACE' exists..."
                    if ! sudo kubectl get namespace $KUBE_NAMESPACE > /dev/null 2>&1; then
                        echo "⚙️ Namespace '$KUBE_NAMESPACE' not found. Creating..."
                        sudo kubectl create namespace $KUBE_NAMESPACE
                    else
                        echo "Namespace '$KUBE_NAMESPACE' already exists."
                    fi
                    echo "Applying Kubernetes Manifests..."

                    # Clean previous deployments
                    kubectl delete -f K8s/mongodb.yaml --ignore-not-found
                    kubectl delete -f K8s/backend.yaml --ignore-not-found
                    kubectl delete -f K8s/frontend.yaml --ignore-not-found

                    # Re-Apply Persistent Volumes
                    kubectl apply -f K8s/mpv.yaml
                    kubectl apply -f K8s/mpvc.yaml

                    kubectl apply -f K8s/upv.yaml
                    kubectl apply -f K8s/upvc.yaml

                    # Deploy MongoDB, Backend, Frontend
                    kubectl apply -f K8s/mongodb.yaml
                    kubectl apply -f K8s/backend.yaml
                    kubectl apply -f K8s/frontend.yaml

                    echo "Waiting for Pods to be Ready..."
                    kubectl rollout status deployment/backend-deployment -n $KUBE_NAMESPACE
                    kubectl rollout status deployment/frontend-deployment -n $KUBE_NAMESPACE
                    kubectl rollout status deployment/mongo-deployment -n $KUBE_NAMESPACE

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
