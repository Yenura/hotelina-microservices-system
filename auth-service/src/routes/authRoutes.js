const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateRegister, validateLogin, handleValidationErrors } = require('../middleware/validation');
const verifyToken = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 *
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered
 *       400:
 *         description: Validation error
 *
 * /api/auth/login:
 *   post:
 *     summary: User login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Auth token
 *       401:
 *         description: Invalid credentials
 *
 * /api/auth/verify:
 *   get:
 *     summary: Verify JWT token
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Token valid
 *       401:
 *         description: Token invalid
 */

// Public routes
router.post('/register', validateRegister, handleValidationErrors, authController.register);
router.post('/login', validateLogin, handleValidationErrors, authController.login);
router.get('/verify', verifyToken, authController.verifyToken);

module.exports = router;
