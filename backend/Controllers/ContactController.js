const { query } = require('../config/database');

exports.submitContact = async (req, res) => {
  try {
    const { name, email, phone, message, doctorId, date } = req.body;

    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        message: "Name and phone number are required.",
      });
    }

    if (!doctorId) {
      return res.status(400).json({
        success: false,
        message: "Doctor ID is required.",
      });
    }

    const sql = `INSERT INTO appointments (doctor_id, patient_name, patient_email, patient_phone, appointment_date, message) VALUES (?, ?, ?, ?, ?, ?)`;
    await query(sql, [doctorId, name, email, phone, date || null, message]);

    return res.json({
      success: true,
      message: "Appointment request submitted successfully!",
    });
  } catch (error) {
    console.error("Database Insert Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to save appointment request",
    });
  }
};
