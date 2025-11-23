const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  logout,
  getAllUsers
} = require('../Controllers/AutController');
const { authenticateToken } = require('../middlewares/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateProfile);
router.put('/change-password', authenticateToken, changePassword);
router.post('/logout', authenticateToken, logout);
router.get('/users', authenticateToken, getAllUsers);

module.exports = router;
