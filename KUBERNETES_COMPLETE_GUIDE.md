# ☸️ Comprehensive Kubernetes (K8s) Master Guide

Welcome to the complete Kubernetes hands-on repository for **KubePulse**. This repository contains a production-grade, end-to-end suite of Kubernetes manifests, automation scripts, Kustomize overlays, and Helm templates covering every major topic in the Kubernetes ecosystem.

---

## 📑 Table of Contents

1. [Kubernetes Architecture Overview](#kubernetes-architecture-overview)
2. [Manifests Directory Structure](#manifests-directory-structure)
3. [Deep-Dive by Kubernetes Topic](#deep-dive-by-kubernetes-topic)
   - [Phase 0: Namespace & Isolation](#phase-0-namespace--isolation)
   - [Phase 1: Pods & Container Patterns](#phase-1-pods--container-patterns)
   - [Phase 2: ReplicaSets & Self-Healing](#phase-2-replicasets--self-healing)
   - [Phase 3: Deployments & Rolling Updates](#phase-3-deployments--rolling-updates)
   - [Phase 4: Services & Networking](#phase-4-services--networking)
   - [Phase 5: Configuration & Secrets Management](#phase-5-configuration--secrets-management)
   - [Phase 6: Health Probes (Startup, Liveness, Readiness)](#phase-6-health-probes)
   - [Phase 7: Resource Management, Quotas & HPA](#phase-7-resource-management-quotas--hpa)
   - [Phase 8: Storage (PV, PVC, StorageClasses)](#phase-8-storage-pv-pvc-storageclasses)
   - [Phase 9: Ingress Routing & TLS](#phase-9-ingress-routing--tls)
   - [Phase 10: Advanced Workloads (StatefulSet, DaemonSet, Job, CronJob)](#phase-10-advanced-workloads)
   - [Phase 11: Security & RBAC](#phase-11-security--rbac)
   - [Phase 12: High Availability & Network Isolation (PDB, NetPol, Hardening)](#phase-12-high-availability--network-isolation)
   - [Phase 13: Declarative Management with Kustomize](#phase-13-declarative-management-with-kustomize)
   - [Phase 14: Packaging with Helm](#phase-14-packaging-with-helm)
4. [One-Click Quick Start](#one-click-quick-start)
5. [Essential `kubectl` Command Cheat Sheet](#essential-kubectl-command-cheat-sheet)
6. [Debugging & Troubleshooting Playbook](#debugging--troubleshooting-playbook)

---

## 🏛️ Kubernetes Architecture Overview

Kubernetes is a declarative, distributed orchestration engine composed of a **Control Plane** and one or more **Worker Nodes**:

```text
                           ┌───────────────────────────────────────────────┐
                           │              CONTROL PLANE                    │
                           │  ┌───────────────┐     ┌───────────────────┐  │
                           │  │  kube-apiserver│◄───┤  etcd (Key-Value) │  │
                           │  └───────┬───────┘     └───────────────────┘  │
                           │          │                                    │
                           │  ┌───────▼──────────────┐  ┌───────────────┐  │
                           │  │kube-controller-mgr   │  │ kube-scheduler│  │
                           │  └──────────────────────┘  └───────────────┘  │
                           └──────────────────────┬────────────────────────┘
                                                  │ (HTTPS API)
                     ┌────────────────────────────┴───────────────────────────┐
                     ▼                                                        ▼
         ┌────────────────────────┐                               ┌────────────────────────┐
         │      WORKER NODE 1     │                               │      WORKER NODE 2     │
         │  ┌──────────────────┐  │                               │  ┌──────────────────┐  │
         │  │     kubelet      │  │                               │  │     kubelet      │  │
         │  └────────┬─────────┘  │                               │  └────────┬─────────┘  │
         │           ▼            │                               │           ▼            │
         │  ┌──────────────────┐  │                               │  ┌──────────────────┐  │
         │  │    kube-proxy    │  │                               │  │    kube-proxy    │  │
         │  └──────────────────┘  │                               │  └──────────────────┘  │
         │  ┌──────────────────┐  │                               │  ┌──────────────────┐  │
         │  │Container Runtime │  │                               │  │Container Runtime │  │
         │  │   (containerd)   │  │                               │  │   (containerd)   │  │
         │  └────────┬─────────┘  │                               │  └────────┬─────────┘  │
         │           ▼            │                               │           ▼            │
         │    [ Pod ]   [ Pod ]   │                               │    [ Pod ]   [ Pod ]   │
         └────────────────────────┘                               └────────────────────────┘
```

- **kube-apiserver**: The central REST API entrypoint for all cluster management commands.
- **etcd**: Consistent and highly available distributed key-value store holding cluster state.
- **kube-scheduler**: Watches for unassigned pods and selects optimal worker nodes based on resources, affinities, and constraints.
- **kube-controller-manager**: Runs core background control loops (Node Lifecycle, ReplicaSet, Deployment, ServiceAccount).
- **kubelet**: The node agent that ensures containers described in `PodSpecs` are running and healthy.
- **kube-proxy**: Maintains network packet filtering rules on nodes to route traffic to Service endpoints.

---

## 📁 Manifests Directory Structure

```text
k8s/
├── manifests/
│   ├── 00-namespace/
│   │   └── 00-namespace.yaml                      # Namespace definition
│   ├── 01-pod/
│   │   ├── 01-basic-pod.yaml                      # Standalone Pod
│   │   ├── 02-pod-with-env.yaml                   # Pod with Downward API & direct env
│   │   └── 03-multi-container-pod.yaml            # Multi-container pod (Sidecar pattern)
│   ├── 02-replicaset/
│   │   └── 01-replicaset.yaml                     # ReplicaSet with pod templates
│   ├── 03-deployment/
│   │   ├── 01-deployment-basic.yaml               # Declarative Deployment
│   │   └── 02-deployment-rolling-update.yaml      # Rolling update strategy & change-cause
│   ├── 04-services/
│   │   ├── 01-service-clusterip.yaml              # Internal East-West service
│   │   ├── 02-service-nodeport.yaml               # External North-South static port
│   │   ├── 03-service-loadbalancer.yaml           # Cloud / Minikube LoadBalancer
│   │   └── 04-service-headless.yaml               # Headless (Direct DNS to Pod IPs)
│   ├── 05-configmap-secret/
│   │   ├── 01-configmap.yaml                      # Env vars & mounted config.js file
│   │   ├── 02-secret.yaml                         # Sensitive credentials & API keys
│   │   └── 03-deployment-with-config.yaml         # Ingestion via envFrom & volumes
│   ├── 06-probes/
│   │   └── 01-deployment-probes.yaml              # Startup, Liveness, and Readiness probes
│   ├── 07-resources-hpa/
│   │   ├── 01-resource-quota.yaml                 # Namespace compute & object limits
│   │   ├── 02-limit-range.yaml                    # Default container requests/limits
│   │   ├── 03-deployment-resources.yaml           # Explicit CPU/Memory specs
│   │   └── 04-hpa.yaml                            # autoscaling/v2 CPU & Memory rules
│   ├── 08-storage/
│   │   ├── 01-storageclass.yaml                   # Storage provisioner configuration
│   │   ├── 02-persistentvolume.yaml               # PersistentVolume (PV)
│   │   ├── 03-persistentvolumeclaim.yaml          # PersistentVolumeClaim (PVC)
│   │   └── 04-deployment-with-storage.yaml        # Deployment mounting PVC volume
│   ├── 09-ingress/
│   │   ├── 01-ingress.yaml                        # Nginx host/path HTTP router
│   │   └── 02-ingress-tls.yaml                    # Ingress with HTTPS/TLS termination
│   ├── 10-workloads/
│   │   ├── 01-statefulset.yaml                    # Stateful workload with PVC templates
│   │   ├── 02-daemonset.yaml                      # Per-node agent (Node collector)
│   │   ├── 03-job.yaml                            # Run-to-completion batch Job
│   │   └── 04-cronjob.yaml                        # Scheduled health ping CronJob
│   ├── 11-rbac/
│   │   ├── 01-serviceaccount.yaml                 # Pod identity
│   │   ├── 02-role.yaml                           # Namespace-level RBAC rules
│   │   ├── 03-rolebinding.yaml                    # Bind Role to ServiceAccount
│   │   ├── 04-clusterrole.yaml                    # Cluster-wide RBAC rules
│   │   └── 05-clusterrolebinding.yaml             # Bind ClusterRole to ServiceAccount
│   ├── 12-security-network/
│   │   ├── 01-network-policy.yaml                 # Pod network isolation rules
│   │   ├── 02-pod-disruption-budget.yaml          # High availability eviction budget
│   │   └── 03-security-context.yaml               # Non-root, drop ALL capabilities
│   ├── 13-kustomize/
│   │   ├── base/                                  # Common manifests & kustomization.yaml
│   │   └── overlays/
│   │       ├── dev/                               # 1 replica, dev environment patch
│   │       └── prod/                              # 5 replicas, prod resource patch
│   ├── 14-helm/
│   │   └── kubepulse/                             # Production-ready Helm 3 chart
│   └── complete-stack.yaml                        # Single-command production stack
├── scripts/
│   ├── k8s-deploy.sh                              # Complete deployment pipeline
│   ├── traffic-generator.sh                       # Load generator for HPA testing
│   └── k8s-teardown.sh                            # Safe cluster cleanup script
```

---

## 🔬 Deep-Dive by Kubernetes Topic

### Phase 0: Namespace & Isolation
- **Manifest:** `manifests/00-namespace/00-namespace.yaml`
- **Concept:** Namespaces partition cluster resources across teams and environments (`dev`, `staging`, `prod`).
- **Command:**
  ```bash
  kubectl apply -f manifests/00-namespace/00-namespace.yaml
  kubectl get namespaces
  ```

---

### Phase 1: Pods & Container Patterns
- **Manifests:**
  - `manifests/01-pod/01-basic-pod.yaml`: The atomic unit of deployment in Kubernetes.
  - `manifests/01-pod/02-pod-with-env.yaml`: Exposes pod metadata to containers using the **Downward API** (`metadata.name`, `status.podIP`, `spec.nodeName`).
  - `manifests/01-pod/03-multi-container-pod.yaml`: Demonstrates the **Sidecar Pattern**, where a secondary container tails shared access logs via an `emptyDir` volume.
- **Commands:**
  ```bash
  kubectl apply -f manifests/01-pod/01-basic-pod.yaml
  kubectl get pods -n kubepulse-dev -o wide
  kubectl port-forward pod/kubepulse-basic-pod 8080:80 -n kubepulse-dev
  ```

---

### Phase 2: ReplicaSets & Self-Healing
- **Manifest:** `manifests/02-replicaset/01-replicaset.yaml`
- **Concept:** Guarantees a specified number of identical Pods are running at all times using label selectors. If a pod is manually deleted, the ReplicaSet controller detects the drift and immediately launches a replacement.
- **Test Self-Healing:**
  ```bash
  kubectl apply -f manifests/02-replicaset/01-replicaset.yaml
  kubectl get pods -n kubepulse-dev -l app.kubernetes.io/name=kubepulse
  # Delete one pod and observe immediate replacement:
  kubectl delete pod <pod-name> -n kubepulse-dev
  kubectl get pods -n kubepulse-dev
  ```

---

### Phase 3: Deployments & Rolling Updates
- **Manifests:**
  - `manifests/03-deployment/01-deployment-basic.yaml`
  - `manifests/03-deployment/02-deployment-rolling-update.yaml`
- **Concept:** Deployments provide declarative updates over ReplicaSets. `strategy.rollingUpdate.maxUnavailable: 0` ensures zero downtime, while `maxSurge: 1` allows temporary provisioning of one additional pod during transitions.
- **Managing Rollouts:**
  ```bash
  # Check rollout status
  kubectl rollout status deployment/kubepulse-rolling-deployment -n kubepulse-dev

  # Inspect rollout history with change causes
  kubectl rollout history deployment/kubepulse-rolling-deployment -n kubepulse-dev

  # Rollback to previous revision
  kubectl rollout undo deployment/kubepulse-rolling-deployment -n kubepulse-dev
  ```

---

### Phase 4: Services & Networking
- **Manifests:**
  - `01-service-clusterip.yaml`: Stable internal virtual IP for in-cluster communication.
  - `02-service-nodeport.yaml`: Exposes port `30080` across every cluster node.
  - `03-service-loadbalancer.yaml`: Cloud provider load balancer integration.
  - `04-service-headless.yaml`: `clusterIP: None` creates individual DNS A records for each pod (used in stateful clusters).
- **Inspect Endpoints:**
  ```bash
  kubectl apply -f manifests/04-services/01-service-clusterip.yaml
  kubectl get svc,endpoints -n kubepulse-dev
  ```

---

### Phase 5: Configuration & Secrets Management
- **Manifests:**
  - `manifests/05-configmap-secret/01-configmap.yaml`
  - `manifests/05-configmap-secret/02-secret.yaml`
  - `manifests/05-configmap-secret/03-deployment-with-config.yaml`
- **Concept:** Never hardcode configuration in images. KubePulse mounts `config.js` directly into `/usr/share/nginx/html/config.js` via a ConfigMap volume mount, dynamically overriding UI settings in the browser at runtime!
- **Verify Ingestion:**
  ```bash
  kubectl apply -f manifests/05-configmap-secret/
  kubectl exec -it deployment/kubepulse-config-demo -n kubepulse-dev -- env | grep -E "APP_NAME|API_KEY|POD_NAME"
  ```

---

### Phase 6: Health Probes
- **Manifest:** `manifests/06-probes/01-deployment-probes.yaml`
- **Types:**
  1. **Startup Probe:** Prevents premature container restarts while slow initialization tasks run.
  2. **Liveness Probe:** Detects deadlocks and crashes. If it fails, `kubelet` terminates and restarts the container.
  3. **Readiness Probe:** Verifies the container is ready to accept user traffic. If it fails, the pod is removed from Service endpoints without killing the process.
- **Endpoint:** `GET /health` returns HTTP `200 OK`.

---

### Phase 7: Resource Management, Quotas & HPA
- **Manifests:**
  - `01-resource-quota.yaml`: Caps CPU, memory, and object count across the whole namespace.
  - `02-limit-range.yaml`: Injects default requests/limits for pods that don't specify them.
  - `03-deployment-resources.yaml`: Explicit container CPU/memory requests and limits.
  - `04-hpa.yaml`: Scales pod replicas automatically between 2 and 10 based on CPU & Memory utilization metrics.
- **Test HPA Autoscaling:**
  ```bash
  kubectl apply -f manifests/07-resources-hpa/
  # Watch HPA metrics in real time
  kubectl get hpa kubepulse-hpa -n kubepulse-dev -w
  # In another terminal, generate traffic:
  ./scripts/traffic-generator.sh http://localhost:8080 15
  ```

---

### Phase 8: Storage (PV, PVC, StorageClasses)
- **Manifests:**
  - `01-storageclass.yaml`: Defines dynamic storage provisioning.
  - `02-persistentvolume.yaml`: Physical or virtual storage slice (`1Gi`).
  - `03-persistentvolumeclaim.yaml`: Pod's claim for storage (`500Mi`).
  - `04-deployment-with-storage.yaml`: Mounts volume to `/var/log/nginx` to persist access logs beyond pod lifecycle.

---

### Phase 9: Ingress Routing & TLS
- **Manifests:**
  - `01-ingress.yaml`: Routes HTTP requests for `kubepulse.local` to `kubepulse-clusterip-svc:80`.
  - `02-ingress-tls.yaml`: Terminates HTTPS using a TLS Kubernetes Secret.
- **Minikube Ingress Activation:**
  ```bash
  minikube addons enable ingress
  # Add entry to /etc/hosts: 127.0.0.1 kubepulse.local
  kubectl apply -f manifests/09-ingress/01-ingress.yaml
  ```

---

### Phase 10: Advanced Workloads
- **Manifests:**
  - `01-statefulset.yaml`: For stateful applications needing stable network IDs (`kubepulse-stateful-0`, `-1`) and individual volume storage per pod.
  - `02-daemonset.yaml`: Runs exactly one pod per cluster node (ideal for log collectors, metric exporters).
  - `03-job.yaml`: Batch process running to completion with retries (`backoffLimit: 3`).
  - `04-cronjob.yaml`: Scheduled periodic job (e.g. running health audits every 5 minutes).

---

### Phase 11: Security & RBAC
- **Manifests:**
  - `01-serviceaccount.yaml`: Distinct service identity for the application.
  - `02-role.yaml` & `03-rolebinding.yaml`: Grant read-only access to Pods and ConfigMaps within `kubepulse-dev`.
  - `04-clusterrole.yaml` & `05-clusterrolebinding.yaml`: Cluster-wide read access to Node metrics.
- **Verify Permissions:**
  ```bash
  kubectl auth can-i get pods --as=system:serviceaccount:kubepulse-dev:kubepulse-sa -n kubepulse-dev
  # Output: yes
  kubectl auth can-i delete pods --as=system:serviceaccount:kubepulse-dev:kubepulse-sa -n kubepulse-dev
  # Output: no
  ```

---

### Phase 12: High Availability & Network Isolation
- **Manifests:**
  - `01-network-policy.yaml`: Enforces least-privilege network isolation (allows only ingress controller and DNS traffic).
  - `02-pod-disruption-budget.yaml`: Guarantees at least 1 replica remains available during maintenance (`kubectl drain`).
  - `03-security-context.yaml`: Hardens container security (`runAsNonRoot: true`, `drop: [ALL]` capabilities).

---

### Phase 13: Declarative Management with Kustomize
Kustomize enables environment customization without template duplication.
- Build dev overlay:
  ```bash
  kubectl kustomize manifests/13-kustomize/overlays/dev
  ```
- Build prod overlay:
  ```bash
  kubectl kustomize manifests/13-kustomize/overlays/prod
  ```
- Apply directly:
  ```bash
  kubectl apply -k manifests/13-kustomize/overlays/dev
  ```

---

### Phase 14: Packaging with Helm
Located at `helm/kubepulse/`.
- **Install Chart:**
  ```bash
  helm install kubepulse ./helm/kubepulse -n kubepulse-dev --create-namespace
  ```
- **Custom values:**
  ```bash
  helm upgrade --install kubepulse ./helm/kubepulse --set replicaCount=4
  ```

---

## ⚡ One-Click Quick Start

Deploy the entire production stack in seconds:

```bash
# Run the deployment script
./scripts/k8s-deploy.sh
```

Or apply the complete stack manifest directly:
```bash
# 1. Build image locally or inside Minikube
eval $(minikube docker-env 2>/dev/null) || true
docker build -t kubepulse:latest .

# 2. Apply all resources
kubectl apply -f manifests/complete-stack.yaml

# 3. Access dashboard
kubectl port-forward svc/kubepulse-service 8080:80 -n kubepulse-dev
```
Open **[http://localhost:8080](http://localhost:8080)** in your browser!

---

## 🛠️ Essential `kubectl` Command Cheat Sheet

### Cluster & Context
```bash
kubectl cluster-info                     # View cluster control plane info
kubectl get nodes -o wide                # View all nodes with IPs and OS details
kubectl config current-context           # Current active cluster context
```

### Pod Inspection & Debugging
```bash
kubectl get pods -n kubepulse-dev -o wide     # List pods with IPs and node placement
kubectl describe pod <pod-name> -n kubepulse-dev # Deep inspection of events and failure reasons
kubectl logs <pod-name> -n kubepulse-dev     # View container logs
kubectl logs -f <pod-name> -n kubepulse-dev  # Stream container logs live
kubectl exec -it <pod-name> -n kubepulse-dev -- /bin/sh # Open interactive shell in container
```

### Deployments & Scaling
```bash
kubectl scale deployment/kubepulse-deployment --replicas=5 -n kubepulse-dev
kubectl set image deployment/kubepulse-deployment kubepulse=kubepulse:v2 -n kubepulse-dev
kubectl rollout status deployment/kubepulse-deployment -n kubepulse-dev
kubectl rollout undo deployment/kubepulse-deployment -n kubepulse-dev
```

### Clean Up
```bash
./scripts/k8s-teardown.sh
```

---

## 🩺 Debugging & Troubleshooting Playbook

| Issue / State | Root Cause | Solution |
| :--- | :--- | :--- |
| `CrashLoopBackOff` | Application crashes on startup or health probe fails | Run `kubectl logs <pod>` and `kubectl describe pod <pod>` |
| `ImagePullBackOff` | Image name/tag typo, missing image, or private registry credentials missing | Verify image name with `docker images`; set `imagePullPolicy: IfNotPresent` for local builds |
| `Pending` | Insufficient CPU/Memory on nodes, or node selectors/taints unmatched | Run `kubectl describe pod <pod>` and check `Events` section |
| `Service 404 / Connection Refused` | Label selector in Service does not match Pod template labels | Check `kubectl get endpoints <service-name>` |
| `OOMKilled` (Exit Code 137) | Container exceeded its defined `resources.limits.memory` | Increase memory limit in Deployment manifest |

---

Happy learning! 🚀
