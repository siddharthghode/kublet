# KubePulse ☸️

> **Kubernetes Learning Dashboard** — A lightweight, production-style, stateless frontend application designed specifically for hands-on learning of Docker and Kubernetes concepts.

---

## Overview

**KubePulse** is an intentionally simple, zero-backend React + Vite dashboard designed to serve as a reliable, predictable workload for mastering containerization and Kubernetes orchestration. 

Instead of dealing with databases, redis caches, authentication, or external API failures, KubePulse provides:
- **Instant visibility**: Status indicators, simulated CPU/Memory gauges, request counters, and event logs.
- **Environment transparency**: Clear UI display of injected environment variables (`APP_NAME`, `ENVIRONMENT`, `VERSION`, `REGION`).
- **Simulated Pod Identity**: Displays an instance/pod ID to observe load balancing across replicas.
- **Health check route (`/health`)**: Ready for Kubernetes Liveness and Readiness probes.
- **Production-grade Nginx container**: Multi-stage build serving static assets with client-side SPA routing fallback.
- **100% Offline Capability**: Zero external fonts, CDNs, or runtime network calls.

---

## Architecture

KubePulse uses a production-standard static single-page application (SPA) architecture served via Nginx:

```text
       User Request
            │
            ▼
    ┌───────────────┐
    │    Browser    │
    └───────┬───────┘
            │  HTTP GET http://localhost:8080
            ▼
    ┌───────────────┐
    │     Nginx     │  (Port 80 inside container)
    │  Web Server   │  - Handles static asset caching (.js, .css, .svg)
    └───────┬───────┘  - Routes SPA paths (/health, etc.) to index.html
            │
            ▼
┌───────────────────────┐
│  React Static Files   │  (/usr/share/nginx/html)
│  - index.html         │
│  - assets/*.js        │  - Executes completely inside client browser
│  - assets/*.css       │  - Stateless, zero server-side runtime
└───────────────────────┘
```

### Flow Breakdown
1. **Browser** sends an HTTP request to the exposed port (`8080` on host, mapped to `80` in container).
2. **Nginx** receives the request:
   - For static assets (JavaScript, CSS, SVG), Nginx serves the files with caching headers.
   - For all application routes (including `/` and `/health`), Nginx's `try_files $uri $uri/ /index.html;` returns `index.html` with an HTTP `200 OK` status.
3. **React static files** bootstrap in the client browser:
   - React mounts to `<div id="root"></div>`.
   - The client-side router detects the active path and displays either the **Dashboard** or the **Health check** response (`{"status": "healthy"}`).

---

## Project Structure

```text
k8s/
├── src/
│   ├── components/
│   │   ├── Header.jsx          # Header with logo, Healthy badge, and actions
│   │   ├── OverviewCards.jsx   # Status, Requests, CPU, and Memory cards
│   │   ├── ContainerInfo.jsx   # App name, Environment, Version, Instance ID, Region
│   │   └── EventLog.jsx        # Timestamped activity events and log badges
│   ├── pages/
│   │   ├── Dashboard.jsx       # Main dashboard layout
│   │   └── Health.jsx          # /health route returning {"status": "healthy"}
│   ├── data/
│   │   └── initialData.js      # Initial metrics, mock events, and env defaults
│   ├── App.jsx                 # Root component with state & client-side router
│   ├── main.jsx                # React DOM entrypoint
│   └── index.css               # Clean, modern, responsive CSS (zero external deps)
├── public/
│   ├── favicon.svg             # Kubernetes-themed SVG favicon
│   └── robots.txt              # Standard robots.txt
├── .dockerignore               # Build context exclusions
├── .env.example                # Example environment variables
├── .env                        # Local development environment configuration
├── .gitignore                  # Git ignore rules
├── Dockerfile                  # Production multi-stage build (Node -> Nginx)
├── docker-compose.yml          # Docker Compose service definition
├── nginx.conf                  # Nginx configuration (SPA fallback + caching)
├── package.json                # Project dependencies and build scripts
├── vite.config.js              # Vite bundler configuration
└── README.md                   # Project documentation & Kubernetes roadmap
```

---

## Environment Variables

KubePulse supports the following environment variables:

| Variable | Description | Default Value | Kubernetes Mapping |
| :--- | :--- | :--- | :--- |
| `VITE_APP_NAME` | Name of the application | `KubePulse` | ConfigMap |
| `VITE_APP_VERSION` | Application release version | `1.0.0` | ConfigMap / Image Tag |
| `VITE_ENVIRONMENT` | Deployment environment name | `development` | ConfigMap |
| `VITE_REGION` | Cloud region or datacenter zone | `local` | ConfigMap / Node Label |

