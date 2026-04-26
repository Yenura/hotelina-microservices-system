require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 8000;

const server = app.listen(PORT, () => {
  console.log(`✓ API Gateway running on port ${PORT}`);
  console.log(`\n📍 Available Routes:`);
  console.log(`   /api/auth/*          → Auth Service (8001)`);
  console.log(`   /api/reservations/*  → Reservation Service (8002)`);
  console.log(`   /api/guests/*        → Guest Service (8003)`);
  console.log(`   /api/restaurants/*   → Restaurant Service (8004)`);
  console.log(`   /api/billing/*       → Billing Service (8005)\n`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} already in use; is another instance running?`);
    process.exit(1);
  }
  console.error('Server error:', err);
  process.exit(1);
});
