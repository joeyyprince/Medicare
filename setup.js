const fs = require('fs');

const authRoutes = `const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { loginLimiter } = require('../middleware/rateLimiter');
const { registerValidation, loginValidation, validateRequest } = require('../middleware/validation');

router.get('/register', authController.getRegister);
router.post('/register', registerValidation, validateRequest, authController.postRegister);
router.get('/login', authController.getLogin);
router.post('/login', loginLimiter, loginValidation, validateRequest, authController.postLogin);
router.get('/logout', authController.logout);

module.exports = router;`;

fs.writeFileSync('routes/authRoutes.js', authRoutes);
console.log('authRoutes.js done!');

const appCode = `const express = require('express');
const session = require('express-session');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const patientRoutes = require('./routes/patientRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const { isLoggedIn } = require('./middleware/authMiddleware');
const { generalLimiter } = require('./middleware/rateLimiter');
const { mongoSanitize } = require('./middleware/sanitize');

const app = express();

connectDB();

// Security headers
app.use(helmet({
  contentSecurityPolicy: false
}));

// General rate limiter
app.use(generalLimiter);

// Logging
app.use(morgan('dev'));

// Body parsing
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// NoSQL injection prevention
app.use(mongoSanitize);

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Secure session
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,
    maxAge: 1000 * 60 * 60,
    sameSite: 'strict'
  }
}));

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// Routes
app.use('/auth', authRoutes);
app.use('/admin/patients', patientRoutes);
app.use('/patient', patientRoutes);
app.use('/doctor', doctorRoutes);
app.use('/appointments', appointmentRoutes);
app.use('/admin/appointments', appointmentRoutes);

app.get('/', (req, res) => {
  if (req.session.user) return res.redirect('/dashboard');
  res.redirect('/auth/login');
});

app.get('/dashboard', isLoggedIn, (req, res) => {
  res.render('dashboard');
});

// Custom 404 - never expose stack traces
app.use((req, res) => {
  res.status(404).render('error', { message: 'Page not found' });
});

// Custom 500 - never expose stack traces
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', { message: 'Something went wrong. Please try again.' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Server running on http://localhost:' + PORT);
});`;

fs.writeFileSync('app.js', appCode);
console.log('app.js done!');