const db = require('../config/database');

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
    
    const [result] = await db.execute(
      'INSERT INTO products (user_id, product_name, price, ingredient, wage, description, category, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [userId, product_name, price, ingredient || null, wage || null, description || null, category, is_active !== false ? 1 : 0]
    );
    
    res.json({
      success: true,
      message: 'Product added successfully',
      productId: result.insertId
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
    
    const [result] = await db.execute(
      'UPDATE products SET product_name = ?, price = ?, ingredient = ?, wage = ?, description = ?, category = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?',
      [product_name, price, ingredient || null, wage || null, description || null, category, is_active !== false ? 1 : 0, productId, userId]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Product updated successfully'
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

module.exports = {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct
};