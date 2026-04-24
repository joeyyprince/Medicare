const Appointment = require('../models/Appointment');
const User = require('../models/User');

// Patient - show book appointment form
exports.getBookAppointment = async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor' });
    res.render('patient/bookAppointment', { doctors, error: null, csrfToken: req.csrfToken ? req.csrfToken() : '' });
  } catch (error) {
    res.render('error', { message: error.message });
  }
};

// Patient - book appointment
exports.postBookAppointment = async (req, res) => {
  try {
    const { doctor, date, time, reason } = req.body;
    await Appointment.create({
      patient: req.session.user.id,
      doctor,
      date,
      time,
      reason
    });
    res.redirect('/appointments/my');
  } catch (error) {
    const doctors = await User.find({ role: 'doctor' });
    res.render('patient/bookAppointment', { doctors, error: error.message, csrfToken: req.csrfToken ? req.csrfToken() : '' });
  }
};

// Patient - view own appointments
exports.getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.session.user.id })
      .populate('doctor', 'name email');
    res.render('patient/myAppointments', { appointments });
  } catch (error) {
    res.render('error', { message: error.message });
  }
};

// Patient - cancel appointment
exports.cancelAppointment = async (req, res) => {
  try {
    await Appointment.findByIdAndUpdate(req.params.id, { status: 'cancelled' });
    res.redirect('/appointments/my');
  } catch (error) {
    res.render('error', { message: error.message });
  }
};

// Admin - view all appointments
exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('patient', 'name email')
      .populate('doctor', 'name email');
    res.render('admin/appointments', { appointments });
  } catch (error) {
    res.render('error', { message: error.message });
  }
};

// Admin - update appointment status
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    await Appointment.findByIdAndUpdate(req.params.id, { status });
    res.redirect('/admin/appointments/admin');
  } catch (error) {
    res.render('error', { message: error.message });
  }
};

// Doctor - view their appointments
exports.getDoctorAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctor: req.session.user.id })
      .populate('patient', 'name email');
    res.render('doctor/myAppointments', { appointments });
  } catch (error) {
    res.render('error', { message: error.message });
  }
};