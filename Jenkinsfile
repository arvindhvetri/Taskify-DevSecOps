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
                        docker push $MONGODB_IMAGE

                    '''
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh '''
                   echo "🔍 Checking if namespace '$KUBE_NAMESPACE' exists..."
                    if ! kubectl get namespace $KUBE_NAMESPACE > /dev/null 2>&1; then
                        echo "⚙️ Namespace '$KUBE_NAMESPACE' not found. Creating..."
                        kubectl create namespace $KUBE_NAMESPACE
                    else
                        echo "✅ Namespace '$KUBE_NAMESPACE' already exists."
                    fi
                    
                    echo "🔄 Setting default namespace to '$KUBE_NAMESPACE' in current context..."
                    kubectl config set-context --current --namespace=$KUBE_NAMESPACE
                    echo "🔄 Scaling CoreDNS to 4 replicas in kube-system namespace..."
                    kubectl patch deployment coredns -n kube-system --patch '{"spec": {"replicas": 4}}'
                    
                    echo "⏳ Waiting for CoreDNS pods to be ready..."
                    kubectl rollout status deployment/coredns -n kube-system
                    
                    echo "🗑 Cleaning up previous deployments (if any)..."
                    kubectl delete -f K8s/mongodb.yaml --ignore-not-found
                    kubectl delete -f K8s/backend.yaml --ignore-not-found
                    kubectl delete -f K8s/frontend.yaml --ignore-not-found
                    
                    echo "📦 Applying Persistent Volumes (Cluster-Scoped)..."
                    kubectl apply -f K8s/mpv.yaml
                    kubectl apply -f K8s/upv.yaml
                    
                    echo "📦 Applying Persistent Volume Claims..."
                    kubectl apply -f K8s/mpvc.yaml
                    kubectl apply -f K8s/upvc.yaml
                    
                    echo "🚀 Deploying MongoDB, Backend, Frontend..."
                    kubectl apply -f K8s/mongodb.yaml
                    kubectl apply -f K8s/backend.yaml
                    kubectl apply -f K8s/frontend.yaml
                    
                    echo "⏳ Waiting for all Pods to be Ready..."
                    kubectl rollout status deployment/backend-deployment
                    kubectl rollout status deployment/frontend-deployment
                    kubectl rollout status deployment/mongo-deployment
                    
                    echo "✅ Kubernetes Deployment Successful!"

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
