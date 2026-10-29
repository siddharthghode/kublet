#!/usr/bin/env bash
# ==============================================================================
# KubePulse - Kubernetes Teardown Script
# ==============================================================================

set -euo pipefail

CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}======================================================${NC}"
echo -e "${YELLOW}        🧹 KubePulse Teardown & Resource Cleanup       ${NC}"
echo -e "${YELLOW}======================================================${NC}"

# Delete all resources in kubepulse-dev namespace
if kubectl get namespace kubepulse-dev >/dev/null 2>&1; then
    echo -e "${YELLOW}Deleting namespace 'kubepulse-dev' and all contained resources...${NC}"
    kubectl delete namespace kubepulse-dev --timeout=60s || true
    echo -e "${GREEN}✓ Namespace kubepulse-dev deleted.${NC}"
else
    echo -e "${GREEN}Namespace 'kubepulse-dev' does not exist.${NC}"
fi

# Clean up any cluster-level resources created for testing
echo -e "${YELLOW}Checking cluster-scoped resources...${NC}"
kubectl delete clusterrolebinding kubepulse-node-viewer-clusterrolebinding --ignore-not-found=true
kubectl delete clusterrole kubepulse-node-viewer-clusterrole --ignore-not-found=true
kubectl delete persistentvolume kubepulse-manual-pv --ignore-not-found=true
kubectl delete storageclass kubepulse-fast-storage --ignore-not-found=true

echo -e "${GREEN}✓ All KubePulse Kubernetes resources successfully cleaned up!${NC}"
