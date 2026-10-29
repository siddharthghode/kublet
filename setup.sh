#!/usr/bin/env bash

set -Eeuo pipefail

# ============================================================
# KubePulse Kubernetes Lab Setup
# ============================================================

PROJECT_NAME="kubepulse"
IMAGE_NAME="kubepulse:1.0"
NAMESPACE="kubepulse"
LOG_FILE="k8s-setup.log"

# ------------------------------------------------------------
# Logging
# ------------------------------------------------------------

exec > >(tee -a "$LOG_FILE") 2>&1

START_TIME=$(date)

echo ""
echo "============================================================"
echo "        KubePulse Kubernetes Setup"
echo "============================================================"
echo "Started: $START_TIME"
echo "Log file: $LOG_FILE"
echo "============================================================"
echo ""

# ------------------------------------------------------------
# Helper functions
# ------------------------------------------------------------

step() {
    echo ""
    echo "------------------------------------------------------------"
    echo "STEP: $1"
    echo "------------------------------------------------------------"
}

success() {
    echo ""
    echo "[SUCCESS] $1"
}

fail() {
    echo ""
    echo "[ERROR] $1"
    exit 1
}

# ------------------------------------------------------------
# Error handling
# ------------------------------------------------------------

trap 'echo ""; echo "[ERROR] Script failed at line $LINENO"; echo "Check $LOG_FILE for details."' ERR

# ------------------------------------------------------------
# STEP 1 - Check prerequisites
# ------------------------------------------------------------

step "Checking prerequisites"

command -v docker >/dev/null 2>&1 || fail "Docker is not installed."
command -v kubectl >/dev/null 2>&1 || fail "kubectl is not installed."
command -v minikube >/dev/null 2>&1 || fail "Minikube is not installed."

echo "Docker:"
docker --version

echo ""
echo "kubectl:"
kubectl version --client

echo ""
echo "Minikube:"
minikube version

success "All required commands are installed."

# ------------------------------------------------------------
# STEP 2 - Check Docker daemon
# ------------------------------------------------------------

step "Checking Docker daemon"

docker info >/dev/null 2>&1 || fail "Docker daemon is not running."

success "Docker daemon is running."

# ------------------------------------------------------------
# STEP 3 - Start Minikube
# ------------------------------------------------------------

step "Starting Minikube"

if minikube status >/dev/null 2>&1; then
    echo "Minikube is already running."
else
    minikube start --driver=docker
fi

echo ""
echo "Kubernetes nodes:"
kubectl get nodes

success "Minikube is ready."

# ------------------------------------------------------------
# STEP 4 - Build Docker image
# ------------------------------------------------------------

step "Building Docker image"

echo "Building:"
echo "$IMAGE_NAME"

docker build -t "$IMAGE_NAME" .

success "Docker image built."

echo ""
echo "Docker image:"
docker images | grep kubepulse || true

# ------------------------------------------------------------
# STEP 5 - Load image into Minikube
# ------------------------------------------------------------

step "Loading Docker image into Minikube"

minikube image load "$IMAGE_NAME"

success "Docker image loaded into Minikube."

# ------------------------------------------------------------
# STEP 6 - Create Kubernetes namespace
# ------------------------------------------------------------

step "Creating Kubernetes namespace"

kubectl create namespace "$NAMESPACE" \
    --dry-run=client \
    -o yaml | kubectl apply -f -

success "Namespace '$NAMESPACE' created."

# ------------------------------------------------------------
# STEP 7 - Create Kubernetes directory
# ------------------------------------------------------------

step "Creating Kubernetes manifests directory"

mkdir -p k8s

# ------------------------------------------------------------
# STEP 8 - Create Deployment
# ------------------------------------------------------------

step "Creating Kubernetes Deployment"

cat > k8s/deployment.yaml <<EOF
apiVersion: apps/v1
kind: Deployment

metadata:
  name: kubepulse
  namespace: $NAMESPACE

spec:
  replicas: 2

  selector:
    matchLabels:
      app: kubepulse

  template:
    metadata:
      labels:
        app: kubepulse

    spec:
      containers:
        - name: kubepulse

          image: $IMAGE_NAME

          imagePullPolicy: Never

          ports:
            - containerPort: 80
EOF

echo "Created:"
echo "k8s/deployment.yaml"

# ------------------------------------------------------------
# STEP 9 - Create Service
# ------------------------------------------------------------

step "Creating Kubernetes Service"

cat > k8s/service.yaml <<EOF
apiVersion: v1
kind: Service

metadata:
  name: kubepulse-service
  namespace: $NAMESPACE

spec:
  selector:
    app: kubepulse

  ports:
    - port: 80
      targetPort: 80

  type: NodePort
EOF

echo "Created:"
echo "k8s/service.yaml"

# ------------------------------------------------------------
# STEP 10 - Apply Kubernetes manifests
# ------------------------------------------------------------

step "Deploying application to Kubernetes"

kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml

success "Kubernetes resources created."

# ------------------------------------------------------------
# STEP 11 - Wait for Deployment
# ------------------------------------------------------------

step "Waiting for Pods to become ready"

kubectl rollout status \
    deployment/kubepulse \
    -n "$NAMESPACE" \
    --timeout=120s

success "Deployment is ready."

