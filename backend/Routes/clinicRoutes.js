const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/authMiddleware');
const {
  getClinicInfo,
  addClinicInfo,
  updateClinicInfo,
} = require('../controllers/clinicController');

router.get('/', authenticateToken, getClinicInfo);
router.post('/', authenticateToken, addClinicInfo);
router.put('/', authenticateToken, updateClinicInfo); // PUT request to update clinic info for the logged-in user

module.exports = router;
