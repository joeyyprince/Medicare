const isAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.role === 'admin') {
    return next();
  }
  res.status(403).render('error', { message: 'Access denied. Admins only.' });
};

const isDoctor = (req, res, next) => {
  if (req.session.user && req.session.user.role === 'doctor') {
    return next();
  }
  res.status(403).render('error', { message: 'Access denied. Doctors only.' });
};

const isPatient = (req, res, next) => {
  if (req.session.user && req.session.user.role === 'patient') {
    return next();
  }
  res.status(403).render('error', { message: 'Access denied. Patients only.' });
};

module.exports = { isAdmin, isDoctor, isPatient };