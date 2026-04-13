const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const { isLoggedIn } = require('../middleware/authMiddleware');
const { isDoctor } = require('../middleware/roleMiddleware');

router.get('/patients', isLoggedIn, isDoctor, doctorController.getMyPatients);
router.get('/patients/:id', isLoggedIn, isDoctor, doctorController.getPatientDetail);
router.post('/patients/:id/notes', isLoggedIn, isDoctor, doctorController.updateMedicalNotes);

module.exports = router;