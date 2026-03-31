const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");
const guestRoutes = require("./routes/guestRoutes");
const errorHandler = require("./middleware/errorHandler");
const notFound = require("./middleware/notFound");
<<<<<<< HEAD
const setupSwagger = require("./config/swagger");
=======
const healthCheck = require("./middleware/healthCheck");
const swaggerSpec = require("./config/swagger");
>>>>>>> 63742a2956c5ac92dbe80b3c186c95e1b6fd0589

const app = express();

// ─── Security & Utility Middleware ────────────────────────────────────────────
app.use(helmet({ contentSecurityPolicy: false })); // Disable CSP for Swagger UI
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Swagger Documentation ────────────────────────────────────────────────────
setupSwagger(app);

// ─── Health Check ─────────────────────────────────────────────────────────────
<<<<<<< HEAD
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    service: process.env.SERVICE_NAME || "guest-service",
    status: "healthy",
    version: "1.0.0",
    port: process.env.PORT || 8003,
    timestamp: new Date().toISOString(),
  });
});
=======
app.get("/health", healthCheck);

// ─── Swagger Documentation ────────────────────────────────────────────────────
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
>>>>>>> 63742a2956c5ac92dbe80b3c186c95e1b6fd0589

// ─── API Routes ───────────────────────────────────────────────────────────────
// Mount on BOTH prefixes for flexibility:
//   Direct access:  http://localhost:8003/guests/:id
//   API Gateway:    http://localhost:8000/api/guests/:id
app.use("/guests", guestRoutes);       // Direct access (port 8003)
app.use("/api/guests", guestRoutes);   // API Gateway compatible

// ─── 404 & Error Handling ─────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

module.exports = app;
