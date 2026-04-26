const mongoose = require('mongoose');
const Food = require('../models/food.model');

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

exports.createFood = async (req, res, next) => {
  try {
    const {
      name,
      category,
      description,
      price,
      availabilityStatus,
      imageUrl,
      preparationTimeMinutes,
    } = req.body;

    if (!name || !category || price === undefined || preparationTimeMinutes === undefined) {
      res.status(400);
      throw new Error('name, category, price and preparationTimeMinutes are required');
    }

    const newFood = new Food({
      name,
      category,
      description,
      price,
      availabilityStatus,
      imageUrl,
      preparationTimeMinutes,
    });

    const savedFood = await newFood.save();
    res.status(201).json(savedFood);
  } catch (error) {
    next(error);
  }
};

exports.getFoods = async (req, res, next) => {
  try {
    const foods = await Food.find();
    res.json(foods);
  } catch (error) {
    next(error);
  }
};

exports.getFoodById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      res.status(400);
      throw new Error('Invalid food id');
    }

    const food = await Food.findById(id);
    if (!food) {
      res.status(404);
      throw new Error('Food item not found');
    }

    res.json(food);
  } catch (error) {
    next(error);
  }
};

exports.updateFood = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      res.status(400);
      throw new Error('Invalid food id');
    }

    const food = await Food.findById(id);
    if (!food) {
      res.status(404);
      throw new Error('Food item not found');
    }

    const updates = req.body;
    const allowedFields = [
      'name',
      'category',
      'description',
      'price',
      'availabilityStatus',
      'imageUrl',
      'preparationTimeMinutes',
    ];

    allowedFields.forEach((field) => {
      if (Object.prototype.hasOwnProperty.call(updates, field)) {
        food[field] = updates[field];
      }
    });

    const updatedFood = await food.save();
    res.json(updatedFood);
  } catch (error) {
    next(error);
  }
};

exports.deleteFood = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      res.status(400);
      throw new Error('Invalid food id');
    }

    const food = await Food.findById(id);
    if (!food) {
      res.status(404);
      throw new Error('Food item not found');
    }

    await food.deleteOne();
    res.json({ message: 'Food item deleted successfully' });
  } catch (error) {
    next(error);
  }
};

exports.updateFoodStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { availabilityStatus } = req.body;

    if (!isValidObjectId(id)) {
      res.status(400);
      throw new Error('Invalid food id');
    }
    if (!availabilityStatus || !['available', 'unavailable'].includes(availabilityStatus)) {
      res.status(400);
      throw new Error('availabilityStatus must be either available or unavailable');
    }

    const food = await Food.findById(id);
    if (!food) {
      res.status(404);
      throw new Error('Food item not found');
    }

    food.availabilityStatus = availabilityStatus;
    const updatedFood = await food.save();
    res.json(updatedFood);
  } catch (error) {
    next(error);
  }
};

exports.getFoodsByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    const foods = await Food.find({ category });
    res.json(foods);
  } catch (error) {
    next(error);
  }
};
