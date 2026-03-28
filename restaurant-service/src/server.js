const dotenv = require('dotenv');
dotenv.config();

const connectDB = require('./config/db');
const app = require('./app');

const PORT = process.env.PORT || 8004;

const MAX_PORT_ATTEMPTS = 10;

const listen = (port) =>
  new Promise((resolve, reject) => {
    const server = app.listen(port, () => resolve({ server, port }));
    server.on('error', reject);
  });

connectDB()
  .then(async () => {
    let currentPort = PORT;
    let result = null;

    for (let attempt = 0; attempt < MAX_PORT_ATTEMPTS; attempt += 1) {
      try {
        result = await listen(currentPort);
        break;
      } catch (error) {
        if (error.code === 'EADDRINUSE') {
          console.warn(`Port ${currentPort} is already in use, trying ${currentPort + 1}...`);
          currentPort += 1;
          continue;
        }
        throw error;
      }
    }

    if (!result) {
      console.error(`Unable to bind to a port starting at ${PORT}. Please set PORT in .env or free one of the ports.`);
      process.exit(1);
    }

    const { server, port } = result;
    console.log(`✅ Restaurant Service running on port ${port}`);
    console.log(`📄 Swagger docs: http://localhost:${port}/api-docs`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV}`);

    server.on('error', (error) => {
      console.error('Server error:', error);
      process.exit(1);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB', error);
    process.exit(1);
  });
