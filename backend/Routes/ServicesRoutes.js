const express = require('express');
const router = express.Router();
const ServicesController = require('../Controllers/ServicesController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Apply authentication middleware to all routes
router.use(authenticateToken);

// GET /api/services - Get all services for the authenticated doctor
router.get('/', ServicesController.getServices);

// GET /api/services/categories - Get available service categories
router.get('/categories', ServicesController.getServiceCategories);

// GET /api/services/stats - Get service statistics for dashboard
router.get('/stats', ServicesController.getServiceStats);

// POST /api/services - Add a new service
router.post('/', ServicesController.addService);

// PUT /api/services/:id - Update an existing service
router.put('/:id', ServicesController.updateService);

// DELETE /api/services/:id - Delete a service
router.delete('/:id', ServicesController.deleteService);

// PATCH /api/services/:id/toggle - Toggle service active status
router.patch('/:id/toggle', ServicesController.toggleServiceStatus);

module.exports = router;