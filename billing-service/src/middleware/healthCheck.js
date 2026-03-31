const healthCheck = (req, res) => {
  res.status(200).json({
    status: 'OK',
    service: 'billing-service',
    port: process.env.PORT || 8005,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
  });
};

module.exports = healthCheck;
