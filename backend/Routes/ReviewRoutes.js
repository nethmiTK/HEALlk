const express = require('express');
const router = express.Router();
const {
  addReview,
  getAllReviews,
  getPublicReviews,
  getReviewById,
  updateReview,
  deleteReview,
  getReviewsStatistics,
  updateReviewStatus
} = require('../Controllers/ReviwsController');

// Import auth middleware
const { authenticateToken, optionalAuth } = require('../middlewares/authMiddleware');

// Public routes (no authentication required)
router.get('/public', getPublicReviews); // Get approved reviews for public display (filtered by doctor_id)
router.post('/public', addReview); // Allow public to submit reviews

// Admin routes for managing reviews (require authentication)
router.get('/', authenticateToken, getAllReviews); // Get all reviews (including pending/rejected)
router.get('/statistics', authenticateToken, getReviewsStatistics); // Get review statistics
router.get('/:id', authenticateToken, getReviewById); // Get single review
router.put('/:id', authenticateToken, updateReview); // Update review
router.delete('/:id', authenticateToken, deleteReview); // Delete review
router.patch('/:id/status', authenticateToken, updateReviewStatus); // Update review status (approve/reject)

module.exports = router;
