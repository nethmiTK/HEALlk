
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
              className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'
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
      <section className="py-6 bg-white sticky top-0 z-20" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        <div className="max-w-7xl mx-auto px-4">
          <CategoryFilter
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            totalCount={filteredProducts.length}
          />
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          {loading ? (
            <div className="flex flex-col justify-center items-center py-24 gap-4">
              <div className="animate-spin rounded-full h-14 w-14 border-4 border-green-100 border-t-green-500"></div>
              <p className="text-gray-400 text-sm font-medium">Loading products…</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <div style={{ fontSize: '64px', marginBottom: '16px' }}>🔍</div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">No products found</h3>
              <p className="text-gray-400 mb-6">Try adjusting your search or filter</p>
              <button
                onClick={() => { onCategoryChange?.('All'); onSearchChange?.(''); }}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full text-sm font-semibold transition-colors"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {filteredProducts.map((product, idx) => {
                const imgUrl = product.image
                  ? (product.image.startsWith('http')
                    ? product.image
                    : `http://localhost:5000/${product.image.replace(/^\//, '')}`)
                  : null;

                const catColors = {
                  'Herbal Medicine': { bg: '#dcfce7', text: '#15803d' },
                  'Supplement': { bg: '#dbeafe', text: '#1d4ed8' },
                  'Oil': { bg: '#fef3c7', text: '#92400e' },
                  'Powder': { bg: '#ede9fe', text: '#6d28d9' },
                  'Capsule': { bg: '#fce7f3', text: '#9d174d' },
                  'Tablet': { bg: '#ccfbf1', text: '#0f766e' },
                };
                const catStyle = catColors[product.category] || { bg: '#f3f4f6', text: '#374151' };

                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: (idx % 8) * 0.05 }}
                    className="bg-white rounded-2xl overflow-hidden flex flex-col"
                    style={{
                      boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
                      border: '1px solid #f0f0f0',
                      transition: 'box-shadow 0.25s, transform 0.25s',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,0.12)';
                      e.currentTarget.style.transform = 'translateY(-4px)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.07)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    {/* Image area */}
                    <div style={{
                      position: 'relative',
                      height: '180px',
                      background: 'linear-gradient(135deg, #f0fdf4, #eff6ff)',
                      overflow: 'hidden',
                      flexShrink: 0,
                    }}>
                      {imgUrl ? (
                        <img
                          src={imgUrl}
                          alt={product.product_name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.35s ease' }}
                          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.07)'}
                          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                          onError={e => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      {/* Fallback emoji */}
                      <div style={{
                        display: imgUrl ? 'none' : 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        fontSize: '52px',
                      }}>💊</div>

                      {/* Category badge over image */}
                      <span style={{
                        position: 'absolute',
                        top: '10px',
                        left: '10px',
                        background: catStyle.bg,
                        color: catStyle.text,
                        fontSize: '11px',
                        fontWeight: '700',
                        borderRadius: '20px',
                        padding: '3px 10px',
                        letterSpacing: '0.2px',
                      }}>
                        {product.category}
                      </span>
                    </div>

                    {/* Card body */}
                    <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <h3 style={{
                        fontSize: '14px',
                        fontWeight: '700',
                        color: '#111827',
                        marginBottom: '6px',
                        lineHeight: '1.35',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        fontFamily: 'inherit',
                      }}>
                        {product.product_name}
                      </h3>

                      {product.description && (
                        <p style={{
                          fontSize: '12px',
                          color: '#6b7280',
                          marginBottom: '8px',
                          lineHeight: '1.5',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}>
                          {product.description}
                        </p>
                      )}

                      {product.doctor_name && (
                        <p style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '10px' }}>
                          👤 {product.doctor_name}
                        </p>
                      )}

                      {/* Price + buttons */}
                      <div style={{ marginTop: 'auto' }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: '10px',
                        }}>
                          <span style={{ fontSize: '18px', fontWeight: '800', color: '#059669' }}>
                            Rs. {parseFloat(product.price).toFixed(0)}
                          </span>
                          {product.ingredient && (
                            <span style={{ fontSize: '10px', color: '#10b981', background: '#f0fdf4', borderRadius: '4px', padding: '2px 6px', fontWeight: '600' }}>🌿 Herbal</span>
                          )}
                        </div>

                        <div style={{ display: 'flex', gap: '8px' }}>
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleOrderNow(product)}
                            style={{
                              flex: 1,
                              background: 'linear-gradient(135deg, #10b981, #059669)',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '10px',
                              padding: '9px 12px',
                              fontSize: '13px',
                              fontWeight: '700',
                              cursor: 'pointer',
                              transition: 'opacity 0.2s',
                            }}
                            onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
                            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                          >
                            🛒 Order Now
                          </motion.button>

                          {/* WhatsApp button */}
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleOrderNow(product)}
                            title="Order via WhatsApp"
                            style={{
                              background: '#dcfce7',
                              color: '#15803d',
                              border: 'none',
                              borderRadius: '10px',
                              padding: '9px 11px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'background 0.2s',
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = '#bbf7d0'}
                            onMouseLeave={e => e.currentTarget.style.background = '#dcfce7'}
                          >
                            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.272-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-4.255.949 9.758 9.758 0 00-3.142 2.433A9.828 9.828 0 002.9 16.25c0 5.428 4.314 9.767 9.844 9.767 1.535 0 3.034-.235 4.477-.689l4.537 1.494.959-2.823.334-3.432c1.218-2.067 1.879-4.459 1.879-6.95 0-5.428-4.314-9.767-9.844-9.767z" />
                            </svg>
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Products;