# Guest Service

A microservice responsible for managing guest details and customer information for the Hotelina Hotel Management System.

## Overview

The Guest Service handles all operations related to guest/customer management in the hotel system. It provides simple CRUD operations to manage guest profiles, contact information, and identification details.

## Features

- ✅ Create new guests
- ✅ View all guests
- ✅ View guest by ID
- ✅ Update guest information
- ✅ Delete guest records

## Technology Stack

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Helmet** - Security middleware
- **CORS** - Cross-Origin Resource Sharing
- **Morgan** - HTTP request logger

## Installation

1. Install dependencies:

   ```bash
   npm install
   ```

2. Configure environment variables:

   ```bash
   cp .env.example .env
   ```

3. Update `.env` with your MongoDB connection string (if different from default):
   ```
   PORT=8003
   MONGODB_URI=mongodb://127.0.0.1:27017/guest_db
   NODE_ENV=development
   SERVICE_NAME=guest-service
   ```

## Running the Service

### Development Mode (with auto-reload)

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

The service will be available at `http://localhost:8003`

## API Endpoints

### Base URL

```
http://localhost:8003/api/guests
```

### Endpoints

#### 1. Create Guest

- **Method:** `POST`
- **Path:** `/api/guests`
- **Body:**

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phone": "+1234567890",
  "address": "123 Main St",
  "city": "New York",
  "country": "USA",
  "identityType": "passport",
  "identityNumber": "P123456789",
  "status": "active"
}
```

- **Response:** `201 Created`

#### 2. Get All Guests

- **Method:** `GET`
- **Path:** `/api/guests`
- **Response:** `200 OK` with array of guests

#### 3. Get Guest by ID

- **Method:** `GET`
- **Path:** `/api/guests/:id`
- **Response:** `200 OK` with guest object

#### 4. Update Guest

- **Method:** `PUT`
- **Path:** `/api/guests/:id`
- **Body:** Any guest fields to update
- **Response:** `200 OK` with updated guest object

#### 5. Delete Guest

- **Method:** `DELETE`
- **Path:** `/api/guests/:id`
- **Response:** `200 OK` with deleted guest object

## Health Check

```bash
GET http://localhost:8003/health
```

Response:

```json
{
  "success": true,
  "service": "guest-service",
  "status": "healthy",
  "timestamp": "2026-03-29T10:00:00.000Z"
}
```

## Database Schema

### Guest Model

```javascript
{
  firstName: String (required),
  lastName: String (required),
  email: String (required, unique),
  phone: String (required),
  address: String,
  city: String,
  country: String,
  identityType: String (enum: ['passport', 'national_id', 'drivers_license', 'other']),
  identityNumber: String (required),
  status: String (enum: ['active', 'inactive', 'blocked'], default: 'active'),
  createdAt: Date (automatic),
  updatedAt: Date (automatic)
}
```

## Error Handling

The service includes comprehensive error handling for:

- Validation errors (400)
- Not found errors (404)
- Duplicate entries (409)
- Server errors (500)

## Port Configuration

- **Guest Service:** Port `8003`

## Environment Variables

| Variable     | Description               | Default                            |
| ------------ | ------------------------- | ---------------------------------- |
| PORT         | Service port              | 8003                               |
| MONGODB_URI  | MongoDB connection string | mongodb://127.0.0.1:27017/guest_db |
| NODE_ENV     | Environment mode          | development                        |
| SERVICE_NAME | Service identifier        | guest-service                      |

## Integration with API Gateway

The Guest Service is designed to be accessed through the API Gateway at:

```
http://localhost:8000/api/guests
```

## Development Notes

- No authentication required for this service (as per requirements)
- All CRUD operations use MongoDB ObjectId
- Email and identity number must be unique
- Timestamps are automatically managed

## Future Enhancements

- Add advanced filtering and pagination
- Implement guest search functionality
- Add guest activity tracking
- Integration with reservation service
- Guest loyalty program features

## License

ISC
