const express = require('express');
const router = express.Router();
const {
  getVendorsByStatus,
  getVendorById,
  updateVendorStatus,
  deleteVendor,
  updateVendor
} = require('../Controllers/VendorsController');

// All routes accessible without strict authentication
// Read operations
router.get('/', getVendorsByStatus);
router.get('/:id', getVendorById);

// Write operations
router.patch('/:id/status', updateVendorStatus);
router.put('/:id', updateVendor);
router.delete('/:id', deleteVendor);

module.exports = router;
