const healthCheck = (req, res) => {
  res.status(200).json({
    status: 'OK',
    service: 'reservation-service',
    port: process.env.PORT || 8002,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
  });
};

module.exports = healthCheck;
