const Patient = require('../models/Patient');
const User = require('../models/User');

// Doctor - view assigned patients
exports.getMyPatients = async (req, res) => {
  try {
    const patients = await Patient.find({ assignedDoctor: req.session.user.id });
    res.render('doctor/myPatients', { patients });
  } catch (error) {
    res.render('error', { message: error.message });
  }
};

// Doctor - view single patient details
exports.getPatientDetail = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    res.render('doctor/patientDetail', { patient, error: null });
  } catch (error) {
    res.render('error', { message: error.message });
  }
};

// Doctor - update medical notes
exports.updateMedicalNotes = async (req, res) => {
  try {
    const { medicalHistory } = req.body;
    await Patient.findByIdAndUpdate(req.params.id, { medicalHistory });
    res.redirect('/doctor/patients');
  } catch (error) {
    res.render('error', { message: error.message });
  }
};