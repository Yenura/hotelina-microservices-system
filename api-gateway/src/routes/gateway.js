const express = require('express');
const axios = require('axios');
const router = express.Router();

// Service URLs
const services = {
  auth: process.env.AUTH_SERVICE_URL || 'http://localhost:8001',
  reservations: process.env.RESERVATION_SERVICE_URL || 'http://localhost:8002',
  guests: process.env.GUEST_SERVICE_URL || 'http://localhost:8003',
  restaurants: process.env.RESTAURANT_SERVICE_URL || 'http://localhost:8004',
  billing: process.env.BILLING_SERVICE_URL || 'http://localhost:8005'
};

// Helper function to forward requests to services
const forwardRequest = async (req, res, serviceUrl, servicePath) => {
  try {
    const fullUrl = `${serviceUrl}${servicePath}`;

    const response = await axios({
      method: req.method,
      url: fullUrl,
      data: req.method !== 'GET' ? req.body : undefined,
      headers: {
        ...req.headers,
        'content-type': 'application/json',
        'Authorization': req.headers.authorization
      }
    });

    res.status(response.status).json(response.data);
  } catch (error) {
    console.error(`Error forwarding to ${serviceUrl}:`, error.message);

    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else if (error.code === 'ECONNREFUSED') {
      res.status(503).json({
        success: false,
        message: 'Service unavailable',
        error: error.message
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Gateway error',
        error: error.message
      });
    }
  }
};

// Auth Service Routes
router.all('/auth/*', (req, res) => {
  const path = req.path.replace('/auth', '');
  forwardRequest(req, res, services.auth, `/api/auth${path}`);
});

// Reservation Service Routes
router.all('/reservations/*', (req, res) => {
  const path = req.path.replace('/reservations', '');
  forwardRequest(req, res, services.reservations, `/api/reservations${path}`);
});

// Guest Service Routes
router.all('/guests/*', (req, res) => {
  const path = req.path.replace('/guests', '');
  forwardRequest(req, res, services.guests, `/api/guests${path}`);
});

// Restaurant Service Routes
router.all('/restaurants/*', (req, res) => {
  const path = req.path.replace('/restaurants', '');
  forwardRequest(req, res, services.restaurants, `/api/restaurants${path}`);
});

// Billing Service Routes
router.all('/billing/*', (req, res) => {
  const path = req.path.replace('/billing', '');
  forwardRequest(req, res, services.billing, `/api/billing${path}`);
});

module.exports = router;
