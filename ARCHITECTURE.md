# System Architecture & Implementation Summary

Complete technical overview of the Hotelina Microservices System.

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Architecture Diagram](#architecture-diagram)
3. [Service Documentation](#service-documentation)
4. [Technology Stack](#technology-stack)
5. [Database Schema](#database-schema)
6. [API Gateway Routing](#api-gateway-routing)
7. [Security Architecture](#security-architecture)
8. [Implementation Details](#implementation-details)
9. [Deployment Architecture](#deployment-architecture)

---

## System Overview

### What is Hotelina?

A comprehensive **hotel management microservices system** built with Node.js and Express.js that handles:
- 🔐 User authentication and authorization
- 🏨 Guest profile management
- 📅 Room reservations
- 🍽️ Restaurant orders
- 💳 Billing and invoices

### Architecture Pattern

**Microservices + API Gateway Pattern**

```
Client (Browser/Mobile/API)
        ↓
   API Gateway (8000)
    ↙  ↙  ↙  ↙  ↙
Auth  Res  Guest  Rest  Bill
(8001)(8002)(8003)(8004)(8005)
  ↓    ↓    ↓     ↓     ↓
MongoDB Databases (separate per service)
```

### Key Principles

- **Independence:** Each service has its own database
- **Scalability:** Services can be scaled independently
- **Resilience:** Failure in one service doesn't crash others
- **Modularity:** Clear separation of concerns
- **Maintainability:** Easy to understand and modify

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT APPLICATIONS                      │
│    (Browser / Mobile / Desktop / Third-party Services)      │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTP/REST
                       ↓
        ┌──────────────────────────────┐
        │     API GATEWAY (8000)       │
        │  ┌────────────────────────┐  │
        │  │  Morgan Logging        │  │
        │  │  Rate Limiting         │  │
        │  │  Request Routing       │  │
        │  │  Error Handling        │  │
        │  └────────────────────────┘  │
        └──────┬──────────────────┬────┘
               │                  │
     ┌─────────┼────────┬─────────┼─────────┬──────────┐
     ↓         ↓        ↓         ↓         ↓          ↓
   /auth   /reserv   /guests  /restaurants /billing  /health
     │         │        │         │         │          │
┌────▼──┐ ┌────▼──┐ ┌───▼──┐ ┌───▼──┐ ┌───▼──┐     │
│Auth   │ │Reserv │ │Guest │ │Rest  │ │Bill  │     │
│Svc    │ │Svc    │ │Svc   │ │Svc   │ │Svc   │     │
│(8001) │ │(8002) │ │(8003)│ │(8004)│ │(8005)│     │
└────┬──┘ └────┬──┘ └───┬──┘ └───┬──┘ └───┬──┘     │
     │         │        │        │        │        Pass-through
     ↓         ↓        ↓        ↓        ↓          │
┌────────┐ ┌────────┐ ┌──────┐ ┌──────┐ ┌──────┐ ◄──┘
│Auth_DB │ │Res_DB  │ │Guest │ │Rest  │ │Bill  │
│        │ │        │ │_DB   │ │_DB   │ │_DB   │
│MongoDB │ │MongoDB │ │Mongo │ │Mongo │ │Mongo │
│        │ │        │ │DB    │ │DB    │ │DB    │
└────────┘ └────────┘ └──────┘ └──────┘ └──────┘
```

### Request Flow Example

**Scenario:** New guest registration and room booking

```
1. Client POST /api/auth/register
        ↓
2. API Gateway receives request
        ↓
3. Gateway adds rate-limit check, morgan logging
        ↓
4. Router matches /api/auth → Auth Service (8001)
        ↓
5. Auth Service validates input (express-validator)
        ↓
6. Controller creates user, generates JWT token
        ↓
7. Response sent back through gateway
        ↓
8. Client receives token, stores locally

9. Client POST /api/guests (with token in header)
        ↓
10. API Gateway receives request
        ↓
11. Gateway routes to Guest Service (8003)
        ↓
12. Guest Service receives, validates token (auth middleware)
        ↓
13. Core registers guest in guest_db
        ↓
14. Response sent back to client

15. Client POST /api/reservations
        ↓
16. API Gateway receives request
        ↓
17. Gateway routes to Reservation Service (8002)
        ↓
18. Reservation Service creates booking in res_db
        ↓
19. Response sent back to client
```

---

## Service Documentation

### 1. API Gateway (Port 8000)

**Purpose:** Single entry point for all client requests

**Responsibilities:**
- Route requests to appropriate service
- Apply rate limiting
- Log HTTP requests
- Handle CORS
- Return error responses

**Middleware Stack:**
```javascript
express.json()
cors()
morgan('dev')           // HTTP logging
gatewayLimiter          // 100 requests per 15 min
authLimiter             // Routes specific limits
Router middleware       // Forward to services
errorHandler            // Handle errors
```

**Routing Rules:**
```javascript
/api/auth/*           → http://localhost:8001
/api/reservations/*   → http://localhost:8002
/api/guests/*         → http://localhost:8003
/api/restaurants/*    → http://localhost:8004
/api/billing/*        → http://localhost:8005
/health               → Local check
```

**Files:**
```
api-gateway/
├── src/
│   ├── app.js              # Main application
│   ├── server.js           # Express setup
│   ├── routes/
│   │   └── gateway.js      # Routing logic
│   ├── middleware/
│   │   ├── rateLimit.js   # NEW: Rate limiting
│   │   └── errorHandler.js
│   └── constants/
│       └── index.js        # NEW: Configuration
├── .env                    # Environment variables
├── .dockerignore
├── Dockerfile             # NEW: Container image
└── package.json
```

### 2. Auth Service (Port 8001)

**Purpose:** User authentication, JWT token generation, password security

**Responsibilities:**
- Register new users
- Authenticate users (login)
- Verify JWT tokens
- Password hashing with bcrypt
- User profile management

**Endpoints:**
```
POST   /api/auth/register    # Create new user
POST   /api/auth/login       # Authenticate user
GET    /api/auth/verify      # Check token validity
GET    /api/auth/profile     # Get authenticated user
GET    /health               # Health check
GET    /api-docs             # Swagger documentation
```

**Database Schema:**
```javascript
User {
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed with bcrypt),
  createdAt: Date,
  updatedAt: Date
}
```

**New Files Added:**
- `src/middleware/validation.js` - Input validation
- `src/middleware/authMiddleware.js` - JWT verification
- `src/middleware/healthCheck.js` - Health endpoint
- `src/utils/asyncHandler.js` - Error handling
- `src/constants/index.js` - Configuration
- `src/config/swagger.js` - API documentation

### 3. Reservation Service (Port 8002)

**Purpose:** Room booking and reservation management

**Responsibilities:**
- Create reservations
- Update reservation status
- Cancel reservations
- Query reservations by guest/date
- Calculate pricing

**Endpoints:**
```
GET    /api/reservations           # Get all
GET    /api/reservations/:id       # Get one
POST   /api/reservations           # Create
PUT    /api/reservations/:id       # Update
DELETE /api/reservations/:id       # Cancel
GET    /health                     # Health check
GET    /api-docs                   # Swagger
```

**Database Schema:**
```javascript
Reservation {
  _id: ObjectId,
  guestId: ObjectId,
  roomType: String,
  checkIn: Date,
  checkOut: Date,
  numberOfRooms: Number,
  status: String (pending/confirmed/checked-in/completed/cancelled),
  totalAmount: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### 4. Guest Service (Port 8003)

**Purpose:** Guest profile and customer information management

**Responsibilities:**
- Create guest profiles
- Update guest information
- Retrieve guest details
- Manage contact information

**Endpoints:**
```
GET    /api/guests           # Get all
GET    /api/guests/:id       # Get one
POST   /api/guests           # Create
PUT    /api/guests/:id       # Update
DELETE /api/guests/:id       # Delete
GET    /health               # Health check
GET    /api-docs             # Swagger
```

**Database Schema:**
```javascript
Guest {
  _id: ObjectId,
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  address: String,
  passportNumber: String,
  nationality: String,
  createdAt: Date,
  updatedAt: Date
}
```

### 5. Restaurant Service (Port 8004)

**Purpose:** Food menu management and restaurant orders

**Responsibilities:**
- Manage food items/menu
- Process food orders
- Update order status
- Calculate order totals

**Food Endpoints:**
```
GET    /api/restaurants/food       # Get all menu items
GET    /api/restaurants/food/:id   # Get specific item
POST   /api/restaurants/food       # Add menu item
PUT    /api/restaurants/food/:id   # Update menu item
DELETE /api/restaurants/food/:id   # Remove from menu
```

**Order Endpoints:**
```
GET    /api/restaurants/orders           # Get all orders
GET    /api/restaurants/orders/:id       # Get order details
POST   /api/restaurants/orders           # Create order
PUT    /api/restaurants/orders/:id       # Update order status
DELETE /api/restaurants/orders/:id       # Cancel order
GET    /health                           # Health check
GET    /api-docs                         # Swagger
```

**Database Schema:**
```javascript
Food {
  _id: ObjectId,
  name: String,
  description: String,
  price: Number,
  category: String,
  availability: Boolean,
  createdAt: Date,
  updatedAt: Date
}

Order {
  _id: ObjectId,
  guestId: ObjectId,
  items: [{
    foodId: ObjectId,
    quantity: Number,
    price: Number
  }],
  totalAmount: Number,
  status: String (pending/confirmed/preparing/ready/served),
  specialRequests: String,
  createdAt: Date,
  updatedAt: Date
}
```

### 6. Billing Service (Port 8005)

**Purpose:** Invoice generation and payment tracking

**Responsibilities:**
- Create invoices
- Track payment status
- Calculate totals
- Generate billing reports

**Endpoints:**
```
GET    /api/billing/invoices           # Get all invoices
GET    /api/billing/invoices/:id       # Get invoice details
POST   /api/billing/invoices           # Create invoice
PUT    /api/billing/invoices/:id       # Update payment status
DELETE /api/billing/invoices/:id       # Delete invoice
GET    /health                         # Health check
GET    /api-docs                       # Swagger
```

**Database Schema:**
```javascript
Invoice {
  _id: ObjectId,
  guestId: ObjectId,
  reservationId: ObjectId,
  items: [{
    description: String,
    amount: Number
  }],
  totalAmount: Number,
  status: String (pending/partial/paid/overdue),
  dueDate: Date,
  paidDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

---

## Technology Stack

### Backend Runtime

| Component | Version | Purpose |
|-----------|---------|---------|
| Node.js | 18+ LTS | JavaScript runtime |
| npm | 9+ | Package manager |

### Web Framework

| Package | Version | Purpose |
|---------|---------|---------|
| express | 4.18.2 | Web framework |
| cors | 2.8.5 | Cross-origin requests |

### Database

| Package | Version | Purpose |
|---------|---------|---------|
| mongoose | 7.0+ | MongoDB ODM |
| mongodb | 5.0+ | Database |

### Authentication & Security

| Package | Version | Purpose |
|---------|---------|---------|
| bcryptjs | 2.4.3 | Password hashing |
| jsonwebtoken | 9.0.0 | JWT tokens |
| helmet | 7.0+ | Security headers |

### API & Documentation

| Package | Version | Purpose |
|---------|---------|---------|
| swagger-jsdoc | 6.2.8 | API doc generation |
| swagger-ui-express | 4.6.3 | Swagger UI |

### Logging & Monitoring

| Package | Version | Purpose |
|---------|---------|---------|
| morgan | 1.10.0 | HTTP logging |

### Validation

| Package | Version | Purpose |
|---------|---------|---------|
| express-validator | 7.0.1 | Input validation |

### Rate Limiting

| Package | Version | Purpose |
|---------|---------|---------|
| express-rate-limit | 7.1.5 | Request throttling |

### Containerization

| Tool | Version | Purpose |
|------|---------|---------|
| Docker | 20.10+ | Containerization |
| Docker Compose | 2.0+ | Orchestration |

---

## Database Schema

### Complete Entity Relationship Diagram

```
┌─────────────┐
│   Users     │ (auth_db)
├─────────────┤
│ _id         │ ◄──┐
│ name        │    │
│ email       │    │
│ password    │    │
└─────────────┘    │
                   │
                   │ User registers
                   │
          ┌────────┴─────────┐
          ↓                  ↓
    ┌──────────┐        ┌──────────┐
    │ Guests   │        │ Auth Log │
    ├──────────┤        ├──────────┤
    │ _id      │        │ _id      │
    │ firstName│        │ userId   │
    │ lastName │        │ loginTime│
    │ email    │        │ logoutT  │
    └──────────┘        └──────────┘
         │
         │ Makes
         ↓
    ┌──────────────┐
    │ Reservations │
    ├──────────────┤
    │ _id          │
    │ guestId ─────┼──→ Guests._id
    │ checkIn      │
    │ checkOut     │
    │ roomType     │
    │ totalAmount  │
    └──────────────┘
         │ Generates
         ↓
    ┌──────────────┐         ┌──────────┐
    │  Invoices    │         │ Orders   │
    ├──────────────┤         ├──────────┤
    │ _id          │         │ _id      │
    │ guestId ─────┼──→ Guests._id
    │ reservId     │         │ guestId  │
    │ totalAmount  │         │ items[]  │
    │ status       │         │ total    │
    └──────────────┘         │ status   │
                             └──────────┘
                                  │
                                  │ Contains
                                  ↓
                            ┌──────────┐
                            │ Food     │
                            ├──────────┤
                            │ _id      │
                            │ name     │
                            │ price    │
                            │ category │
                            └──────────┘
```

### Database Connection URLs

```javascript
// Auth Service
mongodb://localhost:27017/auth_db

// Reservation Service
mongodb://localhost:27017/reservation_db

// Guest Service
mongodb://localhost:27017/guest_db

// Restaurant Service
mongodb://localhost:27017/restaurant_db

// Billing Service
mongodb://localhost:27017/billing_db
```

### MongoDB Setup

Each service automatically creates its database and collections on first connection.

**To verify:**
```bash
mongosh
show dbs
use auth_db
show collections
db.users.find()
```

---

## API Gateway Routing

### Request Processing Pipeline

```
Incoming Request
    ↓
[1] CORS Check - Allow cross-origin requests
    ↓
[2] JSON Parser - Parse request body
    ↓
[3] Morgan Logger - Log request details
    ↓
[4] Global Rate Limiter - 100 req/15min per IP
    ↓
[5] Route Specific Check - Additional limits
    ↓
[6] Router Middleware
    │   ├─ /api/auth/* → Auth Service (8001)
    │   ├─ /api/reservations/* → Reservation Service (8002)
    │   ├─ /api/guests/* → Guest Service (8003)
    │   ├─ /api/restaurants/* → Restaurant Service (8004)
    │   └─ /api/billing/* → Billing Service (8005)
    ↓
[7] Service Processes Request
    ├─ Validate input
    ├─ Check authentication
    ├─ Execute business logic
    └─ Access database
    ↓
[8] Response Sent Back
    ↓
[9] Client Receives Response
```

### Routing Configuration

```javascript
// api-gateway/src/routes/gateway.js

router.use('/api/auth', (req, res, next) => {
  // Rate limit for auth endpoints
  authLimiter(req, res, () => {
    axios.post('http://localhost:8001/api/auth' + req.path, req.body)
      .then(response => res.json(response.data))
      .catch(error => handleError(res, error))
  })
})

router.use('/api/reservations', (req, res, next) => {
  axios(`http://localhost:8002/api/reservations${req.path}`, {
    method: req.method,
    data: req.body
  })
    .then(response => res.json(response.data))
    .catch(error => handleError(res, error))
})

// ... similar for /api/guests, /api/restaurants, /api/billing
```

---

## Security Architecture

### Authentication Flow

```
1. User Registration
   ├─ Email & password validation
   ├─ Password hashing with bcrypt (10 rounds)
   ├─ Store in database
   └─ Return JWT token

2. User Login
   ├─ Email validation
   ├─ Query database for user
   ├─ Compare password with stored hash
   ├─ Generate JWT token if match
   └─ Return token to client

3. Protected Route Access
   ├─ Client sends token in Authorization header
   ├─ Auth middleware extracts token
   ├─ Verify JWT signature
   ├─ Check token expiration
   ├─ Extract user ID from token payload
   ├─ Allow/deny request
   └─ Continue to controller or reject
```

### JWT Token Structure

```
Header.Payload.Signature

Example:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJ1c2VySWQiOiI2NjZmZCIsInVzZXJFbWFpbCI6ImpvaG5AZXhhbXBsZS5jb20iLCJpYXQiOjE2NzU5MzI4MDAsImV4cCI6MTY3NTkzNjQwMH0.
dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXo

Decoded Payload:
{
  "userId": "507f1f77bcf86cd799439011",
  "userEmail": "john@example.com",
  "iat": 1675932800,      // issued at
  "exp": 1675936400       // expiration (1 hour)
}
```

### Security Layers

```
┌─────────────────────────────────────────┐
│  Layer 1: Transport Security            │
│  - HTTPS (in production)                │
│  - Secure headers (Helmet)              │
└─────────────────────────────────────────┘
          ↓
┌─────────────────────────────────────────┐
│  Layer 2: Rate Limiting                 │
│  - 100 req/15min (general)              │
│  - 5 auth attempts/15min                │
│  - DDoS protection                      │
└─────────────────────────────────────────┘
          ↓
┌─────────────────────────────────────────┐
│  Layer 3: Input Validation              │
│  - Email format, length checks          │
│  - Password requirements                │
│  - Sanitization against injection       │
└─────────────────────────────────────────┘
          ↓
┌─────────────────────────────────────────┐
│  Layer 4: Authentication                │
│  - JWT token verification               │
│  - Token signature validation           │
│  - Expiration check                     │
└─────────────────────────────────────────┘
          ↓
┌─────────────────────────────────────────┐
│  Layer 5: Password Security             │
│  - Bcrypt hashing (10 rounds)           │
│  - Salt per password                    │
│  - Never stored plain text              │
└─────────────────────────────────────────┘
```

---

## Implementation Details

### Key Middleware Components

#### 1. Express Validator (Input Validation)

```javascript
// src/middleware/validation.js

const { body, validationResult } = require('express-validator');

exports.validateRegister = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required'),
  body('email')
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
];

exports.handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }
  next();
};
```

#### 2. JWT Authentication

```javascript
// src/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No token provided'
    });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};
```

#### 3. Async Error Handling

```javascript
// src/utils/asyncHandler.js

module.exports = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Usage in routes:
router.post('/register', asyncHandler(async (req, res) => {
  const user = await User.create(req.body);
  res.json(user);  // If error, automatically caught and sent to error handler
}));
```

#### 4. Health Check

```javascript
// src/middleware/healthCheck.js

module.exports = (req, res) => {
  res.json({
    status: 'OK',
    service: process.env.SERVICE_NAME,
    port: process.env.PORT,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  });
};
```

#### 5. Constants Management

```javascript
// src/constants/index.js

module.exports = {
  HTTP_STATUS: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_ERROR: 500
  },
  ERROR_MESSAGES: {
    USER_EXISTS: 'Email already registered',
    INVALID_CREDENTIALS: 'Invalid email or password',
    NOT_FOUND: 'Resource not found',
    VALIDATION_FAILED: 'Input validation failed'
  },
  SERVICE: {
    NAME: process.env.SERVICE_NAME,
    PORT: process.env.PORT,
    ENV: process.env.NODE_ENV
  }
};
```

### Environment Variables

```bash
# .env (each service)

# Service Config
SERVICE_NAME=auth-service
PORT=8001
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/auth_db

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRY=1h

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=debug
```

---

## Deployment Architecture

### Local Development

```
Developer Machine
├── Node.js runtime
├── MongoDB instance
└── 6 Terminal windows
    ├─ API Gateway:8000
    ├─ Auth Service:8001
    ├─ Reservation Service:8002
    ├─ Guest Service:8003
    ├─ Restaurant Service:8004
    └─ Billing Service:8005
```

### Docker Deployment

```
Docker Host
├── Container: API Gateway:8000
├── Container: Auth Service:8001
├── Container: Reservation Service:8002
├── Container: Guest Service:8003
├── Container: Restaurant Service:8004
├── Container: Billing Service:8005
├── Container: MongoDB:27017
└── Network: hotelina-network
```

### Production Deployment (Optional)

```
Load Balancer (nginx/HAProxy)
    ├── API Gateway Instance 1:8000
    ├── API Gateway Instance 2:8000
    └── API Gateway Instance 3:8000
            ↓↓↓
    ├── Auth Service Cluster
    ├── Reservation Service Cluster
    ├── Guest Service Cluster
    ├── Restaurant Service Cluster
    └── Billing Service Cluster
            ↓
    MongoDB Replica Set
    ├── Primary
    ├── Secondary
    └── Secondary
```

---

## Performance Metrics

### Expected Performance

| Metric | Value | Notes |
|--------|-------|-------|
| Response Time | < 100ms | Service-to-service |
| Through-put | 1000 req/sec | Per service |
| Concurrent Users | 100+ | Per instance |
| Database Queries | < 50ms | Average |
| Memory Usage | 100-200MB | Per service |
| CPU Usage | 5-15% | Idle/Light load |

### Monitoring Endpoints

```bash
# Health checks (all services)
GET http://localhost:8001/health
GET http://localhost:8002/health
GET http://localhost:8003/health
GET http://localhost:8004/health
GET http://localhost:8005/health

# Expected Response:
{
  "status": "OK",
  "service": "service-name",
  "port": 800X,
  "timestamp": "2026-03-30T12:34:56.789Z",
  "uptime": 1234.567,  // seconds
  "environment": "development"
}
```

---

## Support & Documentation

### Quick Links

- [QUICK_START.md](QUICK_START.md) - Get started in 5 minutes
- [FEATURES_GUIDE.md](FEATURES_GUIDE.md) - Feature explanations
- [API_TESTING_GUIDE.md](API_TESTING_GUIDE.md) - API reference & testing
- [DOCKER_GUIDE.md](DOCKER_GUIDE.md) - Docker deployment

### Common Issues & Solutions

**Port Already in Use:**
```powershell
netstat -ano | findstr :8001
taskkill /PID <PID> /F
```

**MongoDB Not Connecting:**
```bash
mongosh  # Verify MongoDB is running
# If not, start it:
mongod   # or docker run -d -p 27017:27017 mongo:7
```

**Package Dependencies Error:**
```bash
cd service-directory
rm -rf node_modules package-lock.json
npm install
```

---

## Files Structure Summary

```
hotelina-microservices-system/
│
├── 📄 README.md                    # Project overview
├── 📄 QUICK_START.md              # 5-minute setup
├── 📄 FEATURES_GUIDE.md           # Feature details
├── 📄 API_TESTING_GUIDE.md        # API reference
├── 📄 DOCKER_GUIDE.md             # Docker deployment
├── 📄 ARCHITECTURE.md             # This file
│
├── docker-compose.yml              # Docker orchestration
├── start-all-services.ps1         # Windows startup script
│
├── api-gateway/
│   ├── src/app.js
│   ├── src/server.js
│   ├── src/routes/gateway.js
│   ├── src/middleware/
│   │   ├── rateLimit.js
│   │   ├── errorHandler.js
│   │   └── notFound.js
│   ├── src/constants/index.js
│   ├── .env
│   ├── .dockerignore
│   ├── Dockerfile
│   └── package.json
│
├── auth-service/
│   ├── src/app.js
│   ├── src/server.js
│   ├── src/controllers/authController.js
│   ├── src/models/User.js
│   ├── src/routes/authRoutes.js
│   ├── src/middleware/
│   │   ├── validation.js
│   │   ├── authMiddleware.js
│   │   ├── healthCheck.js
│   │   ├── errorHandler.js
│   │   └── notFound.js
│   ├── src/utils/asyncHandler.js
│   ├── src/constants/index.js
│   ├── src/config/swagger.js
│   ├── src/config/db.js
│   ├── .env
│   ├── .dockerignore
│   ├── Dockerfile
│   └── package.json
│
├── reservation-service/
├── guest-service/
├── restaurant-service/
├── billing-service/
│   [Similar structure to auth-service]
│
└── LICENSE
```

---

**Created:** 2026-03-30  
**Version:** 1.0  
**Status:** Production Ready  
**Last Updated:** March 30, 2026
