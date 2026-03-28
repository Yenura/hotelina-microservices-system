# Billing/Payment Service

A microservice for managing invoices and payments in the Hotelina Hotel Management System.

## Overview

The Billing Service handles all payment and invoice management operations. It allows creation of invoices, tracking payment status, recording payments, and generating billing statistics.

## Features

- **Invoice Management**
  - Create invoices with room charges, restaurant charges, and additional charges
  - Automatic tax calculation
  - Track invoice status (pending, partial, completed, cancelled)

- **Payment Processing**
  - Record payments against invoices
  - Support multiple payment methods (cash, credit card, debit card, bank transfer, check)
  - Automatic balance calculation

- **Billing Analytics**
  - Payment statistics by status
  - Total billing and collection metrics
  - Outstanding balance tracking

- **Data Filtering & Pagination**
  - Filter invoices by status and guest ID
  - Pagination support for large datasets

## Technology Stack

- Node.js & Express.js
- MongoDB & Mongoose
- Express Validator for input validation
- Helmet for security
- CORS for cross-origin requests
- Morgan for HTTP request logging

## Installation

1. Navigate to the billing-service directory:
```bash
cd billing-service
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Configure your MongoDB connection in `.env`

## Running the Service

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The service will start on port **8005** by default.

## API Endpoints

### Create Invoice
```
POST /api/billing
Content-Type: application/json

{
  "invoiceNumber": "INV-001",
  "guestId": "guest_id",
  "reservationId": "reservation_id",
  "roomCharges": 100,
  "restaurantCharges": 50,
  "additionalCharges": 20,
  "discount": 5,
  "taxRate": 10,
  "dueDate": "2026-04-28T00:00:00Z",
  "notes": "Optional notes"
}
```

### Get All Invoices (with filters)
```
GET /api/billing?status=pending&guestId=123&page=1&limit=10
```

### Get Invoice by ID
```
GET /api/billing/:id
```

### Update Invoice
```
PATCH /api/billing/:id
Content-Type: application/json

{
  "discount": 10,
  "notes": "Updated notes"
}
```

### Record Payment
```
POST /api/billing/:id/payment
Content-Type: application/json

{
  "amountPaid": 50,
  "paymentMethod": "credit_card",
  "notes": "Payment received"
}
```

### Get Payment Statistics
```
GET /api/billing/statistics
```

### Delete Invoice
```
DELETE /api/billing/:id
```

## Database Schema

### Invoice Collection

| Field | Type | Description |
|-------|------|-------------|
| invoiceNumber | String | Unique invoice identifier |
| guestId | ObjectId | Reference to guest |
| reservationId | ObjectId | Reference to reservation |
| roomCharges | Number | Room rental charges |
| restaurantCharges | Number | Food & beverage charges |
| additionalCharges | Number | Extra charges |
| discount | Number | Discount amount |
| taxRate | Number | Tax percentage (default: 10%) |
| tax | Number | Calculated tax amount |
| totalAmount | Number | Total invoice amount |
| amountPaid | Number | Amount paid so far |
| balanceDue | Number | Outstanding balance |
| paymentStatus | String | pending/partial/completed/cancelled |
| paymentMethod | String | Payment method used |
| invoiceDate | Date | Invoice creation date |
| dueDate | Date | Payment due date |
| notes | String | Additional notes |

## Health Check

```
GET /health

Response:
{
  "success": true,
  "service": "billing-service",
  "status": "healthy",
  "timestamp": "2026-03-28T10:00:00.000Z"
}
```

## Error Handling

The service includes comprehensive error handling for:
- Validation errors
- Duplicate invoice numbers
- Invalid MongoDB IDs
- Not found resources
- Server errors

## Development

To modify or extend this service:

1. **Models**: Update in `src/models/Invoice.js`
2. **Controllers**: Add business logic in `src/controllers/billingController.js`
3. **Routes**: Define endpoints in `src/routes/billingRoutes.js`
4. **Middleware**: Add custom middleware in `src/middleware/`

## Contributing

This is a project for the Hotelina Hotel Management System.

## License

ISC
