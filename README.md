# CanvasFlow - Simple Drawing App (DevOps Demo)

## 1. Project Overview
This project is a simple web-based drawing application where users can draw on a canvas, change colors/sizes, and have their work persisted via local storage. It serves as a demonstration of a full DevOps lifecycle including Development, Containerization, CI/CD, and Monitoring.

## 2. Setup & Discovery (Phase 1)
The application is built with:
- **Frontend**: HTML5 Canvas, CSS3 (Glassmorphism), Vanilla JS.
- **Backend**: Node.js with Express.

### Running Locally
```bash
npm install
npm start
# Open http://localhost:3000
```

## 3. Containerization (Phase 2)
The application is fully containerized using Docker.

### Building the Image
```bash
docker build -t drawing-app .
```

### Running with Docker
```bash
docker run -p 3000:3000 drawing-app
```

### Running with Docker Compose
```bash
docker-compose up
```

## 4. CI/CD Pipeline (Phase 3)
A GitHub Actions pipeline is configured in `.github/workflows/pipeline.yml`.
It performs the following steps on every push to `main`:
1. **Checkout**: Clones the repo.
2. **Setup**: Installs Node.js.
3. **Install**: Runs `npm ci`.
4. **Test**: Runs placeholders for tests.
5. **Build & Push**: Builds the Docker image and pushes to Docker Hub (requires secrets `DOCKERHUB_USERNAME` and `DOCKERHUB_TOKEN`).

## 5. Monitoring & Logs (Phase 4 & 5)
### Simple Dashboard
Access `http://localhost:3000/dashboard.html` for a basic system health overview.

### Advanced Monitoring Stack (Grafana + Loki)
A full logging stack is included in `docker-compose.yml`.
- **Grafana**: `http://localhost:3001` (User: `admin`, Pass: `admin`)
- **Loki**: Log aggregation (Port 3100)
- **Promtail**: Log collection from Docker containers

#### How to see logs:
1. Run `docker-compose up -d`.
2. Open Grafana at `http://localhost:3001`.
3. Go to **Explore**.
4. Select **Loki** as the source.
5. Query `{container="drawing-app_app_1"}` (or similar) to see application logs.

## Challenges & Improvements
- **Challenge**: Docker runtime was unavailable in the current environment, so the image build was configured but not executed.
- **Improvement**: Add real backend database (PostgreSQL/Redis) for cross-device drawing persistence instead of LocalStorage.
