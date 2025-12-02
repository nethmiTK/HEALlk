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
    <div className="bg-gradient-to-br from-green-50 to-white min-h-screen py-6 sm:py-10 px-2 sm:px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6 sm:mb-8 text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-2 text-green-700 tracking-tight">Ayurvedic Products</h1>
          <p className="text-gray-600 text-sm sm:text-base md:text-lg">Natural remedies and herbal products by Dr. {doctor?.name || 'Doctor'}</p>
        </div>

        {products.length > 0 ? (
          <>
            <div className="grid gap-4 sm:gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-8 sm:mb-12">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="group bg-white rounded-2xl shadow-lg border border-green-100 hover:border-green-400 hover:shadow-2xl transition-all duration-300 p-4 sm:p-6 flex flex-col items-center relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 m-2 sm:m-3 text-xl sm:text-2xl opacity-10 group-hover:opacity-20 transition">{getCategoryIcon(product.category)}</div>
                  <div className="text-4xl sm:text-5xl mb-2 sm:mb-3 text-green-500 group-hover:scale-110 transition-transform">{getCategoryIcon(product.category)}</div>
                  <h3 className="text-base sm:text-lg font-bold mb-1 text-gray-800 text-center group-hover:text-green-700 transition-colors">{product.product_name}</h3>
                  <span className="inline-block bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full mb-2 group-hover:bg-green-200 transition">{product.category}</span>
                  {product.description && (
                    <p className="text-gray-600 mb-2 text-sm leading-relaxed text-center">{product.description}</p>
                  )}
                  {product.ingredient && (
                    <p className="text-xs text-gray-500 mb-2 text-center">
                      <strong>Ingredients:</strong> {product.ingredient}
                    </p>
                  )}
                  <div className="text-xl font-bold text-green-600 mb-3">Rs. {product.price}</div>
                  <button className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-2 rounded-lg font-semibold shadow hover:from-green-600 hover:to-green-700 transition-colors">
                    Contact Doctor
                  </button>
                </div>
              ))}
            </div>

            {/* Product Categories */}
            <div className="bg-white rounded-xl shadow p-6 mb-4">
              <h2 className="text-2xl font-semibold mb-4 text-green-700">Available Categories</h2>
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {[...new Set(products.map(p => p.category))].map(category => (
                  <div key={category} className="text-center p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors">
                    <div className="text-3xl mb-2">{getCategoryIcon(category)}</div>
                    <h3 className="font-medium text-green-800">{category}</h3>
                    <p className="text-xs text-gray-500">
                      {products.filter(p => p.category === category).length} products
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <div className="text-7xl mb-4">💊</div>
            <h3 className="text-2xl font-semibold text-gray-600 mb-2">No Products Available</h3>
            <p className="text-gray-500">Dr. {doctor?.name || 'Doctor'} hasn't added any products yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;