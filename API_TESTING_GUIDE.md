# API Testing Guide - Hotelina Microservices

Complete guide to testing all endpoints with curl, Postman, or Swagger UI.

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Authentication Service](#authentication-service)
3. [Reservation Service](#reservation-service)
4. [Guest Service](#guest-service)
5. [Restaurant Service](#restaurant-service)
6. [Billing Service](#billing-service)
7. [Feature Testing](#feature-testing)
8. [Error Scenarios](#error-scenarios)

---

## Quick Start

### Prerequisites

```bash
# Start all services
.\start-all-services.ps1

# OR use Docker
docker-compose up -d
```

### Verify Services Running

```bash
# Check all health endpoints
curl http://localhost:8001/health
curl http://localhost:8002/health
curl http://localhost:8003/health
curl http://localhost:8004/health
curl http://localhost:8005/health
```

All should return:
```json
{
  "status": "OK",
  "service": "service-name",
  "port": 800X
}
```

---

## Authentication Service

**Base URL:** `http://localhost:8000/api/auth` or `http://localhost:8001/api/auth`  
**Port:** 8001

### 1. Register New User

**Endpoint:** `POST /api/auth/register`

**Request:**
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

**Successful Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Validation Error (400):**
```json
{
  "success": false,
  "errors": [
    {
      "field": "email",
      "message": "Email must be valid"
    }
  ]
}
```

### 2. Login

**Endpoint:** `POST /api/auth/login`

**Request:**
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

**Successful Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Failed Response (401):**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

### 3. Verify Token

**Endpoint:** `GET /api/auth/verify`  
**Requires:** Valid JWT token in Authorization header

**Request:**
```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl -X GET http://localhost:8000/api/auth/verify \
  -H "Authorization: Bearer $TOKEN"
```

**Successful Response (200):**
```json
{
  "success": true,
  "message": "Token is valid",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "john@example.com"
  }
}
```

**Missing Token (401):**
```json
{
  "success": false,
  "message": "No token provided. Please login first."
}
```

---

## Reservation Service

**Base URL:** `http://localhost:8000/api/reservations` or `http://localhost:8002/api/reservations`  
**Port:** 8002

### 1. Create Reservation

**Endpoint:** `POST /api/reservations`

**Request:**
```bash
curl -X POST http://localhost:8000/api/reservations \
  -H "Content-Type: application/json" \
  -d '{
    "guestId": "507f1f77bcf86cd799439011",
    "roomType": "Deluxe",
    "checkIn": "2026-04-01",
    "checkOut": "2026-04-05",
    "numberOfRooms": 2
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Reservation created",
  "reservation": {
    "_id": "507f1f77bcf86cd799439012",
    "guestId": "507f1f77bcf86cd799439011",
    "roomType": "Deluxe",
    "checkIn": "2026-04-01T00:00:00Z",
    "checkOut": "2026-04-05T00:00:00Z",
    "numberOfRooms": 2,
    "status": "pending",
    "totalAmount": 2000
  }
}
```

### 2. Get All Reservations

**Endpoint:** `GET /api/reservations`

**Request:**
```bash
curl -X GET http://localhost:8000/api/reservations
```

**Response:**
```json
{
  "success": true,
  "reservations": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "guestId": "507f1f77bcf86cd799439011",
      "roomType": "Deluxe",
      "checkIn": "2026-04-01T00:00:00Z",
      "checkOut": "2026-04-05T00:00:00Z",
      "numberOfRooms": 2,
      "status": "pending",
      "totalAmount": 2000
    }
  ]
}
```

### 3. Get Specific Reservation

**Endpoint:** `GET /api/reservations/:id`

**Request:**
```bash
curl -X GET http://localhost:8000/api/reservations/507f1f77bcf86cd799439012
```

### 4. Update Reservation

**Endpoint:** `PUT /api/reservations/:id`

**Request:**
```bash
curl -X PUT http://localhost:8000/api/reservations/507f1f77bcf86cd799439012 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "confirmed"
  }'
```

### 5. Cancel Reservation

**Endpoint:** `DELETE /api/reservations/:id`

**Request:**
```bash
curl -X DELETE http://localhost:8000/api/reservations/507f1f77bcf86cd799439012
```

---

## Guest Service

**Base URL:** `http://localhost:8000/api/guests` or `http://localhost:8003/api/guests`  
**Port:** 8003

### 1. Create Guest

**Endpoint:** `POST /api/guests`

**Request:**
```bash
curl -X POST http://localhost:8000/api/guests \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phone": "+1234567890",
    "address": "123 Main St, City",
    "passportNumber": "ABC123456"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Guest created",
  "guest": {
    "_id": "507f1f77bcf86cd799439013",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phone": "+1234567890",
    "address": "123 Main St, City",
    "passportNumber": "ABC123456"
  }
}
```

### 2. Get All Guests

**Endpoint:** `GET /api/guests`

**Request:**
```bash
curl -X GET http://localhost:8000/api/guests
```

### 3. Get Guest Details

**Endpoint:** `GET /api/guests/:id`

**Request:**
```bash
curl -X GET http://localhost:8000/api/guests/507f1f77bcf86cd799439013
```

### 4. Update Guest

**Endpoint:** `PUT /api/guests/:id`

**Request:**
```bash
curl -X PUT http://localhost:8000/api/guests/507f1f77bcf86cd799439013 \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+1987654321"
  }'
```

### 5. Delete Guest

**Endpoint:** `DELETE /api/guests/:id`

**Request:**
```bash
curl -X DELETE http://localhost:8000/api/guests/507f1f77bcf86cd799439013
```

---

## Restaurant Service

**Base URL:** `http://localhost:8000/api/restaurants` or `http://localhost:8004/api/restaurants`  
**Port:** 8004

### 1. Create Food Item

**Endpoint:** `POST /api/restaurants/food`

**Request:**
```bash
curl -X POST http://localhost:8000/api/restaurants/food \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Grilled Salmon",
    "description": "Fresh grilled salmon with lemon",
    "price": 25.99,
    "category": "seafood",
    "availability": true
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Food item created",
  "food": {
    "_id": "507f1f77bcf86cd799439014",
    "name": "Grilled Salmon",
    "description": "Fresh grilled salmon with lemon",
    "price": 25.99,
    "category": "seafood",
    "availability": true
  }
}
```

### 2. Get All Food Items

**Endpoint:** `GET /api/restaurants/food`

**Request:**
```bash
curl -X GET http://localhost:8000/api/restaurants/food
```

### 3. Create Food Order

**Endpoint:** `POST /api/restaurants/orders`

**Request:**
```bash
curl -X POST http://localhost:8000/api/restaurants/orders \
  -H "Content-Type: application/json" \
  -d '{
    "guestId": "507f1f77bcf86cd799439011",
    "items": [
      {
        "foodId": "507f1f77bcf86cd799439014",
        "quantity": 2
      }
    ],
    "specialRequests": "No salt on food"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Order created",
  "order": {
    "_id": "507f1f77bcf86cd799439015",
    "guestId": "507f1f77bcf86cd799439011",
    "items": [
      {
        "foodId": "507f1f77bcf86cd799439014",
        "quantity": 2,
        "price": 25.99
      }
    ],
    "totalAmount": 51.98,
    "status": "pending",
    "specialRequests": "No salt on food"
  }
}
```

### 4. Get All Orders

**Endpoint:** `GET /api/restaurants/orders`

**Request:**
```bash
curl -X GET http://localhost:8000/api/restaurants/orders
```

---

## Billing Service

**Base URL:** `http://localhost:8000/api/billing` or `http://localhost:8005/api/billing`  
**Port:** 8005

### 1. Create Invoice

**Endpoint:** `POST /api/billing/invoices`

**Request:**
```bash
curl -X POST http://localhost:8000/api/billing/invoices \
  -H "Content-Type: application/json" \
  -d '{
    "guestId": "507f1f77bcf86cd799439011",
    "reservationId": "507f1f77bcf86cd799439012",
    "amount": 2500.00,
    "description": "Room charges + food",
    "dueDate": "2026-04-05"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Invoice created",
  "invoice": {
    "_id": "507f1f77bcf86cd799439016",
    "guestId": "507f1f77bcf86cd799439011",
    "reservationId": "507f1f77bcf86cd799439012",
    "amount": 2500.00,
    "description": "Room charges + food",
    "dueDate": "2026-04-05T00:00:00Z",
    "status": "pending",
    "createdAt": "2026-03-30T12:00:00Z"
  }
}
```

### 2. Get All Invoices

**Endpoint:** `GET /api/billing/invoices`

**Request:**
```bash
curl -X GET http://localhost:8000/api/billing/invoices
```

### 3. Get Invoice Details

**Endpoint:** `GET /api/billing/invoices/:id`

**Request:**
```bash
curl -X GET http://localhost:8000/api/billing/invoices/507f1f77bcf86cd799439016
```

### 4. Update Invoice Status

**Endpoint:** `PUT /api/billing/invoices/:id`

**Request:**
```bash
curl -X PUT http://localhost:8000/api/billing/invoices/507f1f77bcf86cd799439016 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "paid"
  }'
```

---

## Feature Testing

### Test 1: Request Validation

**Test invalid email:**
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test",
    "email": "invalid-email",
    "password": "pass123"
  }'
```

**Expected:** 400 error with validation message

**Test short password:**
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test",
    "email": "test@example.com",
    "password": "123"
  }'
```

**Expected:** 400 error - password too short

### Test 2: Request Logging

**Watch console output:**
```bash
# Start service and watch logs
npm run dev
```

**Make request and verify console shows:**
```
POST /api/auth/register 201 45.234 ms - 456
```

### Test 3: Health Checks

**Test all services:**
```bash
for port in 8001 8002 8003 8004 8005; do
  echo "Testing :$port/health"
  curl http://localhost:$port/health
done
```

### Test 4: Authentication Middleware

**Test without token:**
```bash
curl -X GET http://localhost:8000/api/auth/verify
```

**Expected:** 401 Unauthorized

**Test with invalid token:**
```bash
curl -X GET http://localhost:8000/api/auth/verify \
  -H "Authorization: Bearer invalid_token"
```

**Expected:** 401 Unauthorized

**Test with valid token:**
```bash
# First get token from login
TOKEN=$(curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"SecurePass123"}' \
  | jq -r '.token')

# Use token
curl -X GET http://localhost:8000/api/auth/verify \
  -H "Authorization: Bearer $TOKEN"
```

**Expected:** 200 OK with verified user

### Test 5: Rate Limiting

**Test rate limit on auth endpoint:**
```bash
# Make more than 5 requests in 15 minutes
for i in {1..10}; do
  echo "Request $i:"
  curl -X POST http://localhost:8000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"wrong"}'
  sleep 0.5
done
```

**Expected:** After 5 requests, get 429 (Too Many Requests)

### Test 6: Swagger Documentation

**Access Swagger UI:**
```bash
open http://localhost:8001/api-docs
open http://localhost:8002/api-docs
open http://localhost:8003/api-docs
open http://localhost:8004/api-docs
open http://localhost:8005/api-docs
```

**Try endpoint:**
1. Click on an endpoint
2. Click "Try it out"
3. Fill in parameters
4. Click "Execute"
5. View response

### Test 7: Async Error Handling

**Trigger database error:**
```bash
# Use invalid MongoDB ID format
curl -X GET http://localhost:8000/api/guests/invalid-id
```

**Expected:** 400/500 error (handled gracefully, not unhandled promise rejection)

### Test 8: Docker

**Build images:**
```bash
docker-compose build
```

**Run services:**
```bash
docker-compose up -d
```

**Verify running:**
```bash
docker ps
```

**Test health in Docker:**
```bash
curl http://localhost:8001/health
curl http://localhost:8002/health
```

**View logs:**
```bash
docker-compose logs -f auth-service
docker-compose logs -f reservation-service
```

---

## Error Scenarios

### Scenario 1: Duplicate Email Registration

```bash
# First registration
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John",
    "email": "john@example.com",
    "password": "Password123"
  }'

# Second registration with same email
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane",
    "email": "john@example.com",
    "password": "Password456"
  }'
```

**Expected:** 400 error - "Email already registered"

### Scenario 2: Reservation with Invalid Dates

```bash
curl -X POST http://localhost:8000/api/reservations \
  -H "Content-Type: application/json" \
  -d '{
    "guestId": "507f1f77bcf86cd799439011",
    "roomType": "Deluxe",
    "checkIn": "2026-04-05",
    "checkOut": "2026-04-01",
    "numberOfRooms": 1
  }'
```

**Expected:** 400 error - "Check-out date must be after check-in date"

### Scenario 3: Create Invoice for Non-existent Guest

```bash
curl -X POST http://localhost:8000/api/billing/invoices \
  -H "Content-Type: application/json" \
  -d '{
    "guestId": "507f1f77bcf86cd799439099",
    "reservationId": "507f1f77bcf86cd799439012",
    "amount": 100
  }'
```

**Expected:** 404 error - "Guest not found"

### Scenario 4: Missing Required Fields

```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com"
  }'
```

**Expected:** 400 error - "Password is required"

---

## Postman Collection

Save as `Hotelina-API.postman_collection.json`:

```json
{
  "info": {
    "name": "Hotelina Microservices API",
    "version": "1.0"
  },
  "auth": {
    "type": "bearer",
    "bearer": [{"key": "token", "value": "{{token}}", "type": "string"}]
  },
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Register",
          "request": {
            "method": "POST",
            "url": "http://localhost:8000/api/auth/register",
            "body": {
              "mode": "raw",
              "raw": "{\n  \"name\": \"John Doe\",\n  \"email\": \"john@example.com\",\n  \"password\": \"SecurePass123\"\n}"
            }
          }
        },
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "url": "http://localhost:8000/api/auth/login",
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"john@example.com\",\n  \"password\": \"SecurePass123\"\n}"
            }
          }
        }
      ]
    }
  ]
}
```

---

## Testing Workflow

1. **Start Services**
   ```bash
   .\start-all-services.ps1
   ```

2. **Register User**
   ```bash
   # Keep the token from this response
   curl -X POST http://localhost:8000/api/auth/register ...
   ```

3. **Create Guest**
   ```bash
   curl -X POST http://localhost:8000/api/guests ...
   ```

4. **Create Reservation**
   ```bash
   curl -X POST http://localhost:8000/api/reservations ...
   ```

5. **Create Food Order**
   ```bash
   curl -X POST http://localhost:8000/api/restaurants/orders ...
   ```

6. **Create Invoice**
   ```bash
   curl -X POST http://localhost:8000/api/billing/invoices ...
   ```

7. **Verify Token**
   ```bash
   curl -X GET http://localhost:8000/api/auth/verify -H "Authorization: Bearer $TOKEN"
   ```

---

**Happy Testing! 🧪**
