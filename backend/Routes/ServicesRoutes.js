const express = require('express');
const router = express.Router();
const ServicesController = require('../Controllers/ServicesController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Apply authentication middleware to all routes (only login required, no role check)
router.use(authenticateToken);

// GET /api/services - Get all services for the authenticated doctor
router.get('/', ServicesController.getServices);

// GET /api/services/stats - Get service statistics for dashboard
router.get('/stats', ServicesController.getServiceStats);

// GET /api/services/:id - Get a specific service by ID (doctor's own)
router.get('/:id', ServicesController.getServiceById);

// POST /api/services - Add a new service
router.post('/', ServicesController.addService);

// PUT /api/services/:id - Update an existing service
router.put('/:id', ServicesController.updateService);

// DELETE /api/services/:id - Delete a service
router.delete('/:id', ServicesController.deleteService);

// PATCH /api/services/:id/toggle - Toggle service active status
router.patch('/:id/toggle', ServicesController.toggleServiceStatus);

module.exports = router;