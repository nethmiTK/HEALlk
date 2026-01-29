const { query } = require('../config/database');

// GET all contacts (appointments used as contacts)
exports.getAllContacts = async (req, res) => {
  try {
    const sql = `SELECT id, patient_name as name, patient_email as email, patient_phone as phone, message, created_at FROM appointments ORDER BY created_at DESC`;
    const contacts = await query(sql);

    return res.json({
      success: true,
      data: contacts,
    });
  } catch (error) {
    console.error("Database Query Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch contacts",
      error: error.message
    });
  }
};

// GET single contact by ID
exports.getContactById = async (req, res) => {
  try {
    const { id } = req.params;
    const sql = `SELECT id, patient_name as name, patient_email as email, patient_phone as phone, message, status, created_at FROM appointments WHERE id = ?`;
    const contact = await query(sql, [id]);

    if (!contact || contact.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    return res.json({
      success: true,
      data: contact[0],
    });
  } catch (error) {
    console.error("Database Query Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch contact",
      error: error.message
    });
  }
};

// CREATE contact
exports.createContact = async (req, res) => {
  try {
    const { name, email, phone, message, doctorId = 1 } = req.body;

    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        message: "Name and phone number are required.",
      });
    }

    const sql = `INSERT INTO appointments (doctor_id, patient_name, patient_email, patient_phone, message, status) VALUES (?, ?, ?, ?, ?, ?)`;
    const result = await query(sql, [doctorId, name, email || null, phone, message || null, 'pending']);

    return res.status(201).json({
      success: true,
      message: "Contact created successfully!",
      id: result.insertId,
    });
  } catch (error) {
    console.error("Database Insert Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create contact",
      error: error.message
    });
  }
};

// UPDATE contact
exports.updateContact = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, message, status } = req.body;

    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        message: "Name and phone number are required.",
      });
    }

    const sql = `UPDATE appointments SET patient_name = ?, patient_email = ?, patient_phone = ?, message = ?, status = ? WHERE id = ?`;
    const result = await query(sql, [name, email || null, phone, message || null, status || 'pending', id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    return res.json({
      success: true,
      message: "Contact updated successfully!",
    });
  } catch (error) {
    console.error("Database Update Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update contact",
      error: error.message
    });
  }
};

// DELETE contact
exports.deleteContact = async (req, res) => {
  try {
    const { id } = req.params;

    const sql = `DELETE FROM appointments WHERE id = ?`;
    const result = await query(sql, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    return res.json({
      success: true,
      message: "Contact deleted successfully!",
    });
  } catch (error) {
    console.error("Database Delete Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete contact",
      error: error.message
    });
  }
};

// General contact form submission (now saves to appointments table)
exports.submitGeneralContact = async (req, res) => {
  try {
    const { name, email, phone, message, doctorId } = req.body;

    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        message: "Name and phone number are required.",
      });
    }

    const sql = `INSERT INTO appointments (doctor_id, patient_name, patient_email, patient_phone, appointment_date, message, status) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    await query(sql, [doctorId || null, name, email || null, phone, null, message || null, 'pending']);

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

    console.log('Appointment booking request:', { name, email, phone, message, doctorId, date });

    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        message: "Name and phone number are required.",
      });
    }

    const sql = `INSERT INTO appointments (doctor_id, patient_name, patient_email, patient_phone, appointment_date, message, status) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const result = await query(sql, [doctorId || null, name, email || null, phone, date || null, message || null, 'pending']);

    console.log('Appointment saved successfully with ID:', result.insertId);

    return res.json({
      success: true,
      message: "Appointment request submitted successfully!",
    });
  } catch (error) {
    console.error("Database Insert Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to save appointment request",
      error: error.message
    });
  }
};
