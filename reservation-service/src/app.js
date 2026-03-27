const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const reservationRoutes = require('./routes/reservationRoutes');
const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');

const app = express();

// ─── Security & Utility Middleware ────────────────────────────────────────────
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    service: process.env.SERVICE_NAME || 'reservation-service',
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
});


// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/reservations', reservationRoutes);

// ─── Error Handling ───────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

module.exports = app;
