# Quick Start Guide - Hotelina Microservices

Get your hotel management system up and running in 5 minutes.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Running Services](#running-services)
4. [Verify Setup](#verify-setup)
5. [First API Test](#first-api-test)
6. [Explore Features](#explore-features)

---

## Prerequisites

### Required Software

- **Node.js** 14+ ([Download](https://nodejs.org/))
- **MongoDB** 5.0+ ([Download](https://www.mongodb.com/try/download/community))
- **PowerShell** 5.0+ (Windows default)

### Optional (for Docker)

- **Docker Desktop** ([Download](https://www.docker.com/products/docker-desktop))

### Verify Installation

```bash
# Check Node.js
node --version          # Should be 14+
npm --version          # Should be 6+

# Check MongoDB
mongosh --version      # Should be 1.x+

# Windows: PowerShell
$PSVersionTable.PSVersion.Major  # Should be 5+
```

---

## Installation

### Step 1: Clone Repository

```bash
cd Documents/GitHub
git clone <your-repo-url>
cd hotelina-microservices-system
```

### Step 2: Install Dependencies

**Option A: All Services at Once (PowerShell)**

```powershell
$services = @("api-gateway", "auth-service", "reservation-service", "guest-service", "billing-service", "restaurant-service")
foreach ($service in $services) {
    cd $service
    npm install
    cd ..
    Write-Host "✅ $service dependencies installed"
}
```

**Option B: Manual Installation**

```bash
cd api-gateway && npm install && cd ..
cd auth-service && npm install && cd ..
cd reservation-service && npm install && cd ..
cd guest-service && npm install && cd ..
cd billing-service && npm install && cd ..
cd restaurant-service && npm install && cd ..
```

### Step 3: Start MongoDB

**Windows (with MongoDB installed):**

```bash
# Start MongoDB service
net start MongoDB

# Or use mongod directly
mongod
```

**Docker (alternative):**

```bash
docker run -d -p 27017:27017 --name mongodb mongo:7
```

**Verify MongoDB is running:**

```bash
mongosh
# Should connect successfully
# Type: exit
```

---

## Running Services

### Option 1: PowerShell Script (Recommended)

```powershell
# From repository root
.\start-all-services.ps1
```

This starts all 6 services in separate terminal windows:
- ✅ API Gateway (8000)
- ✅ Auth Service (8001)
- ✅ Reservation Service (8002)
- ✅ Guest Service (8003)
- ✅ Restaurant Service (8004)
- ✅ Billing Service (8005)

### Option 2: Docker Compose

```bash
# From repository root
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### Option 3: Manual (Individual Terminals)

**Terminal 1 - API Gateway:**
```bash
cd api-gateway
npm run dev
# Listening on port 8000
```

**Terminal 2 - Auth Service:**
```bash
cd auth-service
npm run dev
# Listening on port 8001
```

**Terminal 3 - Reservation Service:**
```bash
cd reservation-service
npm run dev
# Listening on port 8002
```

**Terminal 4 - Guest Service:**
```bash
cd guest-service
npm run dev
# Listening on port 8003
```

**Terminal 5 - Restaurant Service:**
```bash
cd restaurant-service
npm run dev
# Listening on port 8004
```

**Terminal 6 - Billing Service:**
```bash
cd billing-service
npm run dev
# Listening on port 8005
```

---

## Verify Setup

### Health Check All Services

```powershell
$ports = @(8001, 8002, 8003, 8004, 8005)
foreach ($port in $ports) {
    $response = curl "http://localhost:$port/health"
    Write-Host "Port $port`:" $response
}
```

Or use curl individually:

```bash
curl http://localhost:8001/health
curl http://localhost:8002/health
curl http://localhost:8003/health
curl http://localhost:8004/health
curl http://localhost:8005/health
```

**Expected Response:**
```json
{
  "status": "OK",
  "service": "auth-service",
  "port": 8001,
  "timestamp": "2026-03-30T12:34:56.789Z"
}
```

### Check MongoDB Connection

```bash
# Connect to MongoDB shell
mongosh

# In mongo shell
show dbs
# You should see databases listed

# Check specific database
use auth_db
show collections
# Exit
exit
```

### Verify All Services Registered

```bash
# Check logs in each terminal window
# Each should show "Server running on port XXXX"
```

---

## First API Test

### Test 1: Register a User

```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePassword123"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Copy the token** for testing protected endpoints.

### Test 2: Login

```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePassword123"
  }'
```

### Test 3: Verify Token (Protected Endpoint)

```bash
# Replace TOKEN with the token from register/login response
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl -X GET http://localhost:8000/api/auth/verify \
  -H "Authorization: Bearer $TOKEN"
```

### Test 4: Create a Guest

```bash
curl -X POST http://localhost:8000/api/guests \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@hotel.com",
    "phone": "+1234567890",
    "address": "123 Main St, City, State"
  }'
```

---

## Explore Features

### 1. View API Documentation (Swagger)

Each service has interactive Swagger documentation:

```
http://localhost:8001/api-docs  (Auth Service)
http://localhost:8002/api-docs  (Reservation Service)
http://localhost:8003/api-docs  (Guest Service)
http://localhost:8004/api-docs  (Restaurant Service)
http://localhost:8005/api-docs  (Billing Service)
```

**In Browser:**
1. Open http://localhost:8001/api-docs
2. Click on any endpoint
3. Click "Try it out"
4. Fill in request body
5. Click "Execute"

### 2. Request Logging

Watch your terminal - each request is logged:

```
POST /api/auth/register 201 45.234 ms - 456
GET  /health 200 2.123 ms - 87
POST /api/auth/login 200 78.543 ms - 523
```

### 3. Rate Limiting

After 5 failed login attempts in 15 minutes:

```json
{
  "success": false,
  "message": "Too many requests from this IP, please try again later."
}
```

### 4. Input Validation

Invalid request:
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John",
    "email": "invalid-email",
    "password": "123"
  }'
```

Response:
```json
{
  "success": false,
  "errors": [
    {"field": "email", "message": "Invalid email format"},
    {"field": "password", "message": "Password must be at least 6 characters"}
  ]
}
```

---

## Troubleshooting

### Services Won't Start

**Check ports are available:**
```powershell
Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue
Get-NetTCPConnection -LocalPort 8001 -ErrorAction SilentlyContinue
```

**Kill process using port (Windows):**
```powershell
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

### MongoDB Connection Error

**Check MongoDB is running:**
```bash
mongosh
```

**Start MongoDB service (Windows):**
```powershell
Start-Service MongoDB
```

### npm install Fails

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm node_modules
rm package-lock.json

# Reinstall
npm install
```

### Port Already in Use

**Windows:**
```powershell
# Find process using port 8000
Get-Process | Where-Object {$_.Handles -match "8000"}

# Kill it
taskkill /IM node.exe /F
```

**Mac/Linux:**
```bash
lsof -i :8000
kill -9 <PID>
```

---

## File Structure

```
hotelina-microservices-system/
├── api-gateway/
│   ├── src/app.js
│   ├── package.json
│   └── ...
├── auth-service/
│   ├── src/
│   │   ├── app.js
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── ...
│   └── package.json
├── reservation-service/
├── guest-service/
├── restaurant-service/
├── billing-service/
├── docker-compose.yml
├── DOCKER_GUIDE.md
├── FEATURES_GUIDE.md
├── API_TESTING_GUIDE.md
└── README.md
```

---

## Service Ports

| Service | Port | Route Prefix |
|---------|------|--------------|
| API Gateway | 8000 | N/A (entry point) |
| Auth Service | 8001 | `/api/auth` |
| Reservation Service | 8002 | `/api/reservations` |
| Guest Service | 8003 | `/api/guests` |
| Restaurant Service | 8004 | `/api/restaurants` |
| Billing Service | 8005 | `/api/billing` |

---

## Database Setup

### MongoDB Databases Created

When services start, they automatically create these databases:

```
auth_db              (Auth Service)
reservation_db       (Reservation Service)
guest_db            (Guest Service)
restaurant_db       (Restaurant Service)
billing_db          (Billing Service)
```

### View Databases

```bash
mongosh
show dbs

# Connect to specific database
use auth_db
show collections
db.users.find()
```

---

## Next Steps

1. **Read Documentation:**
   - [FEATURES_GUIDE.md](FEATURES_GUIDE.md) - Detailed feature explanations
   - [API_TESTING_GUIDE.md](API_TESTING_GUIDE.md) - Complete API reference
   - [DOCKER_GUIDE.md](DOCKER_GUIDE.md) - Docker deployment guide

2. **Test All Endpoints:**
   - Use Swagger UI at http://localhost:800X/api-docs
   - Try curl commands from API_TESTING_GUIDE.md
   - Use Postman for comprehensive testing

3. **Deploy to Docker:**
   ```bash
   docker-compose up -d
   ```

4. **Monitor Services:**
   - Check health endpoints
   - View logs in terminals
   - Use docker-compose logs

5. **Add Your Features:**
   - Extend controllers with business logic
   - Add new endpoints
   - Integrate with frontend

---

## Support

**Getting Help:**

1. Check console logs for errors
2. Verify MongoDB is running
3. Ensure all ports are available
4. Check .env files exist
5. Review [DOCKER_GUIDE.md](DOCKER_GUIDE.md) troubleshooting section

**Common Issues:**

- **Port in use:** Kill node processes, restart services
- **DB connection failed:** Start MongoDB service
- **Dependencies missing:** Run `npm install` again
- **Token expired:** Register/login again

---

## Quick Commands Reference

```bash
# Start all services
.\start-all-services.ps1

# Install dependencies all services
$services = @("api-gateway", "auth-service", "reservation-service", "guest-service", "billing-service", "restaurant-service")
foreach ($service in $services) { cd $service; npm install; cd .. }

# Check health
for ($i=8001; $i -le 8005; $i++) { curl http://localhost:$i/health }

# View Swagger docs
start http://localhost:8001/api-docs

# Start with Docker
docker-compose up -d

# Stop all services
Ctrl+C (in each terminal)
# or
docker-compose down
```

---

**🚀 You're all set! Start building your hotel management system.** 🚀

Created: 2026-03-30  
Version: 1.0  
Status: Ready for Production
