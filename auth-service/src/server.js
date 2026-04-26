require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 8001;

const server = app.listen(PORT, () => {
  console.log(`✓ Auth Service running on port ${PORT}`);
  console.log(`📄 Swagger docs: http://localhost:${PORT}/api-docs`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use. Another instance may be running.`);
    process.exit(1);
  }
  console.error('Server error:', err);
  process.exit(1);
});
