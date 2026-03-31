# 🏨 Guest Service — Hotelina Microservices System

> **Microservice** | Node.js · Express.js · MongoDB · JWT · Swagger  
> **Port:** `8003` | **Database:** `guest_db`

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Role in the System](#role-in-the-system)
3. [Microservices Separation Explained](#microservices-separation-explained)
4. [Why a Separate Database?](#why-a-separate-database)
5. [API Gateway Integration](#api-gateway-integration)
6. [System Integration](#system-integration)
7. [Folder Structure](#folder-structure)
8. [Getting Started](#getting-started)
9. [API Endpoints](#api-endpoints)
10. [Authentication](#authentication)
11. [Swagger Documentation](#swagger-documentation)
12. [Sample Responses](#sample-responses)

---

## Overview

The **Guest Service** is an independent microservice responsible for managing all hotel guest (customer) information within the Hotelina Hotel Management System. It provides a clean RESTful API for creating, reading, updating, and deleting guest records, with JWT-protected write operations.

---

## Role in the System

The Guest Service acts as the **single source of truth for guest identity data** in the hotel system. It is responsible for:

- Storing guest personal information (name, email, phone, address, NIC)
- Providing guest lookup capabilities to other services (e.g., Reservation Service)
- Validating guest identity through unique email and NIC constraints
- Managing guest account statuses (`active`, `inactive`, `blocked`)

**In the broader hotel system:**

```
┌──────────────────────────────────────────────────────────────────┐
│                      API Gateway (Port 8000)                     │
│              Routes all incoming external requests               │
└───────┬──────────────┬───────────────┬────────────────┬──────────┘
        │              │               │                │
        ▼              ▼               ▼                ▼
┌──────────────┐ ┌──────────────┐ ┌────────────┐ ┌──────────────┐
│ Guest Service│ │  Reservation │ │ Restaurant │ │   Billing    │
│   Port 8003  │ │  Port 8002   │ │  Port 8004 │ │  Port 8005   │
│   guest_db   │ │  reserv_db   │ │  rest_db   │ │  billing_db  │
└──────────────┘ └──────────────┘ └────────────┘ └──────────────┘
```

Each service is **completely independent** — it has its own codebase, process, and database. The API Gateway is the only point of contact for external clients.

---

## Microservices Separation Explained

In a **Microservices Architecture**, the application is broken down into small, independently deployable services. Each service:

| Principle | How Guest Service Implements It |
|---|---|
| **Single Responsibility** | Only manages guest data — nothing else |
| **Loose Coupling** | No direct dependency on other services at code level |
| **Independent Deployment** | Can be started, stopped, or updated on its own |
| **Own Data Store** | Uses `guest_db` exclusively — no shared database |
| **API-first** | All interactions happen through REST endpoints |
| **Technology Agnostic** | Can be replaced with any tech stack without affecting others |

**Contrast with Monolith:**

```
MONOLITH (all-in-one)          MICROSERVICES (separated)
─────────────────────          ───────────────────────────
┌───────────────────┐          ┌────────┐ ┌─────────────┐
│  Guests           │          │ Guest  │ │ Reservation │
│  Reservations     │   VS     │Service │ │  Service    │
│  Billing          │          └────────┘ └─────────────┘
│  Restaurant       │          ┌────────┐ ┌─────────────┐
│   (one shared DB) │          │Billing │ │ Restaurant  │
└───────────────────┘          │Service │ │  Service    │
                               └────────┘ └─────────────┘
        Single failure              Each can fail
        brings everything down      independently
```

---

## Why a Separate Database?

The Guest Service uses its own dedicated MongoDB database (`guest_db`) instead of sharing a central database.

### Reasons:

1. **Data Isolation** — Guest data cannot be accidentally corrupted by another service's operations.
2. **Independent Scaling** — If guest lookups increase dramatically, only `guest_db` needs to scale, not the entire system.
3. **Schema Freedom** — The Guest schema can evolve independently without requiring coordinated migrations.
4. **Fault Tolerance** — If the Reservation database crashes, Guest Service continues functioning normally.
5. **Security** — Each service only has credentials to its own database, limiting blast radius of a security breach.
6. **Technology Flexibility** — In theory, each service could even use a different database technology (SQL, NoSQL, etc.).

```
❌ BAD — Shared Database         ✅ GOOD — Database per Service
─────────────────────────        ──────────────────────────────
┌────────┐  ┌───────────┐       ┌────────┐  ┌──────────┐
│ Guest  │  │Reservation│       │ Guest  │  │Reserv.   │
│Service │  │  Service  │       │Service │  │ Service  │
└────┬───┘  └─────┬─────┘       └───┬────┘  └────┬─────┘
     │             │                │             │
     └──────┬──────┘           ┌────┴───┐   ┌────┴────┐
         Shared DB             │guest_db│   │reserv_db│
         (tight coupling)      └────────┘   └─────────┘
                                  (loose coupling)
```

---

## API Gateway Integration

The **API Gateway** (port `8000`) is a single entry point that routes all client requests to the appropriate microservice. This avoids the need for clients to know about individual service ports.

### Without API Gateway:
```
Client → Port 8003 (Guest)
Client → Port 8002 (Reservation)
Client → Port 8004 (Restaurant)
Client → Port 8005 (Billing)
```
*Problem: Client must know 4 different ports. Any port change breaks the client.*

### With API Gateway:
```
Client → Port 8000 (Gateway) → routes to correct service
```
*Benefit: Client only knows one URL regardless of how many services exist.*

### Routing Configuration in Gateway:
```
http://localhost:8000/api/guests     →  http://localhost:8003/guests
http://localhost:8000/api/guests/:id →  http://localhost:8003/guests/:id
http://localhost:8000/api/reserv     →  http://localhost:8002/reservations
```

### How Guest Service supports this:
The service mounts routes on **both** prefixes:
```javascript
app.use("/guests",     guestRoutes);  // Direct:  localhost:8003/guests
app.use("/api/guests", guestRoutes);  // Gateway: localhost:8000/api/guests
```
This means the **same service** responds correctly whether accessed directly or through the gateway — no code change required.

---

## System Integration

The Guest Service integrates with the overall Hotelina system in the following ways:

| Integration Point | Details |
|---|---|
| **API Gateway** | All external requests route through the gateway at port 8000 |
| **Reservation Service** | Reservation Service can call Guest Service to validate guest IDs |
| **Billing Service** | Billing may reference guest information via guest ID |
| **Authentication** | JWT tokens are shared — any service that issues tokens works with this middleware |
| **Health Monitoring** | `/health` endpoint allows gateway and orchestrators to check service liveness |

**JWT Flow:**
```
1. Client logs in  →  Auth service issues JWT token
2. Client calls    →  POST /guests  (with Bearer token in header)
3. Guest Service   →  Validates token using shared JWT_SECRET
4. If valid        →  Processes the request
5. If invalid      →  Returns 401 Unauthorized
```

---

## Folder Structure

```
guest-service/
│
├── src/
│   ├── app.js                    ← Express app config, middleware, route mounting
│   │
│   ├── config/
│   │   ├── db.js                 ← MongoDB connection (guest_db)
│   │   └── swagger.js            ← Swagger/OpenAPI setup and schema definitions
│   │
│   ├── controllers/
│   │   └── guestController.js    ← Business logic (CRUD + search + pagination)
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js     ← JWT token verification
│   │   ├── errorHandler.js      ← Global error handler (Mongoose, duplicates, etc.)
│   │   └── notFound.js          ← 404 catch-all handler
│   │
│   ├── models/
│   │   └── Guest.js             ← Mongoose schema with validation & indexes
│   │
│   └── routes/
│       └── guestRoutes.js       ← Route definitions + Swagger JSDoc annotations
│
├── server.js                    ← Entry point: loads .env, connects DB, starts server
├── package.json                 ← Dependencies and scripts
├── .env                         ← Environment variables (not committed to git)
└── .env.example                 ← Template for environment setup
```

---

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)

### Installation

```bash
# Navigate to guest-service directory
cd guest-service

# Install dependencies
npm install

# Copy environment template
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

# Start in development mode (with auto-reload)
npm run dev

# Start in production mode
npm start
```

---

## API Endpoints

| Method | Endpoint | Auth Required | Description |
|--------|----------|:---:|---|
| `POST` | `/guests` | ✅ JWT | Create a new guest |
| `GET` | `/guests` | ❌ | Get all guests (paginated) |
| `GET` | `/guests/search?email=...` | ❌ | Search guest by email |
| `GET` | `/guests/:id` | ❌ | Get guest by MongoDB ID |
| `PUT` | `/guests/:id` | ✅ JWT | Update guest details |
| `DELETE` | `/guests/:id` | ✅ JWT | Delete a guest |
| `GET` | `/health` | ❌ | Service health check |
| `GET` | `/api-docs` | ❌ | Swagger UI documentation |

### Query Parameters (GET /guests)

| Parameter | Type | Default | Description |
|---|---|---|---|
| `page` | integer | 1 | Page number |
| `limit` | integer | 10 | Results per page (max 100) |
| `email` | string | — | Filter by email (partial match) |
| `name` | string | — | Filter by name (partial match) |
| `status` | string | — | Filter by `active`/`inactive`/`blocked` |

---

## Authentication

Protected endpoints require a **Bearer JWT token** in the `Authorization` header:

```
Authorization: Bearer <your_jwt_token>
```

### Getting a token (for testing):

You can generate a token using Node.js:
```javascript
const jwt = require("jsonwebtoken");
const token = jwt.sign({ id: "testuser123" }, "hotelina_guest_service_super_secret_key_2026", { expiresIn: "1d" });
console.log(token);
```

Or use the Swagger UI's **Authorize** button to enter your token.

---

## Swagger Documentation

Interactive API documentation is available at:

| URL | Description |
|---|---|
| `http://localhost:8003/api-docs` | Direct service documentation |
| `http://localhost:8000/api-docs` | Through API Gateway (if gateway proxies it) |
| `http://localhost:8003/api-docs.json` | Raw OpenAPI JSON spec |

---

## Sample Responses

### POST /guests — Create Guest
```json
// Request Body:
{
  "name": "Tharindra Perera",
  "email": "tharindra@example.com",
  "phone": "+94771234567",
  "address": "42 Lake Road, Colombo 03",
  "nic": "200012345678"
}

// Response 201:
{
  "success": true,
  "message": "Guest created successfully",
  "data": {
    "_id": "64a7f3c2d4e5f6a7b8c9d0e1",
    "name": "Tharindra Perera",
    "email": "tharindra@example.com",
    "phone": "+94771234567",
    "address": "42 Lake Road, Colombo 03",
    "nic": "200012345678",
    "status": "active",
    "createdAt": "2026-03-31T08:00:00.000Z",
    "updatedAt": "2026-03-31T08:00:00.000Z"
  }
}
```

### GET /guests — All Guests (Paginated)
```json
{
  "success": true,
  "count": 2,
  "total": 25,
  "page": 1,
  "pages": 13,
  "data": [
    { "_id": "...", "name": "Tharindra Perera", "email": "tharindra@example.com", "status": "active", ... },
    { "_id": "...", "name": "Amaya Silva", "email": "amaya@example.com", "status": "active", ... }
  ]
}
```

### GET /guests/:id — Not Found
```json
{
  "success": false,
  "message": "Guest not found"
}
```

### POST /guests — Unauthorized (no token)
```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```

### POST /guests — Duplicate Email
```json
{
  "success": false,
  "statusCode": 409,
  "message": "Duplicate value for field: email"
}
```

---

## Guest Schema

```javascript
{
  name:      String  (required),
  email:     String  (required, unique, validated format),
  phone:     String  (optional),
  address:   String  (optional),
  nic:       String  (unique, sparse — optional but unique if provided),
  status:    String  (enum: "active" | "inactive" | "blocked", default: "active"),
  createdAt: Date    (auto-generated),
  updatedAt: Date    (auto-updated)
}
```

---

*Part of the **Hotelina Hotel Management System** — Microservices Architecture Assignment*
