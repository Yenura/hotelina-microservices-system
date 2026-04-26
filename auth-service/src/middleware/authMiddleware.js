const jwt = require('jsonwebtoken');

const User = require('../models/User');

const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No token provided. Please login first.',
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      console.error('JWT verify failed', err);
      return res.status(401).json({
        success: false,
        message: 'Token is invalid or expired',
      });
    }

    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    req.userId = user._id.toString();
    req.user = user;
    next();
  });
};

module.exports = verifyToken;
