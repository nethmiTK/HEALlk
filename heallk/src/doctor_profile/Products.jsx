import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';
import ReviewSystem from './ReviewSystem';

// Backend base URL without /api for static files
const BACKEND_BASE_URL = API_BASE_URL.replace('/api', '');

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

  // Helper function to construct proper image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    return `${BACKEND_BASE_URL}/${imagePath}`;
  };

  const fetchProducts = async () => {
    try {
      setError(null);
      
      const doctorInfo = {
        doctorId: doctor?.id,
        doctorName: doctor?.name,
        doctorEmail: doctor?.email
      };
      
      console.log('🔍 Fetching products for doctor:', doctorInfo);
      
      if (!doctor?.id) {
        throw new Error('Doctor ID not available');
      }
      
      // Fetch products for this specific doctor using user_id
      const response = await fetch(`${API_BASE_URL}/products/doctor/${doctor.id}`);
      
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      
      const data = await response.json();
      
      console.log(`✅ Products for doctor (user_id: ${doctor.id}):`, data.products);
      console.log(`📊 Total products: ${data.count || 0}`);
      
      if (data.products && Array.isArray(data.products)) {
        setProducts(data.products);
      } else {
        console.log('⚠️ No products found');
        setProducts([]);
      }
    } catch (error) {
      console.error('❌ Error fetching products:', error);
      setError(error.message);
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

  const handleOrderNow = async () => {
    try {
      // Get user phone from localStorage (saved during login)
      const token = localStorage.getItem('heallk_token');
      const userDataStr = localStorage.getItem('heallk_user');
      let userPhone = null;

      if (userDataStr) {
        const userData = JSON.parse(userDataStr);
        userPhone = userData.phone || userData.contact;
      }

      // If no phone in localStorage, fetch from API
      if (!userPhone && token) {
        const response = await fetch('http://localhost:5000/api/auth/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (response.ok) {
          const profileData = await response.json();
          userPhone = profileData.phone || profileData.contact;
        }
      }

      if (!userPhone) {
        alert('Please log in or add your phone number to your profile');
        return;
      }

      // Format phone number - remove any non-digit characters and add country code if needed
      let formattedPhone = userPhone.replace(/\D/g, '');
      if (!formattedPhone.startsWith('94')) {
        formattedPhone = '94' + formattedPhone.slice(-9); // Sri Lanka country code
      }

      // Get doctor's phone for WhatsApp
      let doctorPhone = doctor?.phone || '';
      let formattedDoctorPhone = doctorPhone.replace(/\D/g, '');
      if (!formattedDoctorPhone.startsWith('94') && formattedDoctorPhone) {
        formattedDoctorPhone = '94' + formattedDoctorPhone.slice(-9);
      }

      // Create message with doctor's phone number
      const message = `Hi Dr. ${doctor?.name}, I'm interested in ordering products from your collection.`;
      
      // Send to doctor's WhatsApp if available
      const whatsappUrl = formattedDoctorPhone 
        ? `https://wa.me/${formattedDoctorPhone}?text=${encodeURIComponent(message)}`
        : 'https://wa.me/?text=' + encodeURIComponent(`Hi, I'm interested in ordering Ayurvedic products. Contact me at: ${userPhone}`);
      
      window.open(whatsappUrl, '_blank');
    } catch (error) {
      console.error('Error opening WhatsApp:', error);
      alert('Error opening WhatsApp. Please try again.');
    }
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
          <p className="text-gray-600 text-sm sm:text-base md:text-lg">
            🩺 Premium products by <span className="font-semibold text-green-600">Dr. {doctor?.name || 'Doctor'}</span>
          </p>
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
                  
                  {/* Doctor Badge */}
                  <div className="absolute top-0 left-0 m-2 sm:m-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold opacity-80 group-hover:opacity-100 transition">
                    Dr. {doctor?.name || 'Doctor'}
                  </div>
                  
                  {/* Product Image or Icon */}
                  <div className="w-full h-40 sm:h-48 mb-3 sm:mb-4 bg-gray-100 rounded-xl overflow-hidden border border-gray-200 flex items-center justify-center group-hover:border-green-300 transition relative">
                    {product.image ? (
                      <img
                        src={getImageUrl(product.image)}
                        alt={product.product_name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          console.log('Image failed to load:', getImageUrl(product.image));
                          e.target.style.display = 'none';
                          const fallback = document.createElement('div');
                          fallback.className = 'flex items-center justify-center h-full absolute inset-0';
                          fallback.innerHTML = '<span class="text-4xl">' + getCategoryIcon(product.category) + '</span>';
                          e.target.parentElement.appendChild(fallback);
                        }}
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full">
                        <span className="text-5xl sm:text-6xl">{getCategoryIcon(product.category)}</span>
                      </div>
                    )}
                  </div>
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
                  <button 
                    onClick={handleOrderNow}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-2 rounded-lg font-semibold shadow hover:from-green-600 hover:to-green-700 transition-colors"
                  >
                    Order Now
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
            <p className="text-gray-500 mb-4">Dr. {doctor?.name} has not added any products yet.</p>
            
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md mx-auto text-left mt-4">
                <p className="text-red-700 font-semibold mb-2">❌ Error:</p>
                <p className="text-red-600 text-sm break-words">{error}</p>
              </div>
            )}
          </div>
        )}
        
        {/* Reviews Section */}
        <ReviewSystem doctorId={doctor?.id} />
      </div>
    </div>
  );
};

export default Products;