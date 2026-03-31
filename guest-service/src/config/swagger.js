<<<<<<< HEAD
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Guest Service API",
      version: "1.0.0",
      description:
        "Microservice API for managing hotel guests/customers. Part of the Hotelina Hotel Management System.",
      contact: {
        name: "Hotelina Team",
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 8003}`,
        description: "Local Development Server",
      },
      {
        url: "http://localhost:8000",
        description: "API Gateway",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        GuestInput: {
          type: "object",
          required: ["name", "email"],
          properties: {
            name: {
              type: "string",
              example: "John Doe",
              description: "Full name of the guest",
            },
            email: {
              type: "string",
              format: "email",
              example: "john.doe@example.com",
              description: "Unique email address",
            },
            phone: {
              type: "string",
              example: "+94771234567",
              description: "Contact phone number",
            },
            address: {
              type: "string",
              example: "123 Main Street, Colombo",
              description: "Residential address",
            },
            nic: {
              type: "string",
              example: "199012345678",
              description: "National Identity Card number (unique)",
            },
            status: {
              type: "string",
              enum: ["active", "inactive", "blocked"],
              default: "active",
              description: "Guest account status",
            },
          },
        },
        Guest: {
          allOf: [
            { $ref: "#/components/schemas/GuestInput" },
            {
              type: "object",
              properties: {
                _id: {
                  type: "string",
                  example: "64a7f3c2d4e5f6a7b8c9d0e1",
                },
                createdAt: {
                  type: "string",
                  format: "date-time",
                  example: "2026-03-31T08:00:00.000Z",
                },
                updatedAt: {
                  type: "string",
                  format: "date-time",
                  example: "2026-03-31T08:00:00.000Z",
                },
              },
            },
          ],
        },
        GuestResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string", example: "Guest created successfully" },
            data: { $ref: "#/components/schemas/Guest" },
          },
        },
        GuestListResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            count: { type: "integer", example: 5 },
            total: { type: "integer", example: 50 },
            page: { type: "integer", example: 1 },
            pages: { type: "integer", example: 5 },
            data: {
              type: "array",
              items: { $ref: "#/components/schemas/Guest" },
            },
          },
        },
      },
    },
  },
  // Path to files containing Swagger JSDoc annotations
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

/**
 * Sets up Swagger UI on /api-docs
 * @param {import('express').Application} app
 */
const setupSwagger = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customSiteTitle: "Guest Service API Docs",
    swaggerOptions: {
      persistAuthorization: true,
    },
  }));

  // Raw JSON spec endpoint
  app.get("/api-docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });

  console.log(`📚 Swagger UI: http://localhost:${process.env.PORT || 8003}/api-docs`);
};

module.exports = setupSwagger;
=======
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
>>>>>>> 63742a2956c5ac92dbe80b3c186c95e1b6fd0589
