const express = require('express');
const router = express.Router();
const {
  getPaymentSlips,
  getPaymentSlip,
  updateUserStatus,
  downloadPaymentSlip,
  viewPaymentSlip,
  getPaymentSlipStats
} = require('../Controllers/PaymentSlipController');
const { authenticateToken } = require('../middlewares/authMiddleware');

// Admin routes for payment slip management
router.get('/admin/payment-slips', authenticateToken, getPaymentSlips);
router.get('/admin/payment-slips/stats', authenticateToken, getPaymentSlipStats);
router.get('/admin/payment-slips/:userId', authenticateToken, getPaymentSlip);
router.put('/admin/users/:userId/status', authenticateToken, updateUserStatus);
router.get('/admin/payment-slips/:userId/download', authenticateToken, downloadPaymentSlip);
router.get('/admin/payment-slips/:userId/view', authenticateToken, viewPaymentSlip);

module.exports = router;
