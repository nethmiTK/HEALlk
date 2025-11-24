const express = require('express');
const router = express.Router();
const { getVerifiedDoctors, getDoctorProfile } = require('../controllers/PublicController');

// Public routes - no authentication required
router.get('/doctors', getVerifiedDoctors);
router.get('/doctors/:id', getDoctorProfile);

module.exports = router;