const express = require('express');
const router = express.Router();
const DoctorContactController = require('../Controllers/DoctorContactController');
const authMiddleware = require('../middlewares/authMiddleware');

// Public routes
router.get('/doctor/:doctorId', DoctorContactController.getDoctorContact);
router.post('/appointment', DoctorContactController.submitAppointment);

// Protected routes (require authentication)
router.put('/update', authMiddleware, DoctorContactController.updateDoctorContact);

module.exports = router;