const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Gateway - Hotelina Microservices',
      version: '1.0.0',
      description: 'Gateway for Auth, Reservation, Guest, Restaurant, and Billing services',
      contact: {
        name: 'Hotelina Team'
      }
    },
    servers: [
      {
        url: 'http://localhost:8000',
        description: 'API Gateway'
      }
    ]
  },
  apis: ['./src/routes/*.js']
};

module.exports = swaggerJsdoc(options);
