import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { API_BASE_URL } from '../config';
import aboutImg from '../assets/about.png';
import About from '../doctor_profile/About';
import Services from '../doctor_profile/Services';
import ClinicInfo from '../doctor_profile/ClinicInfo';
import Contact from '../doctor_profile/Contact';
import ReviewSystem from '../doctor_profile/ReviewSystem';
import Products from '../doctor_profile/Products';

const DoctorProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('about');
  const [currentQualificationIndex, setCurrentQualificationIndex] = useState(0);

  // Get active tab from URL
  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (hash && ['about', 'services', 'products', 'clinic', 'contact', 'reviews'].includes(hash)) {
      setActiveTab(hash);
    }
  }, [location.hash]);

  const tabs = [
    { id: 'about', label: 'About' },
    { id: 'services', label: 'Services' },
    { id: 'products', label: 'Products' },
    { id: 'clinic', label: 'Clinic Info' },
    { id: 'reviews', label: 'Reviews' },
        { id: 'contact', label: 'Contact' },

  ];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    navigate(`/doctor-profile/${id}#${tabId}`, { replace: true });
  };

  useEffect(() => {
    const loadDoctorProfile = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/public/doctors/${id}`);
        if (response.ok) {
          const data = await response.json();
          setDoctor(data.doctor);
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error('Error loading doctor profile:', error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadDoctorProfile();
    }
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-green-50">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-200 border-t-green-500"></div>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen bg-green-50">
        <div className="text-center py-20">
          <h1 className="text-2xl font-bold text-gray-800">Doctor not found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50">
      {/* Portfolio Hero Section */}
      <section className="relative h-96 overflow-hidden pt-16">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img src={aboutImg} alt="Medical Background" className="w-full h-full object-cover" />
        </div>
        
        {/* Doctor Profile Navbar */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-lg">
          <div className="w-full px-4">
            <div className="flex justify-between items-center h-16">
              <div onClick={() => navigate('/')} className="flex items-center gap-2 cursor-pointer">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">H</span>
                </div>
                <span className="text-xl font-bold text-gray-800">HEALlk</span>
              </div>
              
              {/* Profile Tabs */}
              <div className="flex items-center space-x-2 bg-white rounded-full p-2 shadow-lg">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => handleTabClick(tab.id)}
                    className={`px-6 py-3 rounded-full font-medium transition-all duration-300 text-sm ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg transform scale-105'
                        : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              
              {/* <button onClick={() => navigate('/register')} className="bg-green-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-green-600 transition-all duration-300">Register</button> */}
            </div>
          </div>
        </nav>
        
        {/* Medical Icons Floating */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-16 text-white opacity-20 text-5xl animate-pulse">🏥</div>
          <div className="absolute top-32 right-24 text-white opacity-20 text-4xl animate-bounce">⚕️</div>
          <div className="absolute bottom-32 left-24 text-white opacity-20 text-4xl animate-pulse">🌿</div>
          <div className="absolute bottom-20 right-16 text-white opacity-20 text-5xl animate-bounce">💊</div>
          <div className="absolute top-1/2 left-1/3 text-white opacity-10 text-6xl">🩺</div>
          <div className="absolute top-1/3 right-1/4 text-white opacity-10 text-5xl">🧘</div>
        </div>
        
        {/* Main Content */}
        <div className="relative z-10 flex items-center h-full py-8">
          <div className="w-full px-4">
            <div className="flex items-center gap-8">
              {/* Profile Picture */}
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden shadow-2xl border-4 border-white">
                  {doctor.profilePic ? (
                    <img src={doctor.profilePic} alt={doctor.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-white to-gray-100 flex items-center justify-center">
                      <span className="text-4xl text-green-600 font-bold">Dr</span>
                    </div>
                  )}
                </div>
                {/* Verified Badge */}
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-xl border-2 border-white">
                  <span className="text-white text-lg">✓</span>
                </div>
              </div>
              
              {/* Doctor Info */}
              <div className="text-black flex-1">
                <h1 className="text-4xl lg:text-5xl font-bold mb-2 drop-shadow-2xl" style={{fontFamily: 'Playfair Display, serif'}}>
                  {doctor?.name?.toUpperCase() || 'DOCTOR'}
                </h1>
                <p className="text-xl lg:text-2xl text-gray-700 mb-4 font-light" style={{fontFamily: 'Playfair Display, serif'}}>
                  {doctor.role === 'admin' ? 'Senior Ayurveda Consultant' : 'Certified Ayurveda Specialist'}
                </p>
                
                {/* Status Badges */}
                <div className="flex flex-wrap gap-3 mb-6">
                  <div className="bg-green-200 px-4 py-2 rounded-full">
                    <span className="text-black font-medium text-sm">✓ Verified Professional</span>
                  </div>
                  <div className="bg-green-200 px-4 py-2 rounded-full">
                    <span className="text-black font-medium text-sm">📅 Since {new Date(doctor.joinedDate).getFullYear()}</span>
                  </div>
                  {doctor.clinics.length > 0 && (
                    <div className="bg-green-200 px-4 py-2 rounded-full">
                      <span className="text-black font-medium text-sm">🏥 {doctor.clinics.length} Clinic{doctor.clinics.length > 1 ? 's' : ''}</span>
                    </div>
                  )}
                </div>
                
                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  <a 
                    href={`tel:${doctor.phone}`}
                    className="bg-white text-green-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2 text-sm border-2 border-green-200"
                  >
                    <span className="text-lg">📞</span> Call Now
                  </a>
                  <a 
                    href={`mailto:${doctor.email}`}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-full font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2 text-sm"
                  >
                    <span className="text-lg">📧</span> Email
                  </a>
                  <a 
                    href={`https://wa.me/${doctor.phone?.replace(/[^0-9]/g, '') || ''}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-full font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2 text-sm"
                  >
                    <span className="text-lg">📱</span> WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Wave Shape */}
        <div className="absolute bottom-0 left-0 w-full">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-20">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" fill="#ffffff"></path>
            <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" fill="#ffffff"></path>
            <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" fill="#ffffff"></path>
          </svg>
        </div>
      </section>



      {/* Tab Content */}
      <section className="py-12 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4">
          {activeTab === 'about' && (
            <div className="w-full">
              {/* Hero Section - About Dr. */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-2xl p-8 mb-8 shadow-xl border border-purple-100"
              >
                <div className="text-center lg:text-left">
                  <motion.h2 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-6" 
                    style={{fontFamily: 'Poppins, sans-serif'}}
                  >
                    About Dr. {doctor.name}
                  </motion.h2>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                  >
                    <p className="text-lg text-gray-700 leading-relaxed mb-4" style={{fontFamily: 'Inter, sans-serif', lineHeight: '1.8'}}>
                      {doctor.description || 'Experienced Ayurvedic doctor specializing in traditional healing methods and holistic wellness. Committed to providing personalized treatment plans for optimal health outcomes.'}
                    </p>
                  </motion.div>

                  {/* Decorative underline */}
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "150px" }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="h-1 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 rounded-full mx-auto lg:mx-0"
                  />
                </div>
              </motion.div>
              
              {/* Education & Certifications - Advanced Animated UI */}
              {doctor.qualifications && doctor.qualifications.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="mb-8"
                >
                  <div className="text-center mb-8">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                      className="inline-block"
                    >
                      <h3 className="text-4xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-3 flex items-center justify-center gap-3" style={{fontFamily: 'Poppins, sans-serif'}}>
                        <span className="text-5xl">🎓</span>
                        Education & Certifications
                      </h3>
                    </motion.div>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "120px" }}
                      transition={{ delay: 0.4, duration: 0.6 }}
                      className="h-1.5 bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 rounded-full mx-auto"
                    />
                    <p className="text-gray-600 mt-4" style={{fontFamily: 'Inter, sans-serif'}}>
                      {/* {currentQualificationIndex + 1} of {doctor.qualifications.length} */}
                    </p>
                  </div>
                  
                  {/* Carousel Container */}
                  <div className="relative max-w-2xl mx-auto">
                    {/* Navigation Arrows */}
                    {doctor.qualifications.length > 1 && (
                      <>
                        {/* Previous Button */}
                        <motion.button
                          whileHover={{ scale: 1.1, x: -3 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setCurrentQualificationIndex(prev => 
                            prev === 0 ? doctor.qualifications.length - 1 : prev - 1
                          )}
                          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-green-50 p-3 rounded-full shadow-xl border border-green-200 transition-all duration-300 group backdrop-blur-sm"
                          aria-label="Previous qualification"
                        >
                          <svg 
                            className="w-5 h-5 text-green-600 group-hover:text-green-700" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                          </svg>
                        </motion.button>

                        {/* Next Button */}
                        <motion.button
                          whileHover={{ scale: 1.1, x: 3 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setCurrentQualificationIndex(prev => 
                            prev === doctor.qualifications.length - 1 ? 0 : prev + 1
                          )}
                          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-green-50 p-3 rounded-full shadow-xl border border-green-200 transition-all duration-300 group backdrop-blur-sm"
                          aria-label="Next qualification"
                        >
                          <svg 
                            className="w-5 h-5 text-green-600 group-hover:text-green-700" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                          </svg>
                        </motion.button>
                      </>
                    )}

                    {/* Qualification Card */}
                    {doctor.qualifications.map((qualification, index) => (
                      index === currentQualificationIndex && (
                        <motion.div
                          key={qualification.id || index}
                          initial={{ opacity: 0, x: 100, scale: 0.9 }}
                          animate={{ opacity: 1, x: 0, scale: 1 }}
                          exit={{ opacity: 0, x: -100, scale: 0.9 }}
                          transition={{ 
                            duration: 0.5,
                            type: "spring",
                            stiffness: 100
                          }}
                          whileHover={{ 
                            scale: 1.02,
                            boxShadow: "0 25px 50px rgba(0,0,0,0.2)",
                            transition: { duration: 0.3 }
                          }}
                          className="relative bg-gradient-to-br from-white via-green-50/30 to-blue-50/30 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-green-100/50 overflow-hidden group"
                        >
                          {/* Animated Background Effect */}
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-br from-green-400/10 via-blue-400/10 to-purple-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                            initial={false}
                          />
                          
                          {/* Decorative Corner */}
                          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-400/15 to-transparent rounded-bl-full" />
                          
                          <div className="relative z-10">
                            {/* Header with Year Badge */}
                            <div className="flex items-start justify-between mb-4">
                              <motion.div
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="flex-1"
                              >
                                <div className="flex items-center gap-2 mb-2">
                                  <div className="w-2.5 h-2.5 bg-gradient-to-br from-green-400 to-green-600 rounded-full animate-pulse" />
                                  <span className="text-xs font-bold text-green-700 uppercase tracking-widest" style={{fontFamily: 'Inter, sans-serif'}}>
                                    Qualification
                                  </span>
                                </div>
                                <h4 className="text-2xl font-bold bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent leading-tight" style={{fontFamily: 'Poppins, sans-serif'}}>
                                  {qualification.degreeName}
                                </h4>
                              </motion.div>
                              
                              <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ 
                                  delay: 0.4,
                                  type: "spring",
                                  stiffness: 200
                                }}
                              >
                                <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full text-sm font-bold shadow-lg">
                                  {qualification.yearCompleted}
                                </span>
                              </motion.div>
                            </div>
                            
                            {/* Institution */}
                            <motion.div
                              initial={{ x: -20, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: 0.5 }}
                              className="mb-3"
                            >
                              <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-green-100/50">
                                <span className="text-2xl">🏛️</span>
                                <div className="flex-1">
                                  <p className="text-xs text-gray-500 font-semibold mb-1 uppercase tracking-wide" style={{fontFamily: 'Inter, sans-serif'}}>Institution</p>
                                  <p className="text-green-700 font-bold text-lg" style={{fontFamily: 'Poppins, sans-serif'}}>{qualification.institution}</p>
                                </div>
                              </div>
                            </motion.div>
                            
                            {/* Specialization */}
                            {qualification.specialization && (
                              <motion.div
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                className="mb-3"
                              >
                                <div className="flex items-center gap-3 bg-gradient-to-r from-green-50 to-emerald-50 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-green-100/50">
                                  <span className="text-2xl">⭐</span>
                                  <div className="flex-1">
                                    <p className="text-xs text-gray-500 font-semibold mb-1 uppercase tracking-wide" style={{fontFamily: 'Inter, sans-serif'}}>Specialization</p>
                                    <p className="text-green-700 font-semibold text-base" style={{fontFamily: 'Poppins, sans-serif'}}>{qualification.specialization}</p>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                            
                            {/* Description */}
                            {qualification.description && (
                              <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.7 }}
                                className="mb-3"
                              >
                                <p className="text-gray-700 text-sm leading-relaxed bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-gray-100" style={{fontFamily: 'Inter, sans-serif', lineHeight: '1.7'}}>
                                  {qualification.description}
                                </p>
                              </motion.div>
                            )}
                            
                            {/* Verified Badge */}
                            {qualification.isVerified && (
                              <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ 
                                  delay: 0.8,
                                  type: "spring",
                                  stiffness: 300
                                }}
                                className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-700 text-white px-4 py-2.5 rounded-full shadow-lg"
                              >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span className="text-sm font-bold" style={{fontFamily: 'Poppins, sans-serif'}}>Verified Credential</span>
                              </motion.div>
                            )}
                          </div>
                          
                          {/* Hover Glow Effect */}
                          <motion.div
                            className="absolute -inset-1 bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500"
                            initial={false}
                          />
                        </motion.div>
                      )
                    ))}

                    {/* Dots Indicator */}
                    {doctor.qualifications.length > 1 && (
                      <div className="flex justify-center gap-3 mt-8">
                        {doctor.qualifications.map((_, index) => (
                          <motion.button
                            key={index}
                            whileHover={{ scale: 1.3 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setCurrentQualificationIndex(index)}
                            className={`transition-all duration-300 rounded-full ${
                              index === currentQualificationIndex 
                                ? 'w-12 h-3 bg-gradient-to-r from-green-500 to-emerald-600' 
                                : 'w-3 h-3 bg-gray-300 hover:bg-green-300'
                            }`}
                            aria-label={`Go to qualification ${index + 1}`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
              
              {/* Contact CTA */}
              <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-xl p-8 text-white text-center">
                <h3 className="text-2xl font-bold mb-4">Ready to Start Your Healing Journey?</h3>
                <p className="text-lg mb-6 opacity-90">Book a consultation with Dr. {doctor.name} today</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button 
                    onClick={() => handleTabClick('contact')}
                    className="bg-white text-green-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
                  >
                    📅 Book Appointment
                  </button>
                  <button 
                    onClick={() => handleTabClick('services')}
                    className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-green-600 transition-colors"
                  >
                    🔍 View Services
                  </button>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'services' && (
            <div className="w-full">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-gray-800 mb-4" style={{fontFamily: 'Playfair Display, serif'}}>Our Services</h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto" style={{fontFamily: 'Playfair Display, serif'}}>
                  Professional healthcare services offered by Dr. {doctor.name}
                </p>
              </div>
              <Services doctor={doctor} onBookNow={() => handleTabClick('contact')} />
            </div>
          )}
          {activeTab === 'clinic' && (
            <div className="w-full">
              {/* Header Section */}
              <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-8 mb-8 text-center">
                <div className="text-6xl mb-4">🏥</div>
                <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Clinic Locations</h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  Visit our state-of-the-art facilities for comprehensive Ayurvedic healthcare
                </p>
              </div>
              
              {/* Enhanced Clinic Info */}
              <div className="space-y-8">
                <ClinicInfo doctor={doctor} />
                
                {/* Additional Features */}
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-xl p-6 shadow-lg text-center hover:shadow-xl transition-shadow">
                    <div className="text-4xl mb-4">🚗</div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Free Parking</h3>
                    <p className="text-gray-600">Convenient parking available for all patients</p>
                  </div>
                  
                  <div className="bg-white rounded-xl p-6 shadow-lg text-center hover:shadow-xl transition-shadow">
                    <div className="text-4xl mb-4">♿</div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Wheelchair Access</h3>
                    <p className="text-gray-600">Fully accessible facilities for all patients</p>
                  </div>
                  
                  <div className="bg-white rounded-xl p-6 shadow-lg text-center hover:shadow-xl transition-shadow">
                    <div className="text-4xl mb-4">📱</div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Online Booking</h3>
                    <p className="text-gray-600">Easy appointment scheduling through our platform</p>
                  </div>
                </div>
                
                {/* Emergency Contact */}
                <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6">
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">🚨</div>
                    <div>
                      <h3 className="text-xl font-bold text-red-800 mb-2">Emergency Contact</h3>
                      <p className="text-red-700">For medical emergencies, please call: <strong>{doctor?.phone || '+94 77 123 4567'}</strong></p>
                      <p className="text-red-600 text-sm mt-1">Available 24/7 for urgent medical assistance</p>
                    </div>
                  </div>
                </div>
                
                {/* Appointment CTA */}
                <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-xl p-8 text-white text-center">
                  <h3 className="text-2xl font-bold mb-4">Ready to Visit Our Clinic?</h3>
                  <p className="text-lg mb-6 opacity-90">Schedule your appointment today for personalized care</p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button 
                      onClick={() => handleTabClick('contact')}
                      className="bg-white text-green-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
                    >
                      📅 Book Appointment
                    </button>
                    <a 
                      href={`tel:${doctor?.phone}`}
                      className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-green-600 transition-colors"
                    >
                      📞 Call Now
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'contact' && (
            <div className="w-full">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-gray-800 mb-4" style={{fontFamily: 'Playfair Display, serif'}}>Contact Doctor</h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto" style={{fontFamily: 'Playfair Display, serif'}}>
                  Get in touch with Dr. {doctor.name} for appointments and consultations
                </p>
              </div>
              <Contact doctor={doctor} />
            </div>
          )}
          {activeTab === 'products' && (
            <div className="w-full">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-gray-800 mb-4" style={{fontFamily: 'Playfair Display, serif'}}>Ayurvedic Products</h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto" style={{fontFamily: 'Playfair Display, serif'}}>
                  Natural remedies and herbal products by Dr. {doctor.name}
                </p>
              </div>
              <Products doctor={doctor} />
            </div>
          )}
          {activeTab === 'reviews' && (
            <div className="w-full">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-gray-800 mb-4" style={{fontFamily: 'Playfair Display, serif'}}>Patient Reviews</h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto" style={{fontFamily: 'Playfair Display, serif'}}>
                  Read what our patients say about Dr. {doctor.name}
                </p>
              </div>
              {doctor?.id && <ReviewSystem doctorId={doctor.id} />}
            </div>
          )}
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 border-2 border-white rounded-full animate-pulse"></div>
          <div className="absolute top-32 right-20 w-16 h-16 border-2 border-white rounded-full animate-bounce"></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 border-2 border-white rounded-full animate-ping"></div>
          <div className="absolute bottom-32 right-1/3 w-24 h-24 border-2 border-white rounded-full animate-pulse"></div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <div className="mb-8">
            {/* <div className="text-6xl mb-4"></div> */}
            <h2 className="text-4xl font-bold mb-4">
              Ready to Transform Your Health?
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Join thousands of satisfied patients who have experienced the healing power of Ayurveda with Dr. {doctor.name}
            </p>
          </div>
          
          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">500+</div>
              <div className="text-sm opacity-80">Happy Patients</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">5+</div>
              <div className="text-sm opacity-80">Years Experience</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">4.9⭐</div>
              <div className="text-sm opacity-80">Patient Rating</div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => handleTabClick('contact')}
              className="bg-white text-green-600 px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105 flex items-center justify-center gap-3"
            >
              <span className="text-2xl">📅</span>
              Book Your Consultation
            </button>
            <a 
              href={`tel:${doctor.phone}`}
              className="border-2 border-white text-white px-8 py-4 rounded-full font-bold hover:bg-white hover:text-green-600 transition-all duration-300 flex items-center justify-center gap-3"
            >
              <span className="text-2xl">📞</span>
              Call Now: {doctor.phone}
            </a>
          </div>
          
          {/* Trust Indicators */}
          <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm opacity-80">
            <div className="flex items-center gap-2">
              <span>✅</span>
              <span>Licensed Professional</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🔒</span>
              <span>Confidential Consultations</span>
            </div>
            <div className="flex items-center gap-2">
              <span>⚡</span>
              <span>Quick Response</span>
            </div>
            <div className="flex items-center gap-2">
              <span>💯</span>
              <span>Satisfaction Guaranteed</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DoctorProfile;