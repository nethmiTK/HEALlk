import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import { API_BASE_URL } from '../config';
import heroImage1 from '../assets/Hero/1.png';
import heroImage2 from '../assets/Hero/2.png';
import heroImage3 from '../assets/Hero/3.png';
import heroImage4 from '../assets/Hero/4.png';

const Doctors = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  const heroImages = [
    { src: heroImage3, alt: 'Hero Image 1' },
    { src: heroImage4, alt: 'Hero Image 2' },
    { src: heroImage1, alt: 'Hero Image 3' },
    { src: heroImage2, alt: 'Hero Image 4' }
  ];

  // Load doctors from database
  useEffect(() => {
    const loadDoctors = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/public/doctors`);
        if (response.ok) {
          const data = await response.json();
          setDoctors(data.doctors || []);
        }
      } catch (error) {
        console.error('Error loading doctors:', error);
      } finally {
        setLoading(false);
      }
    };
    loadDoctors();
  }, []);

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

       <div className="relative z-10 px-4 w-full h-full flex items-center">
          <div className="w-full flex justify-end">
            <div className="text-right pr-8 md:pr-16 lg:pr-20">
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-2 text-white leading-tight drop-shadow-2xl" style={{fontFamily: 'Playfair Display, serif'}}>
              Explore Doctors
              </h1>
              <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 text-white leading-tight drop-shadow-2xl" style={{fontFamily: 'Playfair Display, serif'}}>
                 පංචකර්ම ආයුර්වේද
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

      {/* EXPERT DOCTORS SECTION */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600 text-center text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
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
          
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-200 border-t-green-500"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {doctors.map((doctor, index) => {
                const colors = [
                  'from-green-400 to-green-600',
                  'from-blue-400 to-blue-600', 
                  'from-purple-400 to-purple-600',
                  'from-orange-400 to-orange-600',
                  'from-teal-400 to-teal-600',
                  'from-pink-400 to-pink-600'
                ];
                const badgeColors = [
                  'bg-green-100 text-green-700',
                  'bg-blue-100 text-blue-700',
                  'bg-purple-100 text-purple-700', 
                  'bg-orange-100 text-orange-700',
                  'bg-teal-100 text-teal-700',
                  'bg-pink-100 text-pink-700'
                ];
                
                return (
                  <div key={doctor.id} className="bg-green-50 p-8 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-green-200 hover:border-green-300">
                    <div className="relative mb-6">
                      <div className="w-32 h-32 mx-auto rounded-full overflow-hidden shadow-xl border-4 border-white">
                        {doctor.profilePic ? (
                          <img src={doctor.profilePic} alt={doctor.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className={`w-full h-full bg-gradient-to-br ${colors[index % colors.length]} flex items-center justify-center`}>
                            <span className="text-4xl text-white font-bold">Dr</span>
                          </div>
                        )}
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-white text-sm">✓</span>
                      </div>
                    </div>
                    <div className="text-center">
                      <h3 className="text-xl font-bold mb-3 text-gray-800" style={{fontFamily: 'Playfair Display, serif'}}>{doctor.name}</h3>
                      <p className="text-gray-600 text-lg mb-4">📞 {doctor.phone}</p>
                      <button 
                        onClick={() => navigate(`/doctor-profile/${doctor.id}`)}
                        className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 w-full"
                      >
                        Book Appointment
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
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