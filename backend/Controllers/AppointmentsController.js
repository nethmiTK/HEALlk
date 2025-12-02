const { query } = require('../config/database');

// Get all appointments for a doctor
const getAppointments = async (req, res) => {
  try {
    const { doctor_id } = req.query;

    if (!doctor_id) {
      return res.status(400).json({
        success: false,
        message: 'Doctor ID is required'
      });
    }

    const appointments = await query(
      `SELECT id, doctor_id, patient_name, patient_email, patient_phone, 
              appointment_date, message, status, created_at 
       FROM appointments 
       WHERE doctor_id = ? 
       ORDER BY appointment_date DESC`,
      [doctor_id]
    );

    res.json({
      success: true,
      appointments
    });
  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch appointments',
      error: error.message
    });
  }
};

// Get single appointment by ID
const getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;

    const [appointment] = await query(
      `SELECT * FROM appointments WHERE id = ?`,
      [id]
    );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    res.json({
      success: true,
      appointment
    });
  } catch (error) {
    console.error('Get appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch appointment',
      error: error.message
    });
  }
};

// Create new appointment
const createAppointment = async (req, res) => {
  try {
    const { doctor_id, patient_name, patient_email, patient_phone, appointment_date, message, status } = req.body;

    if (!doctor_id || !patient_name || !patient_phone || !appointment_date) {
      return res.status(400).json({
        success: false,
        message: 'Required fields: doctor_id, patient_name, patient_phone, appointment_date'
      });
    }

    const result = await query(
      `INSERT INTO appointments (doctor_id, patient_name, patient_email, patient_phone, appointment_date, message, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [doctor_id, patient_name, patient_email || null, patient_phone, appointment_date, message || null, status || 'pending']
    );

    res.status(201).json({
      success: true,
      message: 'Appointment created successfully',
      appointmentId: result.insertId
    });
  } catch (error) {
    console.error('Create appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create appointment',
      error: error.message
    });
  }
};

// Update appointment
const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { patient_name, patient_email, patient_phone, appointment_date, message, status } = req.body;

    if (!patient_name && !patient_email && !patient_phone && !appointment_date && !message && !status) {
      return res.status(400).json({
        success: false,
        message: 'At least one field must be provided for update'
      });
    }

    let updateQuery = 'UPDATE appointments SET ';
    let params = [];
    const updates = [];

    if (patient_name !== undefined) {
      updates.push('patient_name = ?');
      params.push(patient_name);
    }
    if (patient_email !== undefined) {
      updates.push('patient_email = ?');
      params.push(patient_email);
    }
    if (patient_phone !== undefined) {
      updates.push('patient_phone = ?');
      params.push(patient_phone);
    }
    if (appointment_date !== undefined) {
      updates.push('appointment_date = ?');
      params.push(appointment_date);
    }
    if (message !== undefined) {
      updates.push('message = ?');
      params.push(message);
    }
    if (status !== undefined) {
      updates.push('status = ?');
      params.push(status);
    }

    updateQuery += updates.join(', ') + ' WHERE id = ?';
    params.push(id);

    const result = await query(updateQuery, params);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    res.json({
      success: true,
      message: 'Appointment updated successfully'
    });
  } catch (error) {
    console.error('Update appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update appointment',
      error: error.message
    });
  }
};

// Delete appointment
const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      'DELETE FROM appointments WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    res.json({
      success: true,
      message: 'Appointment deleted successfully'
    });
  } catch (error) {
    console.error('Delete appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete appointment',
      error: error.message
    });
  }
};

module.exports = {
  getAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment
};
