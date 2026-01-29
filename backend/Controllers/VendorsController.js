const { query } = require('../config/database');

// Get vendors by status
const getVendorsByStatus = async (req, res) => {
  try {
    const { status } = req.query;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status parameter is required'
      });
    }

    // Only fetch doctors (vendors are doctors)
    const sql = `
      SELECT user_id, full_name, email, phone, role, specialization, status, description, payment_slip, address, district, created_at 
      FROM users 
      WHERE role = 'doctor' AND status = ? 
      ORDER BY created_at DESC
    `;

    const results = await query(sql, [status]);

    res.json({
      success: true,
      message: `Vendors with status '${status}' fetched successfully`,
      data: results || []
    });
  } catch (error) {
    console.error('Error in getVendorsByStatus:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching vendors'
    });
  }
};

// Get single vendor by ID
const getVendorById = async (req, res) => {
  try {
    const { id } = req.params;

    const sql = `
      SELECT user_id, full_name, email, phone, role, specialization, status, description, payment_slip, address, district, created_at 
      FROM users 
      WHERE user_id = ? AND role = 'doctor'
    `;

    const results = await query(sql, [id]);

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found'
      });
    }

    res.json({
      success: true,
      message: 'Vendor fetched successfully',
      data: results[0]
    });
  } catch (error) {
    console.error('Error in getVendorById:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching vendor'
    });
  }
};

// Update vendor status
const updateVendorStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }

    const validStatuses = ['active', 'inactive', 'suspended', 'requested', 'rejected', 'accepted'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const { execute } = require('../config/database');
    const [results] = await execute(
      'UPDATE users SET status = ? WHERE user_id = ? AND role = "doctor"',
      [status, id]
    );

    if (results.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found'
      });
    }

    res.json({
      success: true,
      message: 'Vendor status updated successfully',
      data: { user_id: id, status }
    });
  } catch (error) {
    console.error('Error in updateVendorStatus:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating vendor status'
    });
  }
};

// Delete vendor
const deleteVendor = async (req, res) => {
  try {
    const { id } = req.params;

    const { execute } = require('../config/database');
    const [results] = await execute(
      'DELETE FROM users WHERE user_id = ? AND role = "doctor"',
      [id]
    );

    if (results.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found'
      });
    }

    res.json({
      success: true,
      message: 'Vendor deleted successfully'
    });
  } catch (error) {
    console.error('Error in deleteVendor:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting vendor'
    });
  }
};

// Update vendor details
const updateVendor = async (req, res) => {
  try {
    const { id } = req.params;
    const { full_name, email, phone, specialization, description } = req.body;

    const fields = [];
    const values = [];

    if (full_name) {
      fields.push('full_name = ?');
      values.push(full_name);
    }
    if (email) {
      fields.push('email = ?');
      values.push(email);
    }
    if (phone) {
      fields.push('phone = ?');
      values.push(phone);
    }
    if (specialization) {
      fields.push('specialization = ?');
      values.push(specialization);
    }
    if (description) {
      fields.push('description = ?');
      values.push(description);
    }

    if (fields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
    }

    values.push(id);

    const { execute } = require('../config/database');
    const [results] = await execute(
      `UPDATE users SET ${fields.join(', ')} WHERE user_id = ? AND role = "doctor"`,
      values
    );

    if (results.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found'
      });
    }

    res.json({
      success: true,
      message: 'Vendor updated successfully',
      data: { user_id: id }
    });
  } catch (error) {
    console.error('Error in updateVendor:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating vendor'
    });
  }
};

module.exports = {
  getVendorsByStatus,
  getVendorById,
  updateVendorStatus,
  deleteVendor,
  updateVendor
};
