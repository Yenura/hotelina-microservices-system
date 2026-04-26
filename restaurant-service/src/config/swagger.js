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
    ],
    components: {
      schemas: {
        Food: {
          type: 'object',
          required: ['name', 'category', 'price', 'preparationTimeMinutes'],
          properties: {
            _id: {
              type: 'string',
              description: 'Food item ID (MongoDB ObjectId)'
            },
            name: {
              type: 'string',
              description: 'Name of the food item'
            },
            category: {
              type: 'string',
              description: 'Category of the food item'
            },
            description: {
              type: 'string',
              description: 'Detailed description of the food item'
            },
            price: {
              type: 'number',
              minimum: 0,
              description: 'Price of the food item'
            },
            availabilityStatus: {
              type: 'string',
              enum: ['available', 'unavailable'],
              default: 'available',
              description: 'Availability status of the food item'
            },
            imageUrl: {
              type: 'string',
              description: 'URL of the food item image'
            },
            preparationTimeMinutes: {
              type: 'number',
              minimum: 0,
              description: 'Preparation time in minutes'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when the food item was created'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when the food item was last updated'
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js']
};

module.exports = swaggerJsdoc(options);
