const spec = require('./restaurant-service/src/app');
// Actually app exports express app not swaggerSpec; we need nav.
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerDefinition = {
  openapi: '3.0.0',
  info: { title: 'Restaurant Service API', version: '1.0.0', description: 'API documentation for the Hotelina Restaurant Service', },
  servers: [ { url: 'http://localhost:8004', description: 'Local Service' }, { url: 'http://localhost:8000/api/restaurants', description: 'Via API Gateway' } ],
};
const swaggerOptions = { definition: swaggerDefinition, apis: ['./restaurant-service/src/routes/*.js', './restaurant-service/src/controllers/*.js'] };
const swaggerSpec = swaggerJsdoc(swaggerOptions);
console.log('paths:', Object.keys(swaggerSpec.paths));
console.log('first path', Object.keys(swaggerSpec.paths)[0]);
