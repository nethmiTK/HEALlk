
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import CategoryFilter from '../Components/CategoryFilter';
import { API_BASE_URL } from '../config';
import OrderConfirmationModal from '../Components/OrderConfirmationModal';

// Backend base URL without /api for static files
const BACKEND_BASE_URL = API_BASE_URL.replace('/api', '');
import heroImage1 from '../assets/Hero/1.png';
import heroImage2 from '../assets/Hero/2.png';
import heroImage3 from '../assets/Hero/3.png';
import heroImage4 from '../assets/Hero/4.png';
import panchkarmaImg from '../assets/specalization/PanchakarmaTreatment.png';
import beautyImg from '../assets/specalization/beauty.png';
import stressImg from '../assets/specalization/stress.png';
import herbalImg from '../assets/specalization/herbalmedicine.png';
import childImg from '../assets/specalization/child.png';
import therapyImg from '../assets/specalization/therapy.png';


const Products = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [userPhone, setUserPhone] = useState(null);

  const handleOrderNow = async (product) => {
    try {
      // Fetch vendor/doctor phone from the users table using user_id
      let vendorPhone = null;
      let vendorName = null;
      
      // Use user_id from product, or fallback to doctor_user_id
      const userId = product.user_id || product.doctor_user_id;
      
      if (userId) {
        try {
          console.log('Fetching vendor phone for user ID:', userId);
          const vendorResponse = await fetch(`${API_BASE_URL}/public/user/${userId}`);
          console.log('Vendor response status:', vendorResponse.status);
          
          if (vendorResponse.ok) {
            const vendorData = await vendorResponse.json();
            console.log('Vendor data:', vendorData);
            vendorPhone = vendorData.phone;
            vendorName = vendorData.full_name;
          } else {
            const errorData = await vendorResponse.json();
            console.warn('Vendor API error:', errorData);
          }
        } catch (vendorError) {
          console.warn('Could not fetch vendor phone:', vendorError);
        }
      }

      if (!vendorPhone) {
        alert(`Vendor phone number not available for product ID: ${product.id}, User ID: ${userId}. Please try again later.`);
        return;
      }

      // Set vendor phone and show modal with product details
      setUserPhone(vendorPhone);
      setSelectedProduct(product);
      setShowOrderModal(true);
    } catch (error) {
      console.error('Error preparing order:', error);
      alert('Error processing order. Please try again.');
    }
  };

  const handleConfirmOrder = (product, vendorPhone) => {
    try {
      // Format vendor phone number - remove any non-digit characters and add country code if needed
      let formattedPhone = vendorPhone.replace(/\D/g, '');
      if (!formattedPhone.startsWith('94')) {
        formattedPhone = '94' + formattedPhone.slice(-9); // Sri Lanka country code
      }

      const message = `Hi, I'm interested in ordering: *${product.product_name}* (Rs. ${product.price})`;
      const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
      
      // Close modal after opening WhatsApp
      setShowOrderModal(false);
    } catch (error) {
      console.error('Error opening WhatsApp:', error);
      alert('Error opening WhatsApp. Please try again.');
    }
  };

  const heroImages = [
    { src: heroImage4, alt: 'Hero Image 1' },
    { src: heroImage3, alt: 'Hero Image 2' },
    { src: heroImage1, alt: 'Hero Image 3' },
    { src: heroImage4, alt: 'Hero Image 4' }
  ];

  const categories = ['All', 'Herbal Medicine', 'Supplement', 'Oil', 'Powder', 'Capsule', 'Tablet'];

  // Auto-slide effect - changes image every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  const specializations = [
    {
      image: panchkarmaImg,
      title: "Panchakarma Treatment",
      description: "A detoxifying Ayurvedic treatment aimed at cleansing and rejuvenating your body and mind."
    },
    {
      image: beautyImg,
      title: " erapy", 
      description: "Rejuvenating beauty therapies that enhance skin health, promote relaxation, and restore balance."
    },
    {
      image: stressImg,
      title: "Ayurveda for Stress Relief",
      description: "Natural treatments designed to reduce stress, anxiety, and promote emotional well-being."
    },
    {
      image: herbalImg,
      title: "Herbal Medicine",
      description: "Traditional herbal treatments using the power of plants to improve health and boost immunity."
    },
    {
      image: childImg,
      title: "Child Ayurveda",
      description: "Safe and natural treatments tailored for children's health and growth."
    },
    {
      image: therapyImg,
      title: "Ayurvedic Physiotherapy",
      description: "A combination of Ayurvedic principles with physiotherapy to help with recovery, pain relief, and mobility."
    }
  ];
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/products/public`);
        if (response.ok) {
          const data = await response.json();
          setProducts(data.products || []);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product => {
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      product.product_name.toLowerCase().includes(search) ||
      (product.category && product.category.toLowerCase().includes(search));
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory && product.is_active !== false;
  });

  return (
    <div className="min-h-screen bg-green-50">
      <Navbar />
      
      {/* Order Confirmation Modal */}
      {showOrderModal && selectedProduct && userPhone && (
        <OrderConfirmationModal 
          product={selectedProduct}
          userPhone={userPhone}
          onConfirm={() => handleConfirmOrder(selectedProduct, userPhone)}
          onCancel={() => setShowOrderModal(false)}
        />
      )}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-amber-800 via-amber-600 to-orange-500">
         <div className="absolute inset-0 w-full h-full">
          {heroImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.log(`Error loading image ${index + 1}:`, e);
                  e.target.style.display = 'none';
                }}
              />
              {/* Gradient overlay for better text readability */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60"></div>
            </div>
          ))}
        </div>

        <div className="relative z-10 px-4 w-full h-full flex items-center">
          <div className="w-full flex justify-end">
            <div className="text-right pr-8 md:pr-16 lg:pr-20">
              <motion.h1
                className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-2 text-white leading-tight drop-shadow-2xl"
                style={{ fontFamily: 'Playfair Display, serif' }}
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1, type: 'spring', stiffness: 80 }}
              >
                Panchkarma
              </motion.h1>
              <motion.h2
                className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 text-white leading-tight drop-shadow-2xl"
                style={{ fontFamily: 'Playfair Display, serif' }}
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3, type: 'spring', stiffness: 80 }}
              >
                Treatment
              </motion.h2>
              <motion.p
                className="text-base md:text-lg lg:text-xl text-white/95 mb-8 max-w-lg leading-relaxed drop-shadow-lg"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5, type: 'spring', stiffness: 80 }}
              >
                Detoxify, cleanse, and purify your mind and body through ancient Ayurvedic healing practices
              </motion.p>

            </div>
          </div>
        </div>
    </section>

      {/* Search and Filter */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <CategoryFilter 
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 bg-green-50">
        <div className="max-w-7xl mx-auto px-4">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-200 border-t-green-500"></div>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <p className="text-gray-600">
                  Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
                  {selectedCategory !== 'All' && ` in ${selectedCategory}`}
                  {searchTerm && ` matching "${searchTerm}"`}
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <motion.div 
                    key={product.id} 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-green-100 overflow-hidden flex flex-col h-full"
                  >
                    {/* Product Image */}
                    <div className="relative h-48 bg-gradient-to-br from-green-100 to-blue-100 overflow-hidden">
                      {product.image ? (
                        <img
                          src={`${BACKEND_BASE_URL}/${product.image}`}
                          alt={product.product_name}
                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                          onError={(e) => {
                            console.log('Image failed to load:', `${BACKEND_BASE_URL}/${product.image}`);
                            e.target.style.display = 'none';
                            const fallback = document.createElement('div');
                            fallback.className = 'flex items-center justify-center h-full absolute inset-0';
                            fallback.innerHTML = '<span class="text-4xl">💊</span>';
                            e.target.parentElement.appendChild(fallback);
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-5xl">💊</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-5 flex flex-col flex-grow">
                      {/* Category Badge */}
                      <div className="mb-3">
                        <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                          {product.category}
                        </span>
                      </div>
                      
                      {/* Product Name */}
                      <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2" style={{fontFamily: 'Playfair Display, serif'}}>
                        {product.product_name}
                      </h3>
                      
                      {/* Description */}
                      {product.description && (
                        <p className="text-gray-600 text-xs mb-3 line-clamp-2">
                          {product.description}
                        </p>
                      )}
                      
                      {/* Ingredients */}
                      {product.ingredient && (
                        <p className="text-gray-600 text-xs mb-3 line-clamp-2">
                          <span className="font-medium text-gray-700">🌿 Ingredients:</span> {product.ingredient}
                        </p>
                      )}

                      {/* Vendor Name */}
                      {product.doctor_name && (
                        <p className="text-gray-700 text-xs mb-3 pb-3 border-b border-gray-200">
                          <span className="font-medium">👨‍⚕️ Vendor:</span> {product.doctor_name}
                        </p>
                      )}
                      
                      {/* Price and Buttons */}
                      <div className="mt-auto space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="text-2xl font-bold text-green-600">
                            Rs. {parseFloat(product.price).toFixed(2)}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleOrderNow(product)}
                            className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                          >
                            <span>🛒</span> Order
                          </motion.button>

                          <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleOrderNow(product)}
                            className="bg-green-100 hover:bg-green-200 text-green-600 p-2 rounded-lg transition-colors flex items-center justify-center"
                            title="Order via WhatsApp"
                          >
                            <svg 
                              className="w-5 h-5" 
                              fill="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.272-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-4.255.949 9.758 9.758 0 00-3.142 2.433A9.828 9.828 0 002.9 16.25c0 5.428 4.314 9.767 9.844 9.767 1.535 0 3.034-.235 4.477-.689l4.537 1.494.959-2.823.334-3.432c1.218-2.067 1.879-4.459 1.879-6.95 0-5.428-4.314-9.767-9.844-9.767z"/>
                            </svg>
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {filteredProducts.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
                  <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Products;