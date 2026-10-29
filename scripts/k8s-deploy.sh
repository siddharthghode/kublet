#!/usr/bin/env bash
# ==============================================================================
# KubePulse - Automated Kubernetes Deployment Script
# ==============================================================================

set -euo pipefail

CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${CYAN}======================================================${NC}"
echo -e "${CYAN}      ☸️  KubePulse Kubernetes Deployment Pipeline      ${NC}"
echo -e "${CYAN}======================================================${NC}"

# Check prerequisites
command -v kubectl >/dev/null 2>&1 || { echo -e "${RED}Error: kubectl is not installed.${NC}" >&2; exit 1; }
command -v docker >/dev/null 2>&1 || { echo -e "${RED}Error: docker is not installed.${NC}" >&2; exit 1; }

# Detect environment
if command -v minikube >/dev/null 2>&1 && minikube status >/dev/null 2>&1; then
    echo -e "${GREEN}✓ Minikube is active! Configuring Docker environment...${NC}"
    eval $(minikube docker-env)
elif command -v minikube >/dev/null 2>&1; then
    echo -e "${YELLOW}Minikube detected but not running. Starting minikube...${NC}"
    minikube start --driver=docker
    eval $(minikube docker-env)
else
    echo -e "${YELLOW}Minikube not detected. Using host Docker daemon...${NC}"
fi

# Step 1: Build Docker Image
echo -e "\n${YELLOW}[1/4] Building KubePulse container image (kubepulse:latest)...${NC}"
docker build -t kubepulse:latest .
echo -e "${GREEN}✓ Docker image built successfully!${NC}"

# Step 2: Apply All Manifests
echo -e "\n${YELLOW}[2/4] Applying Kubernetes Complete Stack Manifest...${NC}"
kubectl apply -f manifests/complete-stack.yaml

# Step 3: Wait for Deployment Rollout
echo -e "\n${YELLOW}[3/4] Waiting for deployment rollout in 'kubepulse-dev' namespace...${NC}"
kubectl rollout status deployment/kubepulse-deployment -n kubepulse-dev --timeout=120s

# Step 4: Display Status & Access Info
echo -e "\n${GREEN}[4/4] Resources deployed successfully!${NC}"
echo -e "${CYAN}------------------------------------------------------${NC}"
kubectl get pods,svc,hpa,pdb -n kubepulse-dev
echo -e "${CYAN}------------------------------------------------------${NC}"

echo -e "\n${GREEN}🚀 Access KubePulse Dashboard:${NC}"
echo -e "1. ${YELLOW}Port-Forward (Quickest):${NC}"
echo -e "   kubectl port-forward svc/kubepulse-service 8080:80 -n kubepulse-dev"
echo -e "   Open in browser: ${GREEN}http://localhost:8080${NC}"

if command -v minikube >/dev/null 2>&1 && minikube status >/dev/null 2>&1; then
    echo -e "\n2. ${YELLOW}Minikube NodePort / Service Access:${NC}"
    echo -e "   minikube service kubepulse-nodeport -n kubepulse-dev"
fi

echo -e "\n${CYAN}Done! Enjoy learning Kubernetes!${NC}"
