import React, { useState, useEffect } from 'react';
import Navbar from '../Components/Navbar';
import heroImage1 from '../assets/Hero/1.png';
import heroImage2 from '../assets/Hero/2.png';
import heroImage3 from '../assets/Hero/3.png';
import heroImage4 from '../assets/Hero/4.png';

const Doctors = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const heroImages = [
    { src: heroImage1, alt: 'Hero Image 1' },
    { src: heroImage2, alt: 'Hero Image 2' },
    { src: heroImage3, alt: 'Hero Image 3' },
    { src: heroImage4, alt: 'Hero Image 4' }
  ];

  // Auto-slide effect - changes image every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 8000); // 8 seconds

    return () => clearInterval(interval);
  }, [heroImages.length]);

  return (
    <div className="min-h-screen bg-green-50">
      <Navbar />
      
      {/* Hero Section with Image Slider */}
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

        <div className="relative z-10 px-4 w-full h-full flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 text-white leading-tight drop-shadow-2xl" style={{fontFamily: 'Playfair Display, serif'}}>
              Find Your Doctor
            </h1>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-white/90 mb-6 drop-shadow-lg">
              Expert Ayurvedic Practitioners
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-white/95 mb-8 max-w-3xl mx-auto leading-relaxed drop-shadow-lg">
              Connect with verified and experienced Ayurvedic doctors who are dedicated to your wellness journey through authentic healing practices.
            </p>
            <button className="bg-white/95 text-gray-800 px-8 py-4 rounded-full text-base md:text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-3xl hover:bg-white">
              Browse Doctors
            </button>
          </div>
        </div>
      </section>

      {/* Verified Ayurveda Doctors Section */}
      <section id="doctors" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4" style={{fontFamily: 'Playfair Display, serif'}}>
              Our Verified Ayurveda Doctors
            </h2>
            <div className="w-24 h-1 bg-green-500 mx-auto rounded-full mb-4"></div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Meet our team of certified and experienced Ayurvedic practitioners dedicated to your wellness journey
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Doctor 1 */}
            <div className="bg-green-50 p-8 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-green-200 hover:border-green-300">
              <div className="relative mb-6">
                <div className="w-32 h-32 mx-auto rounded-full overflow-hidden shadow-xl border-4 border-white">
                  <div className="w-full h-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                    <span className="text-4xl text-white font-bold">Dr</span>
                  </div>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-sm">✓</span>
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold mb-2 text-gray-800" style={{fontFamily: 'Playfair Display, serif'}}>Dr. Ayesha Perera</h3>
                <p className="text-green-600 font-medium mb-3">Senior Panchakarma Specialist</p>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  15+ years experience in traditional Ayurvedic treatments and Panchakarma therapy. Specialized in detox programs and stress management.
                </p>
                <div className="flex justify-center space-x-2 mb-4">
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">BAMS</span>
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">MD Ayurveda</span>
                </div>
                <div className="space-y-2 mb-4">
                  <p className="text-xs text-gray-500">Available: Mon-Fri 9AM-6PM</p>
                  <p className="text-xs text-gray-500">Languages: English, Sinhala, Tamil</p>
                </div>
                <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 w-full">
                  Book Appointment
                </button>
              </div>
            </div>

            {/* Doctor 2 */}
            <div className="bg-green-50 p-8 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-green-200 hover:border-green-300">
              <div className="relative mb-6">
                <div className="w-32 h-32 mx-auto rounded-full overflow-hidden shadow-xl border-4 border-white">
                  <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                    <span className="text-4xl text-white font-bold">Dr</span>
                  </div>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-sm">✓</span>
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold mb-2 text-gray-800" style={{fontFamily: 'Playfair Display, serif'}}>Dr. Rohan Silva</h3>
                <p className="text-green-600 font-medium mb-3">Herbal Medicine Expert</p>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  Specialized in traditional herbal formulations and natural wellness therapies. Expert in digestive disorders and immunity building.
                </p>
                <div className="flex justify-center space-x-2 mb-4">
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs">BAMS</span>
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs">PhD Ayurveda</span>
                </div>
                <div className="space-y-2 mb-4">
                  <p className="text-xs text-gray-500">Available: Tue-Sat 10AM-7PM</p>
                  <p className="text-xs text-gray-500">Languages: English, Sinhala</p>
                </div>
                <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 w-full">
                  Book Appointment
                </button>
              </div>
            </div>

            {/* Doctor 3 */}
            <div className="bg-green-50 p-8 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-green-200 hover:border-green-300">
              <div className="relative mb-6">
                <div className="w-32 h-32 mx-auto rounded-full overflow-hidden shadow-xl border-4 border-white">
                  <div className="w-full h-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                    <span className="text-4xl text-white font-bold">Dr</span>
                  </div>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-sm">✓</span>
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold mb-2 text-gray-800" style={{fontFamily: 'Playfair Display, serif'}}>Dr. Priya Fernando</h3>
                <p className="text-green-600 font-medium mb-3">Women & Child Wellness</p>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  Expert in Ayurvedic treatments for women's health and pediatric care. Specialized in pregnancy care and child development.
                </p>
                <div className="flex justify-center space-x-2 mb-4">
                  <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs">BAMS</span>
                  <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs">Certified</span>
                </div>
                <div className="space-y-2 mb-4">
                  <p className="text-xs text-gray-500">Available: Mon-Thu 9AM-5PM</p>
                  <p className="text-xs text-gray-500">Languages: English, Sinhala, Tamil</p>
                </div>
                <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 w-full">
                  Book Appointment
                </button>
              </div>
            </div>

            {/* Doctor 4 */}
            <div className="bg-green-50 p-8 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-green-200 hover:border-green-300">
              <div className="relative mb-6">
                <div className="w-32 h-32 mx-auto rounded-full overflow-hidden shadow-xl border-4 border-white">
                  <div className="w-full h-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                    <span className="text-4xl text-white font-bold">Dr</span>
                  </div>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-sm">✓</span>
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold mb-2 text-gray-800" style={{fontFamily: 'Playfair Display, serif'}}>Dr. Kasun Rajapaksha</h3>
                <p className="text-green-600 font-medium mb-3">Pain Management Specialist</p>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  Expert in Ayurvedic physiotherapy and pain relief treatments. Specialized in joint disorders and sports injuries.
                </p>
                <div className="flex justify-center space-x-2 mb-4">
                  <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs">BAMS</span>
                  <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs">Sports Medicine</span>
                </div>
                <div className="space-y-2 mb-4">
                  <p className="text-xs text-gray-500">Available: Wed-Sun 8AM-6PM</p>
                  <p className="text-xs text-gray-500">Languages: English, Sinhala</p>
                </div>
                <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 w-full">
                  Book Appointment
                </button>
              </div>
            </div>

            {/* Doctor 5 */}
            <div className="bg-green-50 p-8 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-green-200 hover:border-green-300">
              <div className="relative mb-6">
                <div className="w-32 h-32 mx-auto rounded-full overflow-hidden shadow-xl border-4 border-white">
                  <div className="w-full h-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center">
                    <span className="text-4xl text-white font-bold">Dr</span>
                  </div>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-sm">✓</span>
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold mb-2 text-gray-800" style={{fontFamily: 'Playfair Display, serif'}}>Dr. Nimal Wickramasinghe</h3>
                <p className="text-green-600 font-medium mb-3">Senior Consultation Expert</p>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  25+ years experience in Ayurvedic consultation and lifestyle counseling. Expert in chronic disease management.
                </p>
                <div className="flex justify-center space-x-2 mb-4">
                  <span className="bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-xs">BAMS</span>
                  <span className="bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-xs">Senior Consultant</span>
                </div>
                <div className="space-y-2 mb-4">
                  <p className="text-xs text-gray-500">Available: Mon-Fri 7AM-4PM</p>
                  <p className="text-xs text-gray-500">Languages: English, Sinhala, Tamil</p>
                </div>
                <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 w-full">
                  Book Appointment
                </button>
              </div>
            </div>

            {/* Doctor 6 */}
            <div className="bg-green-50 p-8 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-green-200 hover:border-green-300">
              <div className="relative mb-6">
                <div className="w-32 h-32 mx-auto rounded-full overflow-hidden shadow-xl border-4 border-white">
                  <div className="w-full h-full bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center">
                    <span className="text-4xl text-white font-bold">Dr</span>
                  </div>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-sm">✓</span>
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold mb-2 text-gray-800" style={{fontFamily: 'Playfair Display, serif'}}>Dr. Sanduni Amarasekara</h3>
                <p className="text-green-600 font-medium mb-3">Beauty & Wellness Expert</p>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  Specialized in Ayurvedic beauty treatments and skin care. Expert in anti-aging and natural cosmetic therapies.
                </p>
                <div className="flex justify-center space-x-2 mb-4">
                  <span className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-xs">BAMS</span>
                  <span className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-xs">Beauty Specialist</span>
                </div>
                <div className="space-y-2 mb-4">
                  <p className="text-xs text-gray-500">Available: Tue-Sat 9AM-6PM</p>
                  <p className="text-xs text-gray-500">Languages: English, Sinhala</p>
                </div>
                <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 w-full">
                  Book Appointment
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4" style={{fontFamily: 'Playfair Display, serif'}}>Ready to Begin Your Healing Journey?</h2>
          <p className="text-lg mb-8">Choose your preferred doctor and book your consultation today</p>
          <button className="bg-white text-green-600 px-8 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors shadow-lg">
            Book Now
          </button>
        </div>
      </section>
    </div>
  );
};

export default Doctors;