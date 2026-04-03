const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const billingRoutes = require('./routes/billingRoutes');
const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');

const app = express();

// ─── Swagger Configuration ────────────────────────────────────────────────────
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Hotelina Billing Service API',
      version: '1.0.0',
      description: 'API documentation for the Billing/Payment Microservice',
      contact: {
        name: 'Hotelina Team',
      },
    },
    servers: [
      {
        url: 'http://localhost:8005',
        description: 'Development Server',
      },
      {
        url: 'https://api.hotelina.com',
        description: 'Production Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// ─── Security & Utility Middleware ────────────────────────────────────────────
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Serve Frontend Static Files ──────────────────────────────────────────────
app.use(express.static(path.join(__dirname, '../../billing-frontend')));

// ─── Swagger Documentation ────────────────────────────────────────────────────
app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', swaggerUi.setup(swaggerSpec, {
  swaggerOptions: {
    persistAuthorization: true,
  },
}));

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    service: process.env.SERVICE_NAME || 'billing-service',
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/billing', billingRoutes);

// ─── Serve Frontend on Root ──────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../billing-frontend/index.html'));
});

// ─── Fallback to Frontend for SPA Routes ──────────────────────────────────────
app.get('/pages/:page', (req, res) => {
  res.sendFile(path.join(__dirname, `../../billing-frontend/pages/${req.params.page}.html`));
});

// ─── Error Handling ───────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

module.exports = app;
