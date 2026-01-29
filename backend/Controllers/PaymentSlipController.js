const { query } = require('../config/database');
const path = require('path');
const fs = require('fs');

// Get all payment slips with optional status filter
const getPaymentSlips = async (req, res) => {
  try {
    const { status } = req.query;
    let sql = 'SELECT user_id as id, full_name, email, phone, specialization, status, payment_slip, payment_slip_uploaded_at as createdAt FROM users WHERE payment_slip IS NOT NULL';
    const params = [];

    if (status && ['requested', 'active', 'inactive', 'rejected', 'accepted'].includes(status)) {
      sql += ' AND status = ?';
      params.push(status);
    }

    sql += ' ORDER BY payment_slip_uploaded_at DESC';

    const slips = await query(sql, params);

    res.json({
      success: true,
      slips: slips || []
    });
  } catch (error) {
    console.error('Error fetching payment slips:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment slips'
    });
  }
};

// Get a specific payment slip
const getPaymentSlip = async (req, res) => {
  try {
    const { userId } = req.params;

    const [slip] = await query(
      'SELECT user_id as id, full_name, email, phone, specialization, status, payment_slip, payment_slip_uploaded_at as createdAt FROM users WHERE user_id = ? AND payment_slip IS NOT NULL',
      [userId]
    );

    if (!slip) {
      return res.status(404).json({
        success: false,
        message: 'Payment slip not found'
      });
    }

    res.json({
      success: true,
      slip
    });
  } catch (error) {
    console.error('Error fetching payment slip:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment slip'
    });
  }
};

// Update user status based on payment slip verification
const updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ['active', 'inactive', 'requested', 'rejected', 'accepted'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status provided'
      });
    }

    // Update user status
    await query(
      'UPDATE users SET status = ? WHERE user_id = ?',
      [status, userId]
    );

    const [updatedUser] = await query(
      'SELECT user_id, full_name, email, phone, specialization, status FROM users WHERE user_id = ?',
      [userId]
    );

    res.json({
      success: true,
      message: `User status updated to ${status}`,
      user: updatedUser
    });
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user status'
    });
  }
};

// Download payment slip file
const downloadPaymentSlip = async (req, res) => {
  try {
    const { userId } = req.params;

    const [slip] = await query(
      'SELECT payment_slip FROM users WHERE user_id = ? AND payment_slip IS NOT NULL',
      [userId]
    );

    if (!slip || !slip.payment_slip) {
      return res.status(404).json({
        success: false,
        message: 'Payment slip not found'
      });
    }

    const filePath = path.join(__dirname, '../uploads/payment-slips/', path.basename(slip.payment_slip));

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found on server'
      });
    }

    res.download(filePath);
  } catch (error) {
    console.error('Error downloading payment slip:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to download payment slip'
    });
  }
};

// Get payment slip file
const viewPaymentSlip = async (req, res) => {
  try {
    const { userId } = req.params;

    const [slip] = await query(
      'SELECT payment_slip FROM users WHERE user_id = ? AND payment_slip IS NOT NULL',
      [userId]
    );

    if (!slip || !slip.payment_slip) {
      return res.status(404).json({
        success: false,
        message: 'Payment slip not found'
      });
    }

    const filePath = path.join(__dirname, '../uploads/payment-slips/', path.basename(slip.payment_slip));

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found on server'
      });
    }

    res.sendFile(filePath);
  } catch (error) {
    console.error('Error viewing payment slip:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to view payment slip'
    });
  }
};

// Get statistics about payment slips
const getPaymentSlipStats = async (req, res) => {
  try {
    const [stats] = await query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'requested' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as approved,
        SUM(CASE WHEN status = 'inactive' THEN 1 ELSE 0 END) as rejected,
        SUM(CASE WHEN status = 'accepted' THEN 1 ELSE 0 END) as accepted
      FROM users WHERE payment_slip IS NOT NULL
    `);

    res.json({
      success: true,
      stats: {
        total: stats.total || 0,
        pending: stats.pending || 0,
        approved: stats.approved || 0,
        rejected: stats.rejected || 0,
        accepted: stats.accepted || 0
      }
    });
  } catch (error) {
    console.error('Error fetching payment slip stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics'
    });
  }
};

module.exports = {
  getPaymentSlips,
  getPaymentSlip,
  updateUserStatus,
  downloadPaymentSlip,
  viewPaymentSlip,
  getPaymentSlipStats
};
