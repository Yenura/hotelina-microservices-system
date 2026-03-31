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
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        GuestInput: {
          type: 'object',
          required: ['name', 'email'],
          properties: {
            name: {
              type: 'string',
              example: 'John Doe',
              description: 'Full name of the guest',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'john.doe@example.com',
              description: 'Unique email address',
            },
            phone: {
              type: 'string',
              example: '+94771234567',
              description: 'Contact phone number',
            },
            address: {
              type: 'string',
              example: '123 Main Street, Colombo',
              description: 'Residential address',
            },
            nic: {
              type: 'string',
              example: '199012345678',
              description: 'National Identity Card number (unique)',
            },
          },
        },
        Guest: {
          allOf: [
            { $ref: '#/components/schemas/GuestInput' },
            {
              type: 'object',
              properties: {
                _id: {
                  type: 'string',
                  example: '64a7f3c2d4e5f6a7b8c9d0e1',
                },
                status: {
                  type: 'string',
                  enum: ['active', 'inactive', 'blocked'],
                  default: 'active',
                },
                createdAt: {
                  type: 'string',
                  format: 'date-time',
                  example: '2026-03-31T08:00:00.000Z',
                },
                updatedAt: {
                  type: 'string',
                  format: 'date-time',
                  example: '2026-03-31T08:00:00.000Z',
                },
              },
            },
          ],
        },
        GuestResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Guest created successfully' },
            data: { $ref: '#/components/schemas/Guest' },
          },
        },
        GuestListResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            count: { type: 'integer', example: 5 },
            total: { type: 'integer', example: 50 },
            page: { type: 'integer', example: 1 },
            pages: { type: 'integer', example: 5 },
            data: {
              type: 'array',
              items: { $ref: '#/components/schemas/Guest' },
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.js'],
};

module.exports = swaggerJsdoc(options);
