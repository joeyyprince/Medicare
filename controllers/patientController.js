const Patient = require('../models/Patient');
const User = require('../models/User');

exports.getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find().populate('assignedDoctor', 'name email');
    res.render('admin/patients', { patients });
  } catch (error) {
    res.render('error', { message: error.message });
  }
};

exports.getCreatePatient = async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor' });
    res.render('admin/createPatient', { doctors, error: null, csrfToken: req.csrfToken ? req.csrfToken() : '' });
  } catch (error) {
    res.render('error', { message: error.message });
  }
};

exports.postCreatePatient = async (req, res) => {
  try {
    const { name, email, phone, dateOfBirth, gender, address, medicalHistory, assignedDoctor } = req.body;
    const patientData = { name, email, phone, dateOfBirth, gender, address, medicalHistory };
    if (assignedDoctor && assignedDoctor !== '') {
      patientData.assignedDoctor = assignedDoctor;
    }
    await Patient.create(patientData);
    res.redirect('/admin/patients');
  } catch (error) {
    const doctors = await User.find({ role: 'doctor' });
    res.render('admin/createPatient', { doctors, error: error.message, csrfToken: req.csrfToken ? req.csrfToken() : '' });
  }
};

exports.getEditPatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    const doctors = await User.find({ role: 'doctor' });
    res.render('admin/editPatient', { patient, doctors, error: null, csrfToken: req.csrfToken ? req.csrfToken() : '' }); 
  } catch (error) {
    res.render('error', { message: error.message });
  }
};

exports.postEditPatient = async (req, res) => {
  try {
    const { name, email, phone, dateOfBirth, gender, address, medicalHistory, assignedDoctor } = req.body;
    const patientData = { name, email, phone, dateOfBirth, gender, address, medicalHistory };
    if (assignedDoctor && assignedDoctor !== '') {
      patientData.assignedDoctor = assignedDoctor;
    }
    await Patient.findByIdAndUpdate(req.params.id, patientData);
    res.redirect('/admin/patients');
  } catch (error) {
    res.render('error', { message: error.message });
  }
};

exports.deletePatient = async (req, res) => {
  try {
    await Patient.findByIdAndDelete(req.params.id);
    res.redirect('/admin/patients');
  } catch (error) {
    res.render('error', { message: error.message });
  }
};

exports.getMyRecord = async (req, res) => {
  try {
    const patient = await Patient.findOne({ email: req.session.user.email }).populate('assignedDoctor', 'name email');
    res.render('patient/myRecord', { patient });
  } catch (error) {
    res.render('error', { message: error.message });
  }
};

exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor' });
    res.render('admin/doctors', { doctors });
  } catch (error) {
    res.render('error', { message: error.message });
  }
};