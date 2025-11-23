const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/authMiddleware');
const QualificationController = require('../controllers/QualificationController');

 router.get('/', authenticateToken, QualificationController.getQualifications);
router.post('/', authenticateToken, QualificationController.addQualification);
router.put('/:id', authenticateToken, QualificationController.updateQualification);
router.delete('/:id', authenticateToken, QualificationController.deleteQualification);
router.patch('/:id/toggle-verification', authenticateToken, QualificationController.toggleVerification);

module.exports = router;
