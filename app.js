const express = require('express');
const session = require('express-session');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const patientRoutes = require('./routes/patientRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const { isLoggedIn } = require('./middleware/authMiddleware');

const app = express();

connectDB();

app.use(helmet());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, secure: false, maxAge: 3600000 }
}));

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

app.use('/auth', authRoutes);
app.use('/admin/patients', patientRoutes);
app.use('/patient', patientRoutes);
app.use('/doctor', doctorRoutes);

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Server running on http://localhost:' + PORT);
});