const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided. Please login first.',
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = decoded.id;
      next();
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: 'Token is invalid or expired',
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Authentication error',
    });
  }
};

module.exports = verifyToken;
