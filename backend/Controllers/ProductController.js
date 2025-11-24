// backend/Controllers/ProductController.js
const db = require('../config/database');

// Get all products for a doctor
exports.getProducts = (req, res) => {
  const userId = req.user.id;
  
  db.query('SELECT * FROM products WHERE user_id = ? ORDER BY created_at DESC', [userId], (err, results) => {
    if (err) {
      console.error('Error fetching products:', err);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to fetch products' 
      });
    }
    res.json({ success: true, products: results });
  });
};

// Add a new product
exports.addProduct = (req, res) => {
  const userId = req.user.id;
  const { product_name, price, ingredient, wage, description, category, is_active } = req.body;
  
  // Validation
  if (!product_name || !price) {
    return res.status(400).json({
      success: false,
      message: 'Product name and price are required'
    });
  }

  const query = `
    INSERT INTO products (user_id, product_name, price, ingredient, wage, description, category, is_active, created_at) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
  `;
  
  db.query(
    query,
    [userId, product_name, price, ingredient || null, wage || null, description || null, category || 'Medicine', is_active !== false],
    (err, result) => {
      if (err) {
        console.error('Error adding product:', err);
        return res.status(500).json({ 
          success: false, 
          message: 'Failed to add product' 
        });
      }
      res.json({ 
        success: true, 
        message: 'Product added successfully',
        productId: result.insertId 
      });
    }
  );
};

// Update a product
exports.updateProduct = (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const { product_name, price, ingredient, wage, description, category, is_active } = req.body;
  
  // Validation
  if (!product_name || !price) {
    return res.status(400).json({
      success: false,
      message: 'Product name and price are required'
    });
  }

  const query = `
    UPDATE products SET 
    product_name = ?, price = ?, ingredient = ?, wage = ?, 
    description = ?, category = ?, is_active = ?, updated_at = NOW()
    WHERE id = ? AND user_id = ?
  `;
  
  db.query(
    query,
    [product_name, price, ingredient || null, wage || null, description || null, category || 'Medicine', is_active !== false, id, userId],
    (err, result) => {
      if (err) {
        console.error('Error updating product:', err);
        return res.status(500).json({ 
          success: false, 
          message: 'Failed to update product' 
        });
      }
      
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
    }
  );
};

// Delete a product
exports.deleteProduct = (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  
  db.query('DELETE FROM products WHERE id = ? AND user_id = ?', [id, userId], (err, result) => {
    if (err) {
      console.error('Error deleting product:', err);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to delete product' 
      });
    }
    
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
  });
};

// Get public products for a doctor (for public profile)
exports.getPublicProducts = (req, res) => {
  const { doctorId } = req.params;
  
  const query = `
    SELECT id, product_name, price, ingredient, description, category 
    FROM products 
    WHERE user_id = ? AND is_active = 1 
    ORDER BY created_at DESC
  `;
  
  db.query(query, [doctorId], (err, results) => {
    if (err) {
      console.error('Error fetching public products:', err);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to fetch products' 
      });
    }
    res.json({ success: true, products: results });
  });
};
