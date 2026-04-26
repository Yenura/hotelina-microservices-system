const healthCheck = (req, res) => {
  res.status(200).json({
    status: 'OK',
    service: 'auth-service',
    port: process.env.PORT || 8001,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
  });
};

module.exports = healthCheck;
