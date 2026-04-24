const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const { isLoggedIn } = require('../middleware/authMiddleware');
const { isAdmin, isPatient } = require('../middleware/roleMiddleware');

// Admin routes
router.get('/', isLoggedIn, isAdmin, patientController.getAllPatients);
router.get('/doctors', isLoggedIn, isAdmin, patientController.getAllDoctors);
router.get('/create', isLoggedIn, isAdmin, patientController.getCreatePatient);
router.post('/create', isLoggedIn, isAdmin, patientController.postCreatePatient);
router.get('/edit/:id', isLoggedIn, isAdmin, patientController.getEditPatient);
router.post('/edit/:id', isLoggedIn, isAdmin, patientController.postEditPatient);
router.post('/delete/:id', isLoggedIn, isAdmin, patientController.deletePatient);

// Patient routes
router.get('/my-record', isLoggedIn, isPatient, patientController.getMyRecord);

module.exports = router;