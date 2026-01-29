const db = require('../config/database');

// Get all active products for public viewing
const getAllPublicProducts = async (req, res) => {
  try {
    // If you want to show only products from active users, make sure users table and is_active column exist
    // Otherwise, fallback to just products
    let products;
    try {
      [products] = await db.execute(
        'SELECT p.*, u.full_name as doctor_name, u.id as doctor_user_id, u.phone FROM products p LEFT JOIN users u ON p.user_id = u.id WHERE p.is_active = 1 AND u.is_active = 1 ORDER BY p.created_at DESC'
      );
    } catch (err) {
      // Fallback: if users table or is_active column does not exist, just show active products with user_id
      [products] = await db.execute(
        'SELECT p.*, p.user_id as doctor_user_id FROM products p WHERE p.is_active = 1 ORDER BY p.created_at DESC'
      );
    }
    
    res.json({
      success: true,
      products: products
    });
  } catch (error) {
    console.error('Error fetching public products:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products'
    });
  }
};

// Get all products for authenticated user
const getProducts = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.user_id;
    
    const [products] = await db.execute(
      'SELECT * FROM products WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    
    res.json({
      success: true,
      products: products
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products'
    });
  }
};

// Add new product
const addProduct = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.user_id;
    const { product_name, price, ingredient, wage, description, category, is_active } = req.body;
    
    if (!product_name || !price || !category) {
      return res.status(400).json({
        success: false,
        message: 'Product name, price, and category are required'
      });
    }
    
    // Handle image path if file was uploaded
    let imagePath = null;
    if (req.file) {
      imagePath = `uploads/products/${req.file.filename}`;
      console.log('✓ Image uploaded:', imagePath);
    } else {
      console.log('⚠ No image file received');
    }
    
    const [result] = await db.execute(
      'INSERT INTO products (user_id, product_name, price, ingredient, wage, description, category, image, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [userId, product_name, price, ingredient || null, wage || null, description || null, category, imagePath, is_active !== false ? 1 : 0]
    );
    
    res.json({
      success: true,
      message: 'Product added successfully',
      productId: result.insertId,
      image: imagePath
    });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add product'
    });
  }
};

// Update product
const updateProduct = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.user_id;
    const productId = req.params.id;
    const { product_name, price, ingredient, wage, description, category, is_active } = req.body;
    
    if (!product_name || !price || !category) {
      return res.status(400).json({
        success: false,
        message: 'Product name, price, and category are required'
      });
    }
    
    // If a new image is uploaded, use it; otherwise, keep the existing image
    let updateValues = [product_name, price, ingredient || null, wage || null, description || null, category, is_active !== false ? 1 : 0, productId, userId];
    let query = 'UPDATE products SET product_name = ?, price = ?, ingredient = ?, wage = ?, description = ?, category = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?';
    
    if (req.file) {
      const imagePath = `uploads/products/${req.file.filename}`;
      query = 'UPDATE products SET product_name = ?, price = ?, ingredient = ?, wage = ?, description = ?, category = ?, image = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?';
      updateValues = [product_name, price, ingredient || null, wage || null, description || null, category, imagePath, is_active !== false ? 1 : 0, productId, userId];
    }
    
    const [result] = await db.execute(query, updateValues);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Product updated successfully',
      image: req.file ? `uploads/products/${req.file.filename}` : null
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update product'
    });
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.user_id;
    const productId = req.params.id;
    
    const [result] = await db.execute(
      'DELETE FROM products WHERE id = ? AND user_id = ?',
      [productId, userId]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete product'
    });
  }
};

// Get products for a specific doctor/user by user_id
const getProductsByDoctorId = async (req, res) => {
  try {
    const userId = req.params.userId;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }
    
    const [products] = await db.execute(
      'SELECT * FROM products WHERE user_id = ? AND is_active = 1 ORDER BY created_at DESC',
      [userId]
    );
    
    res.json({
      success: true,
      products: products,
      count: products.length
    });
  } catch (error) {
    console.error('Error fetching doctor products:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products'
    });
  }
};

module.exports = {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  getAllPublicProducts,
  getProductsByDoctorId
};