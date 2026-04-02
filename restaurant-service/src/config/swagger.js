const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Restaurant Service API',
      version: '1.0.0',
      description: 'Restaurant service for Hotelina Hotel Management System',
      contact: {
        name: 'Hotelina Team'
      }
    },
    servers: [
      { url: 'http://localhost:8004', description: 'Development Server (Direct)' },
      { url: 'http://localhost:8000/api/restaurants', description: 'Development Server (Via API Gateway)' }
    ]
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js']
};

module.exports = swaggerJsdoc(options);
