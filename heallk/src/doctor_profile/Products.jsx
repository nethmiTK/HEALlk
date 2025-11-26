import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

const Products = ({ doctor }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (doctor?.id) {
      setLoading(true);
      fetchProducts();
    } else {
      setLoading(false);
      setError('Doctor information not available');
    }
  }, [doctor?.id]);

  const fetchProducts = async () => {
    try {
      setError(null);
      
      // Reduce timeout for faster response
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      const response = await fetch(`${API_BASE_URL}/public/products/doctor/${doctor.id}`, {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setProducts(data.products || []);
      } else {
        // Don't show error for empty products, just empty array
        setProducts([]);
      }
    } catch (error) {
      // For empty products table, don't show error - just empty state
      console.log('Products fetch info:', error.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Medicine': '💊',
      'Oil': '🫗',
      'Tea': '🍵',
      'Supplement': '🌿',
      'Capsule': '💊',
      'Powder': '🥄',
      'Other': '🌱'
    };
    return icons[category] || '🌱';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-200 border-t-green-500"></div>
        </div>
      </div>
    );
  }

  // Remove error state - handle empty products gracefully

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Ayurvedic Products</h1>
        <p className="text-gray-600">Natural remedies and herbal products by Dr. {doctor?.name || 'Doctor'}</p>
      </div>

      {products.length > 0 ? (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {products.map((product) => (
              <div key={product.id} className="bg-gradient-to-br from-white to-green-50 border-2 border-green-100 rounded-xl p-6 hover:shadow-xl hover:border-green-300 transition-all duration-300 transform hover:-translate-y-2">
                <div className="text-center">
                  <div className="text-6xl mb-4">{getCategoryIcon(product.category)}</div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">{product.product_name}</h3>
                  <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mb-3">
                    {product.category}
                  </span>
                  {product.description && (
                    <p className="text-gray-600 mb-4 text-sm leading-relaxed">{product.description}</p>
                  )}
                  {product.ingredient && (
                    <p className="text-xs text-gray-500 mb-4">
                      <strong>Ingredients:</strong> {product.ingredient}
                    </p>
                  )}
                  <div className="text-2xl font-bold text-green-600 mb-4">Rs. {product.price}</div>
                  <button className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors">
                    Contact Doctor
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Product Categories */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Available Categories</h2>
            <div className="grid md:grid-cols-4 gap-4">
              {[...new Set(products.map(p => p.category))].map(category => (
                <div key={category} className="text-center p-4 bg-white border rounded-lg hover:bg-green-50 transition-colors">
                  <div className="text-3xl mb-2">{getCategoryIcon(category)}</div>
                  <h3 className="font-medium">{category}</h3>
                  <p className="text-xs text-gray-500">
                    {products.filter(p => p.category === category).length} products
                  </p>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">💊</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No Products Available</h3>
          <p className="text-gray-500">Dr. {doctor?.name || 'Doctor'} hasn't added any products yet.</p>
        </div>
      )}
    </div>
  );
};

export default Products;