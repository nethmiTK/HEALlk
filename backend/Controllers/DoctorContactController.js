const { query } = require('../config/database');

const getDoctorContact = async (req, res) => {
  try {
    const doctorId = req.params.doctorId;
    const contact = await query('SELECT * FROM doctor_contacts WHERE doctor_id = ?', [doctorId]);
    res.json({ success: true, contact: contact[0] || null });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch contact' });
  }
};

const submitAppointment = async (req, res) => {
  try {
    const { doctorId, patientName, phone, message } = req.body;
    await query(
      'INSERT INTO appointments (doctor_id, patient_name, phone, message) VALUES (?, ?, ?, ?)',
      [doctorId, patientName, phone, message]
    );
    res.json({ success: true, message: 'Appointment submitted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to submit appointment' });
  }
};

const updateDoctorContact = async (req, res) => {
  try {
    const { phone, email, address } = req.body;
    const doctorId = req.user.userId;
    await query(
      'UPDATE doctor_contacts SET phone = ?, email = ?, address = ? WHERE doctor_id = ?',
      [phone, email, address, doctorId]
    );
    res.json({ success: true, message: 'Contact updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update contact' });
  }
};

module.exports = { getDoctorContact, submitAppointment, updateDoctorContact };