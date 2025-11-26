const { query } = require('../config/database');

const getProductsByDoctor = async (req, res) => {
  try {
    const doctorId = req.params.doctorId;
    
    const products = await query(
      'SELECT id, product_name, price, ingredient, description, category FROM products WHERE user_id = ?',
      [doctorId]
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

module.exports = { getProductsByDoctor };