# ------------------------------------------------------------
# STEP 12 - Show resources
# ------------------------------------------------------------

step "Checking Kubernetes resources"

echo ""
echo "Namespaces:"
kubectl get namespaces

echo ""
echo "Deployments:"
kubectl get deployments -n "$NAMESPACE"

echo ""
echo "Pods:"
kubectl get pods -n "$NAMESPACE" -o wide

echo ""
echo "Services:"
kubectl get services -n "$NAMESPACE"

# ------------------------------------------------------------
# STEP 13 - Test Service
# ------------------------------------------------------------

step "Testing Kubernetes Service"

SERVICE_URL=$(minikube service \
    kubepulse-service \
    -n "$NAMESPACE" \
    --url)

echo ""
echo "KubePulse URL:"
echo "$SERVICE_URL"

echo ""
echo "Testing HTTP response..."

if curl -fsS "$SERVICE_URL" >/dev/null; then
    success "KubePulse HTTP test passed."
else
    fail "KubePulse HTTP test failed."
fi

# ------------------------------------------------------------
# STEP 14 - Test scaling
# ------------------------------------------------------------

step "Testing Kubernetes scaling"

echo "Scaling from 2 Pods to 5 Pods..."

kubectl scale deployment kubepulse \
    --replicas=5 \
    -n "$NAMESPACE"

kubectl rollout status \
    deployment/kubepulse \
    -n "$NAMESPACE" \
    --timeout=120s

echo ""
echo "Pods after scaling:"
kubectl get pods -n "$NAMESPACE"

POD_COUNT=$(kubectl get pods \
    -n "$NAMESPACE" \
    -l app=kubepulse \
    --no-headers | wc -l)

echo ""
echo "Running Pods: $POD_COUNT"

if [ "$POD_COUNT" -eq 5 ]; then
    success "Scaling test passed."
else
    echo "[WARNING] Expected 5 Pods but found $POD_COUNT."
fi

# ------------------------------------------------------------
# STEP 15 - Scale back
# ------------------------------------------------------------

step "Scaling back to 2 Pods"

kubectl scale deployment kubepulse \
    --replicas=2 \
    -n "$NAMESPACE"

kubectl rollout status \
    deployment/kubepulse \
    -n "$NAMESPACE" \
    --timeout=120s

echo ""
kubectl get pods -n "$NAMESPACE"

success "Scale-down test completed."

# ------------------------------------------------------------
# STEP 16 - Self-healing test
# ------------------------------------------------------------

step "Testing Kubernetes self-healing"

POD_TO_DELETE=$(kubectl get pods \
    -n "$NAMESPACE" \
    -l app=kubepulse \
    -o jsonpath='{.items[0].metadata.name}')

echo ""
echo "Deleting Pod:"
echo "$POD_TO_DELETE"

kubectl delete pod "$POD_TO_DELETE" -n "$NAMESPACE"

echo ""
echo "Waiting for Kubernetes to recreate the Pod..."

sleep 5

kubectl get pods -n "$NAMESPACE"

kubectl rollout status \
    deployment/kubepulse \
    -n "$NAMESPACE" \
    --timeout=120s

success "Self-healing test completed."

# ------------------------------------------------------------
# STEP 17 - Final resource state
# ------------------------------------------------------------

step "Final Kubernetes state"

echo ""
echo "================ DEPLOYMENTS ================"

kubectl get deployments -n "$NAMESPACE"

echo ""
echo "================ PODS ================"

kubectl get pods -n "$NAMESPACE" -o wide

echo ""
echo "================ SERVICES ================"

kubectl get services -n "$NAMESPACE"

echo ""
echo "================ REPLICASETS ================"

kubectl get replicasets -n "$NAMESPACE"

# ------------------------------------------------------------
# STEP 18 - Kubernetes summary
# ------------------------------------------------------------

step "Kubernetes resource summary"

kubectl get all -n "$NAMESPACE"

# ------------------------------------------------------------
# STEP 19 - Final information
# ------------------------------------------------------------

END_TIME=$(date)

echo ""
echo "============================================================"
echo "              KUBEPULSE SETUP COMPLETE"
echo "============================================================"
echo ""
echo "Started : $START_TIME"
echo "Finished: $END_TIME"
echo ""
echo "Application:"
echo "  Name      : KubePulse"
echo "  Namespace : $NAMESPACE"
echo "  Image     : $IMAGE_NAME"
echo ""
echo "Service:"
echo "  $SERVICE_URL"
echo ""
echo "Useful commands:"
echo ""
echo "  kubectl get pods -n $NAMESPACE"
echo "  kubectl get deployments -n $NAMESPACE"
echo "  kubectl get services -n $NAMESPACE"
echo "  kubectl get all -n $NAMESPACE"
echo ""
echo "Open application:"
echo ""
echo "  minikube service kubepulse-service -n $NAMESPACE"
echo ""
echo "View logs:"
echo ""
echo "  kubectl logs -n $NAMESPACE <POD_NAME>"
echo ""
echo "View events:"
echo ""
echo "  kubectl get events -n $NAMESPACE"
echo ""
echo "Log file:"
echo "  $LOG_FILE"
echo ""
echo "============================================================"

success "All Kubernetes setup and tests completed."
