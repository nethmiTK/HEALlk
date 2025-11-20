const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const { 
  getProfile, 
  updateProfile, 
  changePassword 
} = require('../Controllers/AutController');

// All profile routes require authentication
router.use(authenticateToken);

// Get user profile
router.get('/', getProfile);

// Update user profile
router.put('/update', updateProfile);

// Change password
router.put('/change-password', changePassword);

module.exports = router;
