const express = require('express');
const router = express.Router();
const { getProducts, addProduct, updateProduct, deleteProduct, getAllPublicProducts, getProductsByDoctorId } = require('../Controllers/ProductsController');
const { authenticateToken } = require('../middlewares/authMiddleware');
const { productUpload } = require('../middlewares/uploadMiddleware');

// Public route - Get all active products
router.get('/public', getAllPublicProducts);

// Public route - Get products for a specific doctor by user_id
router.get('/doctor/:userId', getProductsByDoctorId);

// Get all products for authenticated user
router.get('/', authenticateToken, getProducts);

// Add new product with image upload
router.post('/', authenticateToken, productUpload.single('image'), addProduct);

// Update product with image upload
router.put('/:id', authenticateToken, productUpload.single('image'), updateProduct);

// Delete product
router.delete('/:id', authenticateToken, deleteProduct);

module.exports = router;