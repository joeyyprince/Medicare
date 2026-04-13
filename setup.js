const fs = require('fs');

const logger = `const winston = require('winston');
const path = require('path');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({
      filename: path.join(__dirname, '../logs/error.log'),
      level: 'error'
    }),
    new winston.transports.File({
      filename: path.join(__dirname, '../logs/combined.log')
    }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});

module.exports = logger;`;

fs.writeFileSync('config/logger.js', logger);
console.log('logger.js done!');

const authController = `const User = require('../models/User');
const logger = require('../config/logger');

exports.getRegister = (req, res) => {
  res.render('auth/register', { error: null });
};

exports.postRegister = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      logger.warn('Registration attempt with existing email: ' + email);
      return res.render('auth/register', { error: 'Email already registered' });
    }
    const user = await User.create({ name, email, password, role });
    logger.info('New user registered: ' + email + ' role: ' + role);
    req.session.user = { id: user._id, name: user.name, role: user.role };
    res.redirect('/dashboard');
  } catch (error) {
    logger.error('Registration error: ' + error.message);
    res.render('auth/register', { error: error.message });
  }
};

exports.getLogin = (req, res) => {
  res.render('auth/login', { error: null });
};

exports.postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      logger.warn('Failed login attempt for email: ' + email + ' IP: ' + req.ip);
      return res.render('auth/login', { error: 'Invalid email or password' });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      logger.warn('Failed login attempt for email: ' + email + ' IP: ' + req.ip);
      return res.render('auth/login', { error: 'Invalid email or password' });
    }
    logger.info('Successful login: ' + email + ' IP: ' + req.ip);
    req.session.user = { id: user._id, name: user.name, role: user.role };
    res.redirect('/dashboard');
  } catch (error) {
    logger.error('Login error: ' + error.message);
    res.render('auth/login', { error: error.message });
  }
};

exports.logout = (req, res) => {
  logger.info('User logged out: ' + (req.session.user ? req.session.user.email : 'unknown'));
  req.session.destroy();
  res.redirect('/auth/login');
};`;

fs.writeFileSync('controllers/authController.js', authController);
console.log('authController.js done!');