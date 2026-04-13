const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { isLoggedIn } = require('../middleware/authMiddleware');
const { isAdmin, isPatient, isDoctor } = require('../middleware/roleMiddleware');

// Patient routes
router.get('/book', isLoggedIn, isPatient, appointmentController.getBookAppointment);
router.post('/book', isLoggedIn, isPatient, appointmentController.postBookAppointment);
router.get('/my', isLoggedIn, isPatient, appointmentController.getMyAppointments);
router.post('/cancel/:id', isLoggedIn, isPatient, appointmentController.cancelAppointment);

// Admin routes
router.get('/admin', isLoggedIn, isAdmin, appointmentController.getAllAppointments);
router.post('/admin/:id/status', isLoggedIn, isAdmin, appointmentController.updateAppointmentStatus);

// Doctor routes
router.get('/doctor', isLoggedIn, isDoctor, appointmentController.getDoctorAppointments);

module.exports = router;