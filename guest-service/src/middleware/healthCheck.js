const healthCheck = (req, res) => {
  res.status(200).json({
    status: 'OK',
    service: 'guest-service',
    port: process.env.PORT || 8003,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
  });
};

module.exports = healthCheck;
