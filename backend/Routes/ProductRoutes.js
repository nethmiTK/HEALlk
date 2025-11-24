// backend/Routes/ProductRoutes.js
const express = require('express');
const router = express.Router();
const ProductController = require('../Controllers/ProductController');
const { authenticateToken } = require('../middlewares/authMiddleware');

// Public route for getting doctor's products (no auth required)
router.get('/public/:doctorId', ProductController.getPublicProducts);

// All other routes require authentication
router.use(authenticateToken);

router.get('/', ProductController.getProducts);
router.post('/', ProductController.addProduct);
router.put('/:id', ProductController.updateProduct);
router.delete('/:id', ProductController.deleteProduct);

module.exports = router;
