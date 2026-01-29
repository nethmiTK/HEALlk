const { query, execute } = require('../config/database');

// Get all specializations with doctor counts
const getAllSpecializations = async (req, res) => {
  try {
    const sql = `
      SELECT 
        DISTINCT specialization as id,
        specialization as name,
        CONCAT('Expert doctors specializing in ', specialization) as description,
        COUNT(user_id) as doctors_count
      FROM users 
      WHERE role = 'doctor' AND status = 'accepted'
      GROUP BY specialization
      ORDER BY specialization ASC
    `;

    const results = await query(sql);

    res.json({
      success: true,
      message: 'Specializations fetched successfully',
      data: results || []
    });
  } catch (error) {
    console.error('Error in getAllSpecializations:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching specializations'
    });
  }
};

// Get doctors assigned to a specialization
const getSpecializationDoctors = async (req, res) => {
  try {
    const { id } = req.params;

    const sql = `
      SELECT user_id, full_name, email, phone
      FROM users 
      WHERE specialization = ? AND role = 'doctor' AND status = 'accepted'
      ORDER BY full_name ASC
    `;

    const results = await query(sql, [id]);

    res.json({
      success: true,
      message: 'Doctors fetched successfully',
      data: results || []
    });
  } catch (error) {
    console.error('Error in getSpecializationDoctors:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching doctors'
    });
  }
};

// Update doctors for a specialization
const updateSpecializationDoctors = async (req, res) => {
  try {
    const { id } = req.params;
    const { doctor_ids } = req.body;

    if (!Array.isArray(doctor_ids)) {
      return res.status(400).json({
        success: false,
        message: 'doctor_ids must be an array'
      });
    }

    // First, clear all doctors from this specialization
    await execute(
      'UPDATE users SET specialization = NULL WHERE specialization = ? AND role = "doctor"',
      [id]
    );

    // Then assign selected doctors to this specialization
    if (doctor_ids.length > 0) {
      const placeholders = doctor_ids.map(() => '?').join(',');
      await execute(
        `UPDATE users SET specialization = ? WHERE user_id IN (${placeholders}) AND role = 'doctor'`,
        [id, ...doctor_ids]
      );
    }

    res.json({
      success: true,
      message: 'Doctors assigned to specialization successfully',
      data: { specialization_id: id, doctor_count: doctor_ids.length }
    });
  } catch (error) {
    console.error('Error in updateSpecializationDoctors:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating specialization doctors'
    });
  }
};

module.exports = {
  getAllSpecializations,
  getSpecializationDoctors,
  updateSpecializationDoctors
};
