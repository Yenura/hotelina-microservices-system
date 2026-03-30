const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateRegister, validateLogin, handleValidationErrors } = require('../middleware/validation');
const verifyToken = require('../middleware/authMiddleware');

// Public routes
router.post('/register', validateRegister, handleValidationErrors, authController.register);
router.post('/login', validateLogin, handleValidationErrors, authController.login);
router.get('/verify', verifyToken, authController.verifyToken);

module.exports = router;
