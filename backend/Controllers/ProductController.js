 const db = require('../config/database');
exports.getProducts = (req, res) => {
  console.log('ProductController - req.user:', req.user);
  console.log('ProductController - req.headers.authorization:', req.headers.authorization);
  
  if (!req.user || !req.user.userId) {
    console.log('ProductController - Authentication failed');
    return res.status(401).json({
      success: false,
      message: 'User authentication required'
    });
  }
  
  const userId = req.user.userId;
  console.log('ProductController - Using userId:', userId);
  
  const query = `
    SELECT p.*, u.full_name as doctor_name, u.user_id as doctor_id
    FROM products p
    INNER JOIN users u ON p.user_id = u.user_id
    WHERE p.user_id = ? AND u.role IN ('doctor', 'admin')
    ORDER BY p.created_at DESC
  `;
  
  db.query(query, [userId], (err, results) => {
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
  if (!req.user || !req.user.userId) {
    return res.status(401).json({
      success: false,
      message: 'User authentication required'
    });
  }
  
  const userId = req.user.userId;
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
  if (!req.user || !req.user.userId) {
    return res.status(401).json({
      success: false,
      message: 'User authentication required'
    });
  }
  
  const userId = req.user.userId;
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
  if (!req.user || !req.user.userId) {
    return res.status(401).json({
      success: false,
      message: 'User authentication required'
    });
  }
  
  const userId = req.user.userId;
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
    SELECT p.id, p.product_name, p.price, p.ingredient, p.description, p.category,
           p.created_at, p.updated_at, u.full_name as doctor_name, u.user_id as doctor_id
    FROM products p
    INNER JOIN users u ON p.user_id = u.user_id
    WHERE p.user_id = ? AND p.is_active = 1 AND u.role IN ('doctor', 'admin')
    ORDER BY p.created_at DESC
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
