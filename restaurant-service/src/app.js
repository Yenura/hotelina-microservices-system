const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const foodRoutes = require('./routes/food.routes');
const orderRoutes = require('./routes/order.routes');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');
const swaggerSpec = require('./swagger/swagger');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Hotelina Restaurant Service' });
});

app.use('/api/foods', foodRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(notFound);
app.use(errorHandler);

module.exports = app;
