const express = require('express');
const router = express.Router();
const DoctorContactController = require('../Controllers/DoctorContactController');
const { authenticateToken } = require('../middlewares/authMiddleware');

// Public routes
router.get('/doctor/:doctorId', DoctorContactController.getDoctorContact);
router.post('/appointment', DoctorContactController.submitAppointment);

// Protected routes (require authentication)
router.put('/update', authenticateToken, DoctorContactController.updateDoctorContact);

module.exports = router;