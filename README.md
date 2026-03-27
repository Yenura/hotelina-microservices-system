# Hotelina Microservices System

A microservices-based Hotel Management System built using **Node.js**, **Express.js**, and **MongoDB**, with a centralized **API Gateway**. This project is designed for academic purposes to demonstrate microservices architecture, service separation, authentication, and API documentation.

## Project Overview

This system is developed as a hotel management MVP using a **microservices architecture**. Each core business function is implemented as an independent service, and all services are accessed through a single API Gateway.

## Architecture

- Microservices Architecture
- API Gateway Pattern
- Independent database per service
- RESTful APIs
- JWT-based authentication
- Swagger API documentation

## Technology Stack

- **Frontend:** Postman (for API testing)
- **Backend:** Node.js, Express.js
- **Architecture:** Microservices + API Gateway
- **Database:** MongoDB (separate database per service)
- **Authentication:** JWT + bcrypt
- **Documentation:** Swagger / OpenAPI
- **Version Control:** GitHub

## Microservices

The system contains the following services:

1. **Auth Service**
   - User registration
   - User login
   - JWT token generation
   - Password hashing with bcrypt

2. **Reservation Service**
   - Manage room reservations
   - Create, update, delete, and view bookings

3. **Guest Service**
   - Manage guest details
   - Store customer information

4. **Restaurant Service**
   - Manage food orders and restaurant-related operations

5. **Billing Service**
   - Manage invoices and payment details

6. **API Gateway**
   - Single entry point for all services
   - Routes requests to relevant microservices
   - Simplifies client access

## Suggested Folder Structure

```bash
hotelina-microservices-system/
│
├── api-gateway/
│
├── services/
│   ├── auth-service/
│   ├── reservation-service/
│   ├── guest-service/
│   ├── restaurant-service/
│   └── billing-service/
│
├── shared/
│   ├── config/
│   ├── middleware/
│   └── utils/
│
├── docker-compose.yml
├── package.json
└── README.md
Port Configuration
Service	Port
API Gateway	8000
Auth Service	8001
Reservation Service	8002
Guest Service	8003
Restaurant Service	8004
Billing Service	8005
Database Design
Each microservice uses its own MongoDB database to ensure loose coupling and service independence.

Example:

auth_db

reservation_db

guest_db

restaurant_db

billing_db

Authentication
Authentication is handled using JWT (JSON Web Token). Passwords are securely hashed using bcrypt before storing them in the database.

API Documentation
Swagger is used to document all microservice endpoints. This allows easy testing and better understanding of the available APIs.

Testing
APIs are tested using Postman. Since this project is backend-focused, Postman acts as the client for validating endpoint functionality.

Features
Independent microservices

API Gateway for centralized routing

Separate database for each service

JWT authentication

RESTful API design

Swagger documentation

Scalable and maintainable structure

How to Run the Project
1. Clone the repository
git clone <your-repository-url>
cd hotelina-microservices-system
2. Install dependencies
Install dependencies inside each service and gateway folder.

cd api-gateway
npm install
Repeat for all service folders:

auth-service

reservation-service

guest-service

restaurant-service

billing-service

3. Configure environment variables
Create .env files for each service and add:

Port number

MongoDB connection string

JWT secret (for auth service)

4. Start the services
Run each service separately:

npm run dev
5. Access through API Gateway
Example:

http://localhost:8000/api/auth
http://localhost:8000/api/reservations
http://localhost:8000/api/guests
Academic Purpose
This project is developed for an academic assignment to demonstrate:

Microservices architecture

API Gateway integration

NoSQL database usage with MongoDB

Authentication and security

API documentation using Swagger

Team Contribution
Each team member is responsible for one microservice implementation, testing, and documentation.

Future Improvements
Docker containerization

Service discovery

Load balancing

Centralized logging

Deployment to cloud platforms

License
This project is for educational purposes.


For a better GitHub look, use this repo name:

```md
hotelina-microservices-system
