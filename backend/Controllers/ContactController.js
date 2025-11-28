const { query } = require('../config/database');

// General contact form submission (for contacts table)
exports.submitGeneralContact = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !message) {
      return res.status(400).json({
        success: false,
        message: "Name and message are required.",
      });
    }

    const sql = `INSERT INTO contacts (name, email, phone, message) VALUES (?, ?, ?, ?)`;
    await query(sql, [name, email || null, phone || null, message]);

    return res.json({
      success: true,
      message: "Your message has been sent successfully!",
    });
  } catch (error) {
    console.error("Database Insert Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send message",
    });
  }
};

// Appointment booking (for appointments table)
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
