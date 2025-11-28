const express = require('express');
const router = express.Router();
const { getProducts, addProduct, updateProduct, deleteProduct, getAllPublicProducts } = require('../Controllers/ProductsController');
const { authenticateToken } = require('../middlewares/authMiddleware');

// Public route - Get all active products
router.get('/public', getAllPublicProducts);

// Get all products for authenticated user
router.get('/', authenticateToken, getProducts);

// Add new product
router.post('/', authenticateToken, addProduct);

// Update product
router.put('/:id', authenticateToken, updateProduct);

// Delete product
router.delete('/:id', authenticateToken, deleteProduct);

module.exports = router;