const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const foodRoutes = require('./routes/food.routes');
const orderRoutes = require('./routes/order.routes');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');
const healthCheck = require('./middleware/healthCheck');
const swaggerSpec = require('./config/swagger');

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Hotelina Restaurant Service' });
});

app.get('/health', healthCheck);

app.use('/api/foods', foodRoutes);
app.use('/api/orders', orderRoutes);
// Gateway and docs use /api/restaurants prefix; keep backward compatibility with legacy /api/foods, /api/orders
app.use('/api/restaurants/food', foodRoutes);
app.use('/api/restaurants/orders', orderRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Raw swagger spec endpoint
app.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

app.use(notFound);
app.use(errorHandler);

module.exports = app;
