const User = require('../models/User');
const logger = require('../config/logger');

exports.getRegister = (req, res) => {
 res.render('auth/register', { csrfToken: req.csrfToken(), error: null, errors: [] });
};

exports.postRegister = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      logger.warn('Registration attempt with existing email: ' + email);
      return res.render('auth/register', { csrfToken: req.csrfToken(), error: 'Email already registered', errors: [] });
    }
    const user = await User.create({ name, email, password, role });
    logger.info('New user registered: ' + email + ' role: ' + role);
    req.session.user = { id: user._id, name: user.name, role: user.role };
    res.redirect('/dashboard');
  } catch (error) {
    logger.error('Registration error: ' + error.message);
    res.render('auth/register', { csrfToken: req.csrfToken(), error: error.message, errors: [] });
  }
};

exports.getLogin = (req, res) => {
  res.render('auth/login', { csrfToken: req.csrfToken(), error: null });
};

exports.postLogin = async (req, res) => {
  console.log('Login attempt:', req.body);
  try {
    const { email, password } = req.body;
    console.log('Email:', email, 'Password length:', password?.length);
    const user = await User.findOne({ email });
    if (!user) {
      logger.warn('Failed login attempt for email: ' + email + ' IP: ' + req.ip);
      return res.render('auth/login', { csrfToken: req.csrfToken(), error: 'Invalid email or password' });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      logger.warn('Failed login attempt for email: ' + email + ' IP: ' + req.ip);
      return res.render('auth/login', { csrfToken: req.csrfToken(), error: 'Invalid email or password' });
    }
    logger.info('Successful login: ' + email + ' IP: ' + req.ip);
    req.session.user = { id: user._id, name: user.name, role: user.role };
    res.redirect('/dashboard');
  } catch (error) {
    logger.error('Login error: ' + error.message);
    res.render('auth/login', { csrfToken: req.csrfToken(), error: error.message });
  }
};

exports.logout = (req, res) => {
  logger.info('User logged out: ' + (req.session.user ? req.session.user.email : 'unknown'));
  req.session.destroy();
  res.redirect('/auth/login');
};