const express = require('express');
const router = express.Router();
const ServicesController = require('../Controllers/ServicesController');
const { authenticateToken } = require('../middlewares/authMiddleware');

router.use(authenticateToken);
router.get('/', ServicesController.getServices);
router.get('/stats', ServicesController.getServiceStats);
router.get('/:id', ServicesController.getServiceById);
router.post('/', ServicesController.addService);
router.put('/:id', ServicesController.updateService);
router.delete('/:id', ServicesController.deleteService);
router.patch('/:id/toggle', ServicesController.toggleServiceStatus);

module.exports = router;