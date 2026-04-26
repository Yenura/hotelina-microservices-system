const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const gatewayRoutes = require('./routes/gateway');
const errorHandler = require('./middleware/errorHandler');
const { gatewayLimiter } = require('./middleware/rateLimit');

const app = express();

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use('/api/', gatewayLimiter);

// Default route
app.get('/', (req, res) => {
  res.json({
    message: 'Hotelina Hotel Management System - API Gateway',
    version: '1.0.0',
    status: 'Running',
    endpoints: {
      auth: '/api/auth',
      reservations: '/api/reservations',
      guests: '/api/guests',
      restaurants: '/api/restaurants',
      billing: '/api/billing'
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

// Swagger docs for API Gateway
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Gateway routes
app.use('/api', gatewayRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Error handler
app.use(errorHandler);

module.exports = app;
