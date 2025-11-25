const express = require('express');
const router = express.Router();
const { getProducts, addProduct, updateProduct, deleteProduct } = require('../Controllers/ProductsController');
const { authenticateToken } = require('../middlewares/authMiddleware');

// Get all products for authenticated user
router.get('/', authenticateToken, getProducts);

// Add new product
router.post('/', authenticateToken, addProduct);

// Update product
router.put('/:id', authenticateToken, updateProduct);

// Delete product
router.delete('/:id', authenticateToken, deleteProduct);

module.exports = router;