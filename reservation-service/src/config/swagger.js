const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Reservation Service API',
      version: '1.0.0',
      description: 'Reservation management service for Hotelina Hotel Management System',
    },
    servers: [
      { url: 'http://localhost:8002', description: 'Development Server (Direct)' },
      { url: 'http://localhost:8000/api/reservations', description: 'Via API Gateway' },
    ],
  },
  apis: ['./src/routes/*.js'],
};

module.exports = swaggerJsdoc(options);
