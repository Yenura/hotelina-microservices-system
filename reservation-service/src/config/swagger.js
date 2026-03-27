const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Hotelina Reservation Service API',
      version: '1.0.0',
      description:
        'REST API for managing hotel room reservations. Part of the Hotelina microservices system.',
      contact: {
        name: 'Hotelina Team',
      },
    },
    servers: [
      {
        url: 'http://localhost:8002',
        description: 'Local development server',
      },
      {
        url: 'http://api-gateway/reservations',
        description: 'Via API Gateway',
      },
    ],
    tags: [
      {
        name: 'Reservations',
        description: 'Reservation CRUD operations',
      },
      {
        name: 'Health',
        description: 'Service health check',
      },
    ],
  },
  apis: ['./src/routes/*.js', './src/models/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
