const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { loginLimiter } = require('../middleware/rateLimiter');
const { registerValidation, loginValidation, validateRequest } = require('../middleware/validation');
const csrf = require('csurf');

const csrfProtection = csrf({ cookie: true });

router.get('/register', csrfProtection, authController.getRegister);
router.post('/register', csrfProtection, registerValidation, validateRequest, authController.postRegister);
router.get('/login', csrfProtection, authController.getLogin);
router.post('/login', csrfProtection, loginLimiter, loginValidation, validateRequest, authController.postLogin);
router.get('/logout', authController.logout);

module.exports = router;