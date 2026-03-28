const express = require('express');
const router = express.Router();
const foodController = require('../controllers/food.controller');

/**
 * @swagger
 * tags:
 *   name: Foods
 *   description: Food menu management
 */

/**
 * @swagger
 * /api/foods:
 *   post:
 *     summary: Create a new food item
 *     tags: [Foods]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Food'
 *     responses:
 *       201:
 *         description: Food created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Food'
 *       400:
 *         description: Bad request
 *
 *   get:
 *     summary: Get all food items
 *     tags: [Foods]
 *     responses:
 *       200:
 *         description: List of foods
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Food'
 */
router.route('/').post(foodController.createFood).get(foodController.getFoods);

/**
 * @swagger
 * /api/foods/{id}:
 *   get:
 *     summary: Get a food item by id
 *     tags: [Foods]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Food id
 *     responses:
 *       200:
 *         description: Food item
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Food'
 *       400:
 *         description: Invalid id
 *       404:
 *         description: Food not found
 *   put:
 *     summary: Update a food item
 *     tags: [Foods]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Food id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Food'
 *     responses:
 *       200:
 *         description: Food updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Food'
 *       400:
 *         description: Bad request
 *       404:
 *         description: Food not found
 *   delete:
 *     summary: Delete a food item
 *     tags: [Foods]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Food id
 *     responses:
 *       200:
 *         description: Food deleted
 *       404:
 *         description: Food not found
 */
router
  .route('/:id')
  .get(foodController.getFoodById)
  .put(foodController.updateFood)
  .delete(foodController.deleteFood);

/**
 * @swagger
 * /api/foods/{id}/status:
 *   patch:
 *     summary: Update availability status of a food item
 *     tags: [Foods]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Food id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               availabilityStatus:
 *                 type: string
 *                 enum: [available, unavailable]
 *     responses:
 *       200:
 *         description: Status updated
 *       400:
 *         description: Bad request
 *       404:
 *         description: Food not found
 */
router.patch('/:id/status', foodController.updateFoodStatus);

/**
 * @swagger
 * /api/foods/category/{category}:
 *   get:
 *     summary: Get foods by category
 *     tags: [Foods]
 *     parameters:
 *       - in: path
 *         name: category
 *         schema:
 *           type: string
 *         required: true
 *         description: Food category
 *     responses:
 *       200:
 *         description: Foods by category
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Food'
 */
router.get('/category/:category', foodController.getFoodsByCategory);

module.exports = router;
