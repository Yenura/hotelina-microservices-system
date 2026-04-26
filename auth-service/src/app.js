const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const authRoutes = require('./routes/authRoutes');
const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');
const healthCheck = require('./middleware/healthCheck');
const swaggerSpec = require('./config/swagger');
const { connectDB } = require('./config/db');

const app = express();

// Database connection
connectDB();

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Default route
app.get('/', (req, res) => {
  res.json({
    message: 'Auth Service - Hotel Management System',
    version: '1.0.0',
    endpoints: {
      register: '/api/auth/register',
      login: '/api/auth/login'
    }
  });
});

// Health check
app.get('/health', healthCheck);

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/auth', authRoutes);

// 404 handler
app.use(notFound);

// Error handler
app.use(errorHandler);

module.exports = app;
