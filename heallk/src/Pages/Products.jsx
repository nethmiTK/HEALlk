
import React, { useState, useEffect } from 'react';
import Navbar from '../Components/Navbar';
import { API_BASE_URL } from '../config';
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
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
      title: "Beauty & Wellness Therapy", 
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
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-2 text-white leading-tight drop-shadow-2xl" style={{fontFamily: 'Playfair Display, serif'}}>
                Panchkarma
              </h1>
              <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 text-white leading-tight drop-shadow-2xl" style={{fontFamily: 'Playfair Display, serif'}}>
                Treatment
              </h2>
              <p className="text-base md:text-lg lg:text-xl text-white/95 mb-8 max-w-lg leading-relaxed drop-shadow-lg">
                Detoxify, cleanse, and purify your mind and body through ancient Ayurvedic healing practices
              </p>
              <button 
                onClick={() => {
                  const doctorsSection = document.getElementById('doctors');
                  if (doctorsSection) doctorsSection.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-white/95 text-gray-800 px-8 py-4 rounded-full text-base md:text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-3xl hover:bg-white"
              >
                Explore Doctors
              </button>
            </div>
          </div>
        </div>
    </section>
      {/* Hero Section */}
      <section className="pt-20 pb-12 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="max-w-7xl mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{fontFamily: 'Playfair Display, serif'}}>
            All Products
          </h1>
          <p className="text-xl max-w-3xl mx-auto">
            Discover our complete range of authentic Ayurvedic products for your wellness journey
          </p>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="w-full md:w-1/2">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div className="w-full md:w-1/3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
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
                  <div key={product.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-green-100">
                    <div className="p-6">
                      <div className="mb-4">
                        <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                          {product.category}
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-bold text-gray-800 mb-2" style={{fontFamily: 'Playfair Display, serif'}}>
                        {product.product_name}
                      </h3>
                      
                      {product.ingredient && (
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                          <span className="font-medium">Ingredients:</span> {product.ingredient}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold text-green-600">
                          Rs. {parseFloat(product.price).toFixed(2)}
                        </div>
                        <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
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