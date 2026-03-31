const jwt = require("jsonwebtoken");

/**
 * JWT Authentication Middleware
 * Protects routes by verifying the Bearer token in the Authorization header.
 * Usage: router.post("/", protect, controller.createGuest)
 */
const protect = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your_default_secret"
    );

    req.user = decoded; // attach decoded payload to request
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired. Please log in again.",
      });
    }
    return res.status(401).json({
      success: false,
      message: "Invalid token.",
    });
  }
};

module.exports = protect;
