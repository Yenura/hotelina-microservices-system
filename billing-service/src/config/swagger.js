const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Billing Service API',
      version: '1.0.0',
      description: 'Billing and invoice management service for Hotelina Hotel Management System',
    },
    servers: [
      { url: 'http://localhost:8005', description: 'Development Server (Direct)' },
      { url: 'http://localhost:8000/api/billing', description: 'Via API Gateway' },
    ],
  },
  apis: ['./src/routes/*.js'],
};

module.exports = swaggerJsdoc(options);
