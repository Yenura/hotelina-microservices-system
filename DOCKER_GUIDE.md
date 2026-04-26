# Docker & Containerization Guide

## Overview

The Hotelina Microservices System includes complete Docker support for easy containerization and deployment.

## What's Included

- ✅ **Dockerfile** for each microservice
- ✅ **docker-compose.yml** for orchestrating all services
- ✅ **.dockerignore** for optimized builds
- ✅ **MongoDB container** with persistent storage
- ✅ **Health checks** for monitoring
- ✅ **Network isolation** for service communication

## Prerequisites

- Docker Desktop installed ([Download](https://www.docker.com/products/docker-desktop))
- At least 4GB RAM allocated to Docker
- ~2GB disk space for images

## Quick Start

### 1. Build and Run All Services

```bash
# Build all images
docker-compose build

# Start all services
docker-compose up -d

# Monitor logs
docker-compose logs -f
```

### 2. Access Services

| Service | URL | Health Check |
|---------|-----|------|
| API Gateway | http://localhost:8000 | http://localhost:8000/health |
| Auth Service | http://localhost:8001 | http://localhost:8001/health |
| Reservation | http://localhost:8002 | http://localhost:8002/health |
| Guest | http://localhost:8003 | http://localhost:8003/health |
| Restaurant | http://localhost:8004 | http://localhost:8004/health |
| Billing | http://localhost:8005 | http://localhost:8005/health |
| MongoDB | localhost:27017 | - |

### 3. Access Documentation

- **Auth Service Swagger:** http://localhost:8001/api-docs
- **Reservation Swagger:** http://localhost:8002/api-docs
- **Guest Swagger:** http://localhost:8003/api-docs
- **Billing Swagger:** http://localhost:8005/api-docs
- **Restaurant Swagger:** http://localhost:8004/api-docs

## Common Commands

### Container Management

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# View all containers
docker-compose ps

# View logs
docker-compose logs [service-name]

# Follow logs in real-time
docker-compose logs -f

# Rebuild images
docker-compose build --no-cache
```

### Database Management

```bash
# Access MongoDB container
docker-compose exec mongodb mongosh

# Backup database
docker-compose exec mongodb mongodump --out /backup

# View MongoDB logs
docker-compose logs mongodb
```

### Individual Service Commands

```bash
# Rebuild specific service
docker-compose build auth-service

# Restart specific service
docker-compose restart auth-service

# Stop specific service
docker-compose stop reservation-service

# View specific service logs
docker-compose logs -f api-gateway
```

## Docker Architecture

```
┌─────────────────────────────────────────────┐
│        Docker Network (hotelina-network)    │
├─────────────────────────────────────────────┤
│                                             │
│  ┌──────────────┐  ┌──────────────┐       │
│  │ API Gateway  │  │  MongoDB     │       │
│  │  (Port 8000) │  │ (Port 27017) │       │
│  └──────────────┘  └──────────────┘       │
│        ↓                                   │
│  ┌─────────────────────────────────────┐  │
│  │      All Microservices (8001-8005)  │  │
│  │  ├─ Auth Service (8001)              │  │
│  │  ├─ Reservation (8002)               │  │
│  │  ├─ Guest (8003)                     │  │
│  │  ├─ Restaurant (8004)                │  │
│  │  └─ Billing (8005)                   │  │
│  └─────────────────────────────────────┘  │
│                                             │
└─────────────────────────────────────────────┘
```

## Dockerfile Details

Each service uses:
- **Base Image:** `node:18-alpine` (lightweight, ~150MB)
- **Working Directory:** `/app`
- **Production Mode:** `npm install --production`
- **Healthcheck:** Configured in docker-compose.yml

Example Dockerfile:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 8001
CMD ["node", "src/server.js"]
```

## Environment Variables in Docker

**For Production Updates**, create `.env` file in root:
```env
JWT_SECRET=your_production_jwt_secret
MONGODB_PASSWORD=secure_mongo_password
NODE_ENV=production
```

Then update `docker-compose.yml` to use these variables.

## Troubleshooting

### Port Already in Use
```bash
# Find and kill process using port
lsof -i :8000
kill -9 <PID>

# Or use different ports in docker-compose.yml
```

### MongoDB Connection Failed
```bash
# Verify MongoDB is running
docker-compose ps mongodb

# Check MongoDB logs
docker-compose logs mongodb

# Restart MongoDB
docker-compose restart mongodb
```

### Out of Memory
```bash
# Increase Docker memory limit in Docker Desktop settings
# Recommended: 4GB - 8GB
```

### Services Not Communicating
```bash
# Check network
docker network ls
docker network inspect hotelina-network

# Verify DNS resolution
docker-compose exec api-gateway ping auth-service
```

## Production Deployment

### Scale Services
```yaml
# Update docker-compose.yml
services:
  auth-service:
    deploy:
      replicas: 3  # Run 3 instances
```

### Add Load Balancer (NGINX)
```bash
# Create nginx container
docker run -d -p 80:80 nginx:alpine
```

### Production Best Practices

1. **Use Environment Variables**
   ```bash
   docker-compose --env-file .env.production up -d
   ```

2. **Add Resource Limits**
   ```yaml
   services:
     auth-service:
       mem_limit: 512m
       cpus: 1
   ```

3. **Enable Log Rotation**
   ```yaml
   services:
     auth-service:
       logging:
         driver: "json-file"
         options:
           max-size: "10m"
           max-file: "3"
   ```

4. **Use Secret Management**
   ```bash
   docker secret create jwt_secret ./jwt_secret.txt
   ```

## Performance Optimization

### Build Optimization
```bash
# Use BuildKit for faster builds
DOCKER_BUILDKIT=1 docker-compose build

# Use .dockerignore to exclude unnecessary files
```

### Runtime Optimization
```yaml
# docker-compose.yml - Add resource limits
services:
  api-gateway:
    mem_limit: 256m
    cpus: 0.5
```

## Monitoring & Health Checks

All services include health checks, automatically monitored by Docker:
```bash
# View health status
docker-compose ps

# Manual health check
curl http://localhost:8001/health
```

## Updating Services

```bash
# Update service code
git pull

# Rebuild affected services
docker-compose build --no-cache auth-service

# Restart service
docker-compose up -d auth-service
```

## Cleanup

```bash
# Remove stopped containers
docker-compose down

# Remove unused images
docker image prune

# Remove all data and volumes
docker-compose down -v
docker volume prune
```

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Reference](https://docs.docker.com/compose/compose-file/)
- [Node.js Docker Best Practices](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)

---

**Created:** 2026-03-30  
**Docker Version:** Compatible with Docker 20.10+  
**Status:** Production Ready
