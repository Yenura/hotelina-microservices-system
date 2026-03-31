# Auth Service

Authentication microservice for the Hotelina Hotel Management System. Handles user registration, login, and JWT token generation.

## Features

- User registration with email validation
- User login with password verification
- JWT token generation and verification
- Password hashing with bcryptjs
- MongoDB database integration
- CORS enabled

## Port

- **Service Port:** 8001

## Environment Variables

Create a `.env` file in the root directory:

```
PORT=8001
MONGODB_URI=mongodb://localhost:27017/auth_db
JWT_SECRET=your_jwt_secret_key_here_change_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

## Installation

```bash
npm install
```

## Running the Service

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

## API Endpoints

### Register
- **URL:** `/api/auth/register`
- **Method:** `POST`
- **Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Login
- **URL:** `/api/auth/login`
- **Method:** `POST`
- **Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Response
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

## Default Route

Access the service at: `http://localhost:8001`

## Database

- Database: MongoDB
- Database Name: `auth_db`
- Collections: `users`

## Authentication

JWT tokens are issued upon successful login and should be included in subsequent API requests:

```
Authorization: Bearer <token>
```

## Error Handling

The service includes error handling middleware for:
- Invalid input validation
- Duplicate email addresses
- Incorrect credentials
- Missing authentication tokens
- Server errors
