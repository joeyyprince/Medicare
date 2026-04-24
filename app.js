const cookieParser = require('cookie-parser');
const express = require('express');
const session = require('express-session');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const csrf = require('csurf');
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

// app.use(helmet({ contentSecurityPolicy: false }));
app.use(generalLimiter);
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// app.use(mongoSanitize({ replaceWith: '_' }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,
    maxAge: 1000 * 60 * 60,
    sameSite: 'lax'
  }
}));

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// CSRF protection
app.use((req, res, next) => {
  if (req.csrfToken) {
    res.locals.csrfToken = req.csrfToken();
  } else {
    res.locals.csrfToken = '';
  }
  next();
});


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

app.use((req, res) => {
  res.status(404).render('error', { message: 'Page not found' });
});

app.use((err, req, res, next) => {
  if (err.code === 'EBADCSRFTOKEN') {
    return res.status(403).render('error', { message: 'Invalid CSRF token. Please try again.' });
  }
  console.error(err.stack);
  res.status(500).render('error', { message: 'Something went wrong.' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Server running on http://localhost:' + PORT);
});