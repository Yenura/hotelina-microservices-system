const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  // Handle Mongoose duplicate key error
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: `${Object.keys(err.keyValue)[0]} already exists`
    });
  }

  // Handle Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors)
      .map(e => e.message)
      .join(', ');
    return res.status(400).json({
      success: false,
      message: messages
    });
  }

  res.status(status).json({
    success: false,
    message,
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
};

module.exports = errorHandler;
