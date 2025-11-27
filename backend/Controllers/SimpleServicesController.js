const { query } = require('../config/database');

// Simple controller for public services
const getServicesByDoctor = async (req, res) => {
  try {
    const doctorId = req.params.doctorId;
    
    const services = await query(
      'SELECT id, title, description, duration, price, category, service_for FROM services WHERE doctor_id = ?',
      [doctorId]
    );

    res.json({
      success: true,
      services: services
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch services'
    });
  }
};

module.exports = { getServicesByDoctor };