const express = require('express');
const router = express.Router();

const {
  getQualifications,
  addQualification,
  updateQualification,
  deleteQualification,
  toggleVerification
} = require('../controllers/QualificationController');

const { authenticateToken } = require('../middlewares/authMiddleware');  // destructure here

router.get('/', authenticateToken, getQualifications);
router.post('/', authenticateToken, addQualification);
router.put('/:id', authenticateToken, updateQualification);
router.delete('/:id', authenticateToken, deleteQualification);
router.patch('/:id/toggle-verification', authenticateToken, toggleVerification);

module.exports = router;
