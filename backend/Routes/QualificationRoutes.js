const express = require('express');
const router = express.Router();
const QualificationController = require('../Controllers/QualificationController');
const { authenticateToken } = require('../middleware/authMiddleware');

// All routes require authentication
router.use(authenticateToken);

// GET /api/qualifications - Get all qualifications for current user
router.get('/', QualificationController.getQualifications);

// POST /api/qualifications - Add new qualification
router.post('/', QualificationController.addQualification);

// PUT /api/qualifications/:id - Update qualification
router.put('/:id', QualificationController.updateQualification);

// DELETE /api/qualifications/:id - Delete qualification
router.delete('/:id', QualificationController.deleteQualification);

// PATCH /api/qualifications/:id/toggle-verification - Toggle verification status
router.patch('/:id/toggle-verification', QualificationController.toggleVerification);

module.exports = router;