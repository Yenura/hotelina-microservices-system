const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const billingRoutes = require('./routes/billingRoutes');
const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');
const healthCheck = require('./middleware/healthCheck');
const swaggerSpec = require('./config/swagger');

const app = express();

// ─── Security & Utility Middleware ────────────────────────────────────────────
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/health', healthCheck);

// ─── Swagger Documentation ────────────────────────────────────────────────────
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/billing', billingRoutes);

// ─── Error Handling ───────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

module.exports = app;
