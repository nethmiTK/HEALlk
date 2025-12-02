const express = require('express');
const router = express.Router();
const {
  getAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment
} = require('../Controllers/AppointmentsController');

// Get all appointments for a doctor
router.get('/', getAppointments);

// Get single appointment by ID
router.get('/:id', getAppointmentById);

// Create new appointment
router.post('/', createAppointment);

// Update appointment
router.put('/:id', updateAppointment);

// Delete appointment
router.delete('/:id', deleteAppointment);

module.exports = router;