Sensible default values are configured for local development.

---

## 1. Local Development

Run KubePulse directly on your host machine:

```bash
# 1. Install dependencies
npm install

# 2. Start the local Vite development server
npm run dev
```

The application will be accessible at:
```text
http://localhost:3000
```

---

## 2. Docker Build

Build the production multi-stage Docker image:

```bash
docker build -t kubepulse .
```

* **Stage 1 (Builder)**: Uses `node:20-alpine`, installs dependencies with `npm ci`, and builds optimized static assets using Vite.
* **Stage 2 (Runner)**: Uses `nginx:alpine`, copies the static distribution files, injects custom `nginx.conf`, and exposes port `80`.

---

## 3. Run Docker Container

Run the built image mapping host port `8080` to container port `80`:

```bash
docker run -d --name kubepulse -p 8080:80 kubepulse
```

The application is now live at:
- Dashboard: [http://localhost:8080](http://localhost:8080)
- Health check: [http://localhost:8080/health](http://localhost:8080/health)

To stop and remove the container:
```bash
docker stop kubepulse
docker rm kubepulse
```

---

## 4. Docker Compose

Run KubePulse with Docker Compose:

```bash
docker compose up --build
```

To run in detached (background) mode:
```bash
docker compose up -d --build
```

To stop:
```bash
docker compose down
```

---

## Health Check Endpoint (`/health`)

KubePulse includes a dedicated `/health` route that renders:

```json
{
  "status": "healthy"
}
```

Because Nginx returns `200 OK` for this route, it is directly compatible with:
- Kubernetes **Liveness Probes** (`httpGet: path: /health, port: 80`)
- Kubernetes **Readiness Probes** (`httpGet: path: /health, port: 80`)
- Health verification via `curl http://localhost:8080/health`

---

## Kubernetes Learning Roadmap

Use this step-by-step roadmap to learn Kubernetes hands-on. Create your own manifests in a separate `k8s/` or `manifests/` folder as you progress through each phase:

* **Phase 1: Run the Docker container**
  - Build and verify the image locally using `docker build` and `docker run`.

* **Phase 2: Create a Kubernetes Pod**
  - Write a raw Pod manifest (`pod.yaml`) referencing `kubepulse:latest`.
  - Deploy to a local cluster (Minikube, Kind, or K3s) and test with `kubectl port-forward`.

* **Phase 3: Create a Deployment**
  - Migrate from a standalone Pod to a declarative `Deployment` with replica management.
  - Observe how Kubernetes automatically replaces failed pods.

* **Phase 4: Create a Service**
  - Create a `ClusterIP` or `NodePort` Service to expose KubePulse internally or externally.
  - Understand Kubernetes label selectors and service endpoints.

* **Phase 5: Scale replicas**
  - Scale your deployment to 3+ replicas: `kubectl scale deployment kubepulse --replicas=3`.
  - Refresh the dashboard to observe simulated requests across pods.

* **Phase 6: Perform a rolling update**
  - Update the container image or tag (e.g. `v1.0.1`).
  - Observe zero-downtime rolling updates using `kubectl rollout status`.

* **Phase 7: Use ConfigMap**
  - Externalize `VITE_APP_NAME`, `VITE_ENVIRONMENT`, and `VITE_REGION` into a `ConfigMap`.
  - Mount or inject them into the Deployment pod template.

* **Phase 8: Use Secret**
  - Practice creating a Kubernetes `Secret` for sensitive values and injecting them into the container.

* **Phase 9: Add readiness/liveness probes**
  - Add `livenessProbe` and `readinessProbe` checking `path: /health` on `port: 80`.
  - Simulate pod readiness gates during startup.

* **Phase 10: Add CPU/memory requests and limits**
  - Define `resources.requests` and `resources.limits` (e.g. `cpu: 100m`, `memory: 128Mi`).
  - Monitor pod resource consumption using `kubectl top pods`.

* **Phase 11: Add Horizontal Pod Autoscaler**
  - Create an HPA resource targeting 50% CPU utilization.
  - Simulate load to watch Kubernetes automatically scale pod replicas.

* **Phase 12: Add Ingress**
  - Configure an Ingress controller (e.g., Nginx Ingress) with host-based routing.
  - Access KubePulse through a custom domain name (e.g. `kubepulse.local`).

* **Phase 13: Perform rolling deployment and rollback**
  - Trigger a faulty deployment and rollback instantly using `kubectl rollout undo`.

* **Phase 14: Package the application using Helm**
  - Convert your manifests into a reusable Helm chart with `values.yaml` templating.

---

## License

MIT
