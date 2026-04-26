# API Gateway

Central gateway for the Hotelina Hotel Management System. Routes incoming requests to appropriate microservices.

## Features

- Centralized entry point for all microservices
- Request routing to individual services
- CORS enabled
- Error handling
- Service availability checks

## Port

- **Gateway Port:** 8000

## Environment Variables

Create a `.env` file in the root directory:

```
PORT=8000
NODE_ENV=development
AUTH_SERVICE_URL=http://localhost:8001
RESERVATION_SERVICE_URL=http://localhost:8002
GUEST_SERVICE_URL=http://localhost:8003
RESTAURANT_SERVICE_URL=http://localhost:8004
BILLING_SERVICE_URL=http://localhost:8005
```

## Installation

```bash
npm install
```

## Running the Gateway

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

## Service Routes

The API Gateway routes requests to the following microservices:

| Route | Service | Port |
|-------|---------|------|
| `/api/auth/*` | Auth Service | 8001 |
| `/api/reservations/*` | Reservation Service | 8002 |
| `/api/guests/*` | Guest Service | 8003 |
| `/api/restaurants/*` | Restaurant Service | 8004 |
| `/api/billing/*` | Billing Service | 8005 |

## Architecture

```
Client (Postman)
    ↓
API Gateway (8000)
    ├→ Auth Service (8001)
    ├→ Reservation Service (8002)
    ├→ Guest Service (8003)
    ├→ Restaurant Service (8004)
    └→ Billing Service (8005)
```

## Example Usage

### Register through Gateway
```
POST http://localhost:8000/api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Get Reservations through Gateway
```
GET http://localhost:8000/api/reservations
```

## Request Flow

1. Client sends request to Gateway (8000)
2. Gateway routes request to appropriate service
3. Service processes request and returns response
4. Gateway forwards response back to client

## Error Handling

The gateway includes error handling for:
- Service unavailability
- Invalid routes
- Timeout issues
- Server errors

## Load Balancing (Future Enhancement)

The current implementation routes to single service instances. For production, consider:
- Multiple instances per service
- Load balancing strategies
- Health checks
- Circuit breakers
