import React, { useState, useEffect } from 'react';
import Navbar from '../Components/Navbar';
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
import ayurvedaHerbsImg from '../assets/why-choose-us/choose.png';
const Home = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentSpecializationIndex, setCurrentSpecializationIndex] = useState(0);
  const [isSpecializationHovered, setIsSpecializationHovered] = useState(false);
  
  const heroImages = [
    { src: heroImage1, alt: 'Hero Image 1' },
    { src: heroImage2, alt: 'Hero Image 2' },
    { src: heroImage3, alt: 'Hero Image 3' },
    { src: heroImage4, alt: 'Hero Image 4' }
  ];

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

  // Auto-slide effect - changes image every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 8000); // 8 seconds

    return () => clearInterval(interval);
  }, [heroImages.length]);

   useEffect(() => {
    if (!isSpecializationHovered) {
      const interval = setInterval(() => {
        setCurrentSpecializationIndex((prevIndex) => 
          prevIndex + 3 >= specializations.length ? 0 : prevIndex + 3
        );
      }, 20000);  

      return () => clearInterval(interval);
    }
  }, [specializations.length, isSpecializationHovered]);

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
              <button className="bg-white/95 text-gray-800 px-8 py-4 rounded-full text-base md:text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-3xl hover:bg-white">
                Explore Doctors
              </button>
            </div>
          </div>
        </div>
    </section>

     <section>
     <div className="min-h-screen bg-green-50">
       
       <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6" style={{fontFamily: 'Playfair Display, serif'}}>
            Meet Our Expert Team
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Our certified Ayurvedic practitioners bring years of experience and dedication to your wellness journey
          </p>
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
  </section>

      {/* Ayurvedic Specializations Section */}
      <section 
        id="specializations" 
        className="py-20 bg-green-50 relative"
        onMouseEnter={() => setIsSpecializationHovered(true)}
        onMouseLeave={() => setIsSpecializationHovered(false)}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4" style={{fontFamily: 'Playfair Display, serif'}}>
              Explore Our Ayurvedic Specializations
            </h2>
            <div className="w-24 h-1 bg-green-500 mx-auto rounded-full mb-6"></div>
            <button className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 shadow-lg">
              Meet Our Expert Doctors →
            </button>
          </div>
          
           <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
            <button 
              onClick={() => setCurrentSpecializationIndex(currentSpecializationIndex === 0 ? specializations.length - 3 : Math.max(0, currentSpecializationIndex - 3))}
              className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-full flex items-center justify-center transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-125 border-4 border-white backdrop-blur-sm"
            >
              <span className="text-2xl font-bold">‹</span>
            </button>
          </div>
          
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10">
            <button 
              onClick={() => setCurrentSpecializationIndex(currentSpecializationIndex + 3 >= specializations.length ? 0 : currentSpecializationIndex + 3)}
              className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-full flex items-center justify-center transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-125 border-4 border-white backdrop-blur-sm"
            >
              <span className="text-2xl font-bold">›</span>
            </button>
          </div>
          
           <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${(currentSpecializationIndex / 3) * 100}%)` }}
            >
              {/* Group cards in sets of 3 */}
              {Array.from({ length: Math.ceil(specializations.length / 3) }).map((_, groupIndex) => (
                <div key={groupIndex} className="w-full flex-shrink-0">
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {specializations.slice(groupIndex * 3, (groupIndex + 1) * 3).map((spec, index) => (
                      <div key={index} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-green-100 hover:border-green-200">
                        <div className="w-24 h-24 mx-auto mb-6 rounded-xl overflow-hidden shadow-md">
                          <img 
                            src={spec.image} 
                            alt={spec.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <h3 className="text-xl font-bold mb-4 text-gray-800 text-center" style={{fontFamily: 'Playfair Display, serif'}}>{spec.title}</h3>
                        <p className="text-gray-600 text-center mb-6 leading-relaxed">
                          {spec.description}
                        </p>
                        <div className="text-center">
                          <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg">
                            Learn More
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section - Simple & Healing */}
      <section id="why-choose-us" className="py-16 bg-green-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4" style={{fontFamily: 'Playfair Display, serif'}}>
              Why Choose HEALlk?
            </h2>
            <div className="w-20 h-1 bg-green-500 mx-auto rounded-full"></div>
          </div>

          {/* Simple Content - Text Left, Circular Image Right */}
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            {/* Left Side - Text Content */}
            <div className="space-y-4">
              <p className="text-base text-gray-700 leading-relaxed">
                At our platform, we connect you with qualified and trusted Ayurvedic doctors across Sri Lanka. Every practitioner is carefully verified for authenticity, professionalism, and experience.
              </p>
              <p className="text-base text-gray-700 leading-relaxed">
                We provide a simple, transparent system with no hidden fees. Our goal is to make natural healing accessible and convenient for your well-being.
              </p>
              <div className="pt-3">
                <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2.5 rounded-full font-medium transition-all duration-300 shadow-md hover:shadow-lg">
                  Explore Platform
                </button>
              </div>
            </div>

            {/* Right Side - Circular Ayurveda Image */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-80 h-80 rounded-full overflow-hidden shadow-xl border-8 border-white">
                  <img 
                    src={ayurvedaHerbsImg} 
                    alt="Traditional Ayurvedic herbs and medicines"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1609078355490-65e24c2d4ad6?w=400&h=400&fit=crop&crop=center";
                    }}
                  />
                </div>
                {/* Simple decorative elements */}
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full"></div>
                <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-green-300 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-8 text-gray-800" style={{fontFamily: 'Playfair Display, serif'}}>About HEALlk</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
            We are dedicated to providing natural healing solutions through traditional 
            and modern wellness practices. Our mission is to help you achieve optimal 
            health and well-being through personalized treatment approaches.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-8" style={{fontFamily: 'Playfair Display, serif'}}>Get In Touch</h2>
          <p className="text-lg mb-8">Ready to start your healing journey? Contact us today!</p>
          <button className="bg-white text-green-600 px-8 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors shadow-lg">
            Book Consultation
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;
