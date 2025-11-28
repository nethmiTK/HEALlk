import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

const About = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentSpecializationIndex, setCurrentSpecializationIndex] = useState(0);
  const [isSpecializationHovered, setIsSpecializationHovered] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const heroImages = [
    { src: heroImage2, alt: "Hero 1" },
    { src: heroImage3, alt: "Hero 2" },
    { src: heroImage1, alt: "Hero 3" },
    { src: heroImage4, alt: "Hero 4" }
  ];

  const specializations = [
    {
      image: childImg,
      title: "Child Ayurveda",
      description: "Safe and natural treatments tailored for children's growth and development."
    },
    {
      image: beautyImg,
      title: "Beauty & Wellness Therapy",
      description: "Rejuvenating beauty therapies that enhance skin health and restore balance."
    },
     {
      image: stressImg,
      title: "Ayurveda for Stress Relief",
      description: "Treatments designed to reduce stress, anxiety, and improve mental well-being."
    },
    {
      image: panchkarmaImg,
      title: "Panchakarma Treatment",
      description: "A detoxifying Ayurvedic treatment aimed at cleansing and rejuvenating your body and mind."
    },
    
   
    {
      image: herbalImg,
      title: "Herbal Medicine",
      description: "Traditional herbal treatments using natural ingredients to improve health."
    },
    
    {
      image: therapyImg,
      title: "Ayurvedic Physiotherapy",
      description: "Combination of physiotherapy and Ayurveda for recovery and mobility."
    }
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

 useEffect(() => {
     const interval = setInterval(() => {
       setCurrentImageIndex((prevIndex) => 
         prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
       );
     }, 4000); // 4 seconds
 
    return () => clearInterval(interval);
  }, []);

  // Specializations Auto Slide
  useEffect(() => {
    if (!isSpecializationHovered) {
      const interval = setInterval(() => {
        setCurrentSpecializationIndex((prev) =>
          prev + 3 >= specializations.length ? 0 : prev + 3
        );
      }, 20000);
      return () => clearInterval(interval);
    }
  }, [isSpecializationHovered]);

  return (
    <div className="min-h-screen bg-green-50">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-amber-800 via-amber-600 to-orange-500">
        <div className="absolute inset-0 w-full h-full">
          {heroImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentImageIndex ? "opacity-100" : "opacity-0"
              }`}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover"
                onError={(e) => (e.target.style.display = "none")}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60"></div>
            </div>
          ))}
        </div>

         <div className="relative z-10 px-4 w-full h-full flex items-center">
          <div className="w-full flex justify-end">
            <div className="text-right pr-8 md:pr-16 lg:pr-20">
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-2 text-white leading-tight drop-shadow-2xl" style={{fontFamily: 'Playfair Display, serif'}}>
               About 
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
        <h1 className="text-6xl font-bold mb-4" style={{ fontFamily: "Playfair Display" }}>
          Meet Our Expert Team
        </h1>
        <p className="text-xl max-w-3xl mx-auto">
          Our certified Ayurvedic practitioners bring years of experience to your wellness journey.
        </p>
      </section>

      {/* DOCTOR CARDS SECTION */}
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
              {doctors.slice(0, 6).map((doctor, index) => {
                const colors = [
                  'from-green-400 to-green-600',
                  'from-blue-400 to-blue-600', 
                  'from-purple-400 to-purple-600',
                  'from-orange-400 to-orange-600',
                  'from-teal-400 to-teal-600',
                  'from-pink-400 to-pink-600'
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

      {/* CONTACT CTA */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-blue-600 text-white text-center">
        <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: "Playfair Display" }}>
          Ready to Begin Your Healing Journey?
        </h2>
        <p className="text-lg mb-6">Choose your preferred doctor and book your consultation today.</p>
        <button className="bg-white text-green-600 px-8 py-3 rounded-full hover:bg-gray-100 transition shadow-lg">
          Book Now
        </button>
      </section>

      {/* SPECIALIZATIONS SECTION */}
      <section
        id="specializations"
        className="py-20 bg-green-50"
        onMouseEnter={() => setIsSpecializationHovered(true)}
        onMouseLeave={() => setIsSpecializationHovered(false)}
      >
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold mb-6" style={{ fontFamily: "Playfair Display" }}>
            Our Ayurvedic Specializations
          </h2>

          <div className="grid md:grid-cols-3 gap-10">
            {specializations.slice(currentSpecializationIndex, currentSpecializationIndex + 3).map((spec, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-2xl shadow-lg hover:-translate-y-2 hover:shadow-xl transition"
              >
                <img src={spec.image} className="w-full h-48 object-contain mx-auto mb-4" alt={spec.title} />
                <h3 className="text-xl font-bold mb-2">{spec.title}</h3>
                <p className="text-gray-600 text-sm">{spec.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
