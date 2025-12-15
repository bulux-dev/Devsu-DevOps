# README
This project demonstrates a complete DevOps CI/CD workflow for a Node.js application, including Dockerization, automated testing, security scanning, and deployment to Kubernetes using best practices. The solution was designed with a production-ready mindset, focusing on quality, security, scalability, and clear documentation.

# GITHUB ACTIONS LINK
https://github.com/bulux-dev/Devsu-DevOps/actions
https://github.com/bulux-dev/Devsu-DevOps/actions/runs/20216985568
https://github.com/bulux-dev/Devsu-DevOps/actions/runs/20216985552

#################################################### 
# ARCHITECHTURE
    
Runtime: Node.js 20
Framework: Express
Database: SQLite (via Sequelize)
Testing: Jest + Supertest
Containerization: Docker
Orchestration: Kubernetes (Docker Desktop)
CI/CD: GitHub Actions
 




┌──────────────────────┐
│ Developer            │
│ Push to main branch  │
└──────────┬───────────┘
           │
           ▼
┌─────────────────────────────┐
│ GitHub Actions              │
│ CI/CD Pipeline (.yml)       │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│ CI Stage                    │
│ ──────────────────────────  │
│ • Install dependencies      │
│ • Static code analysis      │
│ • Unit tests                │
│ • Code coverage             │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│ Docker Stage                │
│ ──────────────────────────  │
│ • Docker build              │
│ • Trivy vulnerability scan  │
│ • Docker push               │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│ Docker Hub                  │
│ Image: devsu-node-app       │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│ CD Stage                    │
│ ──────────────────────────  │
│ • Kubernetes manifests      │
│ • Deployment + Service      │
│ • ConfigMaps & Secrets      │
│ • Ingress                   │
└──────────┬──────────────────┘
           │
           ▼
┌──────────────────────────────────────────┐
│ Kubernetes Cluster                       │
│ (Docker Desktop / Minikube)              │
│                                          │
│ ┌────────────────────────────────────┐   │
│ │ Deployment (2+ replicas)           │   │
│ │ ─────────────────────────────────  │   │
│ │ Pod 1 ── Node.js App (/health)     │   │
│ │ Pod 2 ── Node.js App (/health)     │   │
│ │ HPA ─ Horizontal Pod Autoscaler    │   │
│ └──────────────┬─────────────────────┘   │
│                │                         │
│         ┌──────▼──────┐                  │
│         │ Service     │                  │
│         │ (ClusterIP) │                  │
│         └──────┬──────┘                  │
│                │                         │
│         ┌──────▼──────┐                  │
│         │ Ingress     │                  │
│         │ nginx       │                  │
│         └──────┬──────┘                  │
│                │                         │
│   http://kubernetes.docker.internal      │
└──────────────────────────────────────────┘
#################################################### 
# DOCKERIZATION
The application is packaged as a Docker image following best practices:
    
    Key Docker Decisions
        Non-root execution ( appuser )
        Environment variables via ENV
        Explicit exposed port
        Healthcheck endpoint
        Optimized layer caching
    
    Exposed Port
        Application listens on port 3000
    
    Healthcheck
        Endpoint used for container and Kubernetes health checks:
            GET /health

        Response:
            {"status":"ok"}

#################################################### 
# ENVIRONMENT CONFIGURATION
Environment variables are injected using: - .env (local development) - Kubernetes ConfigMaps and Secrets (cluster runtime)
    Examples: - PORT - DB_STORAGE

#################################################### 
# CI PIPELINE (GitHub Actions)
The CI pipeline is defined as code in:
    .github/workflows/ci-cd.yml

Pipeline Stages
    Code Build
    Install dependencies using npm ci
    Unit Tests
    Jest test suite execution
    Static Code Analysis
    Enforced via linting and test validation
    Code Coverage
    Coverage generated using Jest
    Docker Build & Push
    Image built and pushed to Docker Hub
    Deployment Stage (Documented)
    Kubernetes manifests prepared for deployment

Results can be reviewed in: 
    https://github.com/bulux-dev/Devsu-DevOps/actions

#################################################### 
# CD Strategy (Kubernetes)
The Kubernetes cluster is local (Docker Desktop). For security and architectural reasons, GitHub Actions cannot directly access a local Kubernetes cluster. Therefore: - CI publishes the Docker image - CD is executed manually in the local cluster - This limitation is
explicitly documented. This approach aligns with real-world DevOps best practices.

#################################################### 
# Kubernetes Deployment
All Kubernetes manifests are located in:
    k8s/


Resources Used
    Deployment (2 replicas)
    Service (ClusterIP)
    Horizontal Pod Autoscaler
    ConfigMap
    Secret
    Ingress (NGINX)
    Scaling
    Minimum replicas: 2
    Horizontal Pod Autoscaler enabled

    Internet
       │
       ▼
  Ingress (nginx)
       │
Service (ClusterIP)
       │
   Deployment
┌───────────────┐
│ Pod (Node.js) │
│ Pod (Node.js) │
└───────▲───────┘
        │
       HPA


#################################################### 
# Ingress Access
Ingress is configured using NGINX Ingress Controller provided by Docker Desktop. Host configured in local hosts file:
    127.0.0.1 kubernetes.docker.internal
Application endpoints:
    Healthcheck:
        http://kubernetes.docker.internal/health

#################################################### 
# Architecture Diagram
Developer
 ↓
GitHub Repository
 ↓
GitHub Actions (CI)
 ↓
Docker Hub (Image Registry)
 ↓
Kubernetes (Docker Desktop)
 ├── Deployment (2+ Pods)
 ├── Service
 ├── HPA
 └── Ingress → Application

#################################################### 
# Local Deployment Steps
Build and push image (handled by CI)
Apply Kubernetes manifests locally:
    kubectl apply -f k8s/
Verify resources:
    kubectl get pods
    kubectl get svc
    ykubectl get ingress


#################################################### 
# Security Considerations
Secrets are not hardcoded
Docker image runs as non-root
Kubernetes Secrets used for sensitive data
Clear separation between CI and runtime configuration

#################################################### 
# Known Limitations
    Kubernetes deployment from CI is not executed automatically due to local cluster usage
    TLS certificates are not configured (local environment)
These limitations are documented intentionally.

#################################################### 
# Conclusion
This project demonstrates: - Correct Docker image creation - Proper Kubernetes resource usage - CI/CD
pipeline as code - Clean documentation and architecture clarity
All design decisions were made following DevOps best practices, prioritizing security, clarity, and
maintainability.

#################################################### 
# Poyect Structure
.
├── .github/
│ ├── workflows/
│ │ ├── ci-cd.yml
│ │ ├── ci.yml
├── k8s/
│ ├── configmap.yaml
│ ├── deployment.yaml
│ ├── hpa.yaml
│ ├── ingress.yaml
│ ├── secret.yaml
│ └── service.yaml
├── users/
│ ├── controller.js
│ ├── model.js
│ ├── router.js
├── Dockerfile
├── index.js
├── index.test.js
├── package-lock.json
├── package.json
├── README.md
└── server.js
