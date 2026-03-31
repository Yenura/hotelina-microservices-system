const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Guest Service API',
      version: '1.0.0',
      description: 'Guest management service for Hotelina Hotel Management System',
    },
    servers: [
      { url: 'http://localhost:8003', description: 'Development Server (Direct)' },
      { url: 'http://localhost:8000/api/guests', description: 'Via API Gateway' },
    ],
  },
  apis: ['./src/routes/*.js'],
};

module.exports = swaggerJsdoc(options);
