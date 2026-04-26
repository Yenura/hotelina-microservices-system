const mongoose = require('mongoose');
const Order = require('../models/order.model');
const Food = require('../models/food.model');

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const validateItems = (items) => {
  if (!Array.isArray(items) || items.length === 0) {
    const error = new Error('Order items are required and must contain at least one item');
    error.status = 400;
    throw error;
  }

  items.forEach((item) => {
    if (!item.foodId || item.quantity === undefined) {
      const error = new Error('Each item must contain foodId and quantity');
      error.status = 400;
      throw error;
    }
    if (!isValidObjectId(item.foodId)) {
      const error = new Error('Invalid foodId in order items');
      error.status = 400;
      throw error;
    }
    if (typeof item.quantity !== 'number' || item.quantity < 1) {
      const error = new Error('Quantity must be a number greater than 0');
      error.status = 400;
      throw error;
    }
  });
};

const calculateTotalAmount = async (items) => {
  validateItems(items);

  const foodIds = items.map((item) => item.foodId);
  const uniqueFoodIds = [...new Set(foodIds.map((id) => id.toString()))];
  const foods = await Food.find({ _id: { $in: uniqueFoodIds } });

  if (foods.length !== uniqueFoodIds.length) {
    const error = new Error('One or more food items were not found');
    error.status = 404;
    throw error;
  }

  const foodMap = new Map();
  foods.forEach((food) => foodMap.set(food._id.toString(), food));

  let total = 0;
  const unavailableItems = [];

  items.forEach((item) => {
    const food = foodMap.get(item.foodId.toString());

    if (!food) {
      return;
    }

    if (food.availabilityStatus !== 'available') {
      unavailableItems.push(food.name || item.foodId);
    }

    total += food.price * item.quantity;
  });

  if (unavailableItems.length) {
    const error = new Error(`Unavailable food item(s): ${unavailableItems.join(', ')}`);
    error.status = 400;
    throw error;
  }

  return total;
};

exports.createOrder = async (req, res, next) => {
  try {
    const { guestName, roomNumber, items, notes, orderedAt } = req.body;

    if (!guestName || !roomNumber || !items) {
      res.status(400);
      throw new Error('guestName, roomNumber, and items are required');
    }

    const totalAmount = await calculateTotalAmount(items);

    const newOrder = new Order({
      guestName,
      roomNumber,
      items,
      totalAmount,
      notes,
      orderedAt,
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    next(error);
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().populate('items.foodId', 'name category price availabilityStatus');
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

exports.getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      res.status(400);
      throw new Error('Invalid order id');
    }

    const order = await Order.findById(id).populate('items.foodId', 'name category price availabilityStatus');
    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    res.json(order);
  } catch (error) {
    next(error);
  }
};

exports.updateOrder = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      res.status(400);
      throw new Error('Invalid order id');
    }

    const order = await Order.findById(id);
    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    const { guestName, roomNumber, items, orderStatus, notes, orderedAt } = req.body;

    if (guestName !== undefined) order.guestName = guestName;
    if (roomNumber !== undefined) order.roomNumber = roomNumber;
    if (notes !== undefined) order.notes = notes;
    if (orderedAt !== undefined) order.orderedAt = orderedAt;
    if (items !== undefined) {
      order.items = items;
      order.totalAmount = await calculateTotalAmount(items);
    }
    if (orderStatus !== undefined) {
      if (!['pending', 'preparing', 'delivered', 'cancelled'].includes(orderStatus)) {
        res.status(400);
        throw new Error('Invalid orderStatus value');
      }
      order.orderStatus = orderStatus;
      order.deliveredAt = orderStatus === 'delivered' ? new Date() : undefined;
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    next(error);
  }
};

exports.deleteOrder = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      res.status(400);
      throw new Error('Invalid order id');
    }

    const order = await Order.findById(id);
    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    await order.deleteOne();
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    next(error);
  }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;

    if (!isValidObjectId(id)) {
      res.status(400);
      throw new Error('Invalid order id');
    }
    if (!orderStatus || !['pending', 'preparing', 'delivered', 'cancelled'].includes(orderStatus)) {
      res.status(400);
      throw new Error('orderStatus must be one of pending, preparing, delivered, cancelled');
    }

    const order = await Order.findById(id);
    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    order.orderStatus = orderStatus;
    order.deliveredAt = orderStatus === 'delivered' ? new Date() : undefined;

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    next(error);
  }
};

exports.getOrdersByRoom = async (req, res, next) => {
  try {
    const { roomNumber } = req.params;
    const orders = await Order.find({ roomNumber }).populate('items.foodId', 'name category price availabilityStatus');
    res.json(orders);
  } catch (error) {
    next(error);
  }
};
