const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { loginLimiter } = require('../middleware/rateLimiter');
const { registerValidation, loginValidation, validateRequest } = require('../middleware/validation');

router.get('/register', authController.getRegister);
router.post('/register', registerValidation, validateRequest, authController.postRegister);
router.get('/login', authController.getLogin);
router.post('/login', loginLimiter, loginValidation, validateRequest, authController.postLogin);
router.get('/logout', authController.logout);

module.exports = router;