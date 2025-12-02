const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/authMiddleware');
const BlogController = require('../controllers/BlogController');

router.get('/', authenticateToken, BlogController.getBlogs);
router.get('/:id', authenticateToken, BlogController.getBlogById);
router.post('/', authenticateToken, BlogController.addBlog);
router.put('/:id', authenticateToken, BlogController.updateBlog);
router.delete('/:id', authenticateToken, BlogController.deleteBlog);
router.patch('/:id/toggle-publish', authenticateToken, BlogController.togglePublish);

module.exports = router;
