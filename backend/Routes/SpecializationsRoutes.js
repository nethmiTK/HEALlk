const express = require('express');
const router = express.Router();
const {
  getAllSpecializations,
  getSpecializationDoctors,
  updateSpecializationDoctors
} = require('../Controllers/SpecializationsController');
const { authenticateToken } = require('../middlewares/authMiddleware');

// Get all specializations (public)
router.get('/', getAllSpecializations);

// Get doctors for a specialization (public)
router.get('/:id/doctors', getSpecializationDoctors);

// Update doctors for a specialization (protected)
router.put('/:id/doctors', authenticateToken, updateSpecializationDoctors);

module.exports = router;
