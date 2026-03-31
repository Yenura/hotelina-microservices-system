const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");
const guestRoutes = require("./routes/guestRoutes");
const errorHandler = require("./middleware/errorHandler");
const notFound = require("./middleware/notFound");
const healthCheck = require("./middleware/healthCheck");
const swaggerSpec = require("./config/swagger");

const app = express();

// ─── Security & Utility Middleware ────────────────────────────────────────────
app.use(helmet({ contentSecurityPolicy: false })); // Disable CSP for Swagger UI
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Swagger Documentation ────────────────────────────────────────────────────
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get("/health", healthCheck);

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
