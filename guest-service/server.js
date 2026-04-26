require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/config/db");

const PORT = process.env.PORT || 8003;

// ─── Start Server ─────────────────────────────────────────────────────────────
connectDB()
  .then(() => {
    const server = app.listen(PORT, () => {
      console.log("╔══════════════════════════════════════════════╗");
      console.log("║         🏨  GUEST SERVICE  STARTED           ║");
      console.log("╠══════════════════════════════════════════════╣");
      console.log(`║  ✅  Port     : http://localhost:${PORT}         ║`);
      console.log(`║  🌍  Env      : ${(process.env.NODE_ENV || "development").padEnd(28)}║`);
      console.log(`║  📚  Docs     : http://localhost:${PORT}/api-docs ║`);
      console.log(`║  🔗  Direct   : http://localhost:${PORT}/guests   ║`);
      console.log(`║  🌐  Gateway  : http://localhost:8000/api/guests ║`);
      console.log("╚══════════════════════════════════════════════╝");
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} already in use; is another service instance running?`);
        process.exit(1);
      }
      console.error('Server error:', err);
      process.exit(1);
    });

    // ─── Graceful Shutdown ────────────────────────────────────────────────────
    process.on("SIGTERM", () => {
      console.log("🛑 SIGTERM received — shutting down gracefully...");
      server.close(() => {
        console.log("✅ Server closed.");
        process.exit(0);
      });
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect to database:", err.message);
    process.exit(1);
  });
