import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { API_BASE_URL } from '../config';
import aboutImg from '../assets/about.png';
import logoImage from '../assets/logo.png';
import About from '../doctor_profile/About';
import Services from '../doctor_profile/Services';
import ClinicInfo from '../doctor_profile/ClinicInfo';
import Contact from '../doctor_profile/Contact';
import ReviewSystem from '../doctor_profile/ReviewSystem';
import Products from '../doctor_profile/Products';
import BlogSection from '../doctor_profile/BlogSection';

const DoctorProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('about');
  const [currentQualificationIndex, setCurrentQualificationIndex] = useState(0);

  // Update browser tab title when doctor loads
  useEffect(() => {
    if (doctor?.name) {
      document.title = `Dr. ${doctor.name}`;
    }
  }, [doctor]);

  // Get active tab from URL
  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (hash && ['about', 'services', 'products', 'clinic', 'contact', 'reviews', 'blog'].includes(hash)) {
      setActiveTab(hash);
    }
  }, [location.hash]);

  const tabs = [
    { id: 'about', label: 'About' },
    { id: 'services', label: 'Services' },
    { id: 'products', label: 'Products' },
    { id: 'clinic', label: 'Clinic Info' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'blog', label: 'Blog' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    if (doctor?.name) {
      navigate(`/doctor/${encodeURIComponent(doctor.name)}#${tabId}`, { replace: true });
    }
  };

  useEffect(() => {
    const loadDoctorProfile = async () => {
      try {
        // Check if id is numeric (user_id) or a name
        const isNumeric = /^\d+$/.test(id);

        if (isNumeric) {
          // Fetch by ID
          const response = await fetch(`${API_BASE_URL}/public/doctors/${id}`);
          if (response.ok) {
            const data = await response.json();
            setDoctor(data.doctor);
            // Redirect to name-based URL
            navigate(`/doctor/${encodeURIComponent(data.doctor.name)}`, { replace: true });
          } else {
            navigate('/');
          }
        } else {
          // Fetch by name - get all doctors and find by name
          const response = await fetch(`${API_BASE_URL}/public/doctors`);
          if (response.ok) {
            const data = await response.json();
            const decodedName = decodeURIComponent(id).replace(/^Dr\.\s+/, ''); // Remove "Dr. " prefix if present
            const foundDoctor = data.doctors.find(doc => {
              const doctorName = doc.name || doc.full_name || ''; // Handle both field names
              return (
                doctorName.toLowerCase() === decodedName.toLowerCase() ||
                doctorName.toLowerCase().includes(decodedName.toLowerCase())
              );
            });

            if (foundDoctor) {
              setDoctor(foundDoctor);
            } else {
              navigate('/');
            }
          } else {
            navigate('/');
          }
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
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #eff6ff 50%, #faf5ff 100%)' }}>

      {/* ── Top sticky nav: logo + tabs ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-100" style={{ backdropFilter: 'blur(14px)' }}>
        <div className="w-full px-4 sm:px-5">
          <div className="flex items-center justify-between h-14 sm:h-16">

            {/* Logo */}
            <div onClick={() => navigate('/')} className="flex items-center cursor-pointer flex-shrink-0">
              <img src={logoImage} alt="HealLanka" className="h-9 sm:h-11 w-auto object-contain" />
            </div>

            {/* Desktop tabs — underline style */}
            <div className="hidden lg:flex items-center h-14 sm:h-16">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`relative flex-shrink-0 px-4 xl:px-5 h-14 sm:h-16 text-sm font-medium transition-colors duration-200 whitespace-nowrap flex items-center ${activeTab === tab.id ? 'text-emerald-600' : 'text-gray-500 hover:text-gray-800'
                    }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="profile-tab-line"
                      className="absolute bottom-0 left-3 right-3 h-[2.5px] bg-emerald-500 rounded-t-sm"
                      transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                    />
                  )}
                </button>
              ))}
            </div>

          </div>
        </div>
      </nav>

      {/* ── Mobile tab strip — always visible, fixed below the nav, no icons ── */}
      <div className="lg:hidden fixed top-14 sm:top-16 left-0 right-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="overflow-x-auto no-scrollbar">
          <div className="flex items-center px-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`relative flex-shrink-0 px-3 py-3 text-xs font-semibold whitespace-nowrap transition-colors duration-200 ${activeTab === tab.id ? 'text-emerald-600' : 'text-gray-500'
                  }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-1 right-1 h-[2.5px] bg-emerald-500 rounded-t-sm" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ══ Profile Hero ══ */}
      {/* Mobile: pt = nav(56px) + tab strip(~40px) = ~96px. Desktop: nav only = 64px */}
      <div className="pt-24 lg:pt-16">

        {/* ① Full-width cover photo */}
        <div className="relative w-full h-36 sm:h-48 md:h-56 lg:h-64 overflow-hidden bg-gradient-to-r from-emerald-400 via-teal-400 to-blue-500">
          {(doctor?.coverPhoto || aboutImg) && (
            <img
              src={doctor?.coverPhoto || aboutImg}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10 pointer-events-none" />
        </div>

        {/* ② White content area below cover */}
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Avatar + action buttons row */}
            <div className="flex items-start justify-between">

              {/* ③ Profile picture — overlaps UP into cover */}
              <div className="relative flex-shrink-0 -mt-12 sm:-mt-16 md:-mt-20">
                <div className="relative rounded-full p-1 bg-white shadow-xl" style={{ width: 'fit-content' }}>
                  <div
                    className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full overflow-hidden"
                    style={{ background: 'linear-gradient(135deg, #6ee7b7, #34d399)' }}
                  >
                    {doctor?.profilePic ? (
                      <img src={doctor.profilePic} alt={doctor.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-400 to-green-600">
                        <span
                          className="text-white text-4xl sm:text-5xl md:text-6xl font-extrabold"
                          style={{ fontFamily: 'Playfair Display, serif' }}
                        >
                          {doctor?.name?.charAt(0)?.toUpperCase() || 'D'}
                        </span>
                      </div>
                    )}
                  </div>
                  {/* Verified tick badge */}
                  <div className="absolute bottom-1 right-1 w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-emerald-500 rounded-full flex items-center justify-center border-[3px] border-white shadow-lg">
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* ④ Action buttons — desktop */}
              <div className="hidden sm:flex items-center gap-2 pt-4">
                <a
                  href={`tel:${doctor.phone}`}
                  className="inline-flex items-center gap-1.5 px-5 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white text-sm font-semibold rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Call Now
                </a>
                <a
                  href={`https://wa.me/${doctor.phone?.replace(/[^0-9]/g, '') || ''}`}
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-5 py-2 border-2 border-emerald-500 text-emerald-600 text-sm font-semibold rounded-full hover:bg-emerald-50 transition-all duration-200"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  WhatsApp
                </a>
                <a
                  href={`mailto:${doctor.email}`}
                  className="inline-flex items-center gap-1.5 px-5 py-2 border-2 border-gray-300 text-gray-600 text-sm font-semibold rounded-full hover:bg-gray-50 transition-all duration-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Email
                </a>
              </div>
            </div>

            {/* ⑤ Doctor info */}
            <div className="pb-5 pt-3">
              <h1
                className="text-2xl sm:text-3xl lg:text-[2rem] font-bold text-gray-900 leading-tight"
                style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '-0.01em' }}
              >
                Dr. {doctor?.name || 'Doctor'}
              </h1>
              <p className="mt-1 text-base sm:text-lg text-gray-600 font-normal leading-snug" style={{ fontFamily: 'Inter, sans-serif' }}>
                {doctor?.specialization ? `${doctor.specialization} · ` : ''}{doctor.role === 'admin' ? 'Senior Ayurveda Consultant' : 'Certified Ayurveda Specialist'}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500">
                {doctor.clinics?.length > 0 && (
                  <span className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    {doctor.clinics.length} Clinic{doctor.clinics.length > 1 ? 's' : ''}
                  </span>
                )}
                <span className="text-gray-300">·</span>
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Since {new Date(doctor.joinedDate).getFullYear()}
                </span>
                <span className="text-gray-300">·</span>
                <span className="flex items-center gap-1 text-emerald-600 font-medium">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Verified Professional
                </span>
              </div>

              {/* Mobile action buttons */}
              <div className="sm:hidden flex flex-wrap gap-2 mt-4">
                <a href={`tel:${doctor.phone}`} className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white text-xs font-semibold rounded-full shadow">
                  📞 Call Now
                </a>
                <a href={`https://wa.me/${doctor.phone?.replace(/[^0-9]/g, '') || ''}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-4 py-2 border border-emerald-500 text-emerald-600 text-xs font-semibold rounded-full">
                  📱 WhatsApp
                </a>
                <a href={`mailto:${doctor.email}`} className="inline-flex items-center gap-1.5 px-4 py-2 border border-gray-300 text-gray-600 text-xs font-semibold rounded-full">
                  📧 Email
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── Tab Content ── */}
      <section className="bg-gray-50 min-h-screen">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16">
          {activeTab === 'about' && (
            <div className="w-full">
              {/* ── About Dr. Section — clean & simple ── */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 sm:p-8 mb-6"
              >
                {/* Name + divider */}
                <motion.h2
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.15, duration: 0.5 }}
                  className="text-xl sm:text-2xl font-semibold text-gray-900 mb-1"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  About Dr. {doctor.name}
                </motion.h2>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: 40 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="h-0.5 bg-emerald-500 rounded-full mb-5"
                />

                {/* Description */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="text-gray-600 text-sm sm:text-base leading-relaxed"
                  style={{ fontFamily: 'Inter, sans-serif', lineHeight: '1.85' }}
                >
                  {doctor.description || 'Experienced Ayurvedic doctor specializing in traditional healing methods and holistic wellness. Committed to providing personalized treatment plans for optimal health outcomes.'}
                </motion.p>

                {/* ── 4 Trust Badges ── */}
                <div className="mt-7 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { emoji: '✅', label: 'Licensed Professional' },
                    { emoji: '🔒', label: 'Confidential Consultations' },
                    { emoji: '⚡', label: 'Quick Response' },
                    { emoji: '💯', label: 'Satisfaction Guaranteed' },
                  ].map((badge, i) => (
                    <motion.div
                      key={badge.label}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35 + i * 0.1, duration: 0.4 }}
                      whileHover={{ y: -3, boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}
                      className="flex flex-col items-center gap-1.5 p-3.5 rounded-xl border border-gray-100 bg-gray-50 cursor-default select-none"
                    >
                      <span className="text-2xl">{badge.emoji}</span>
                      <span className="text-xs text-gray-600 font-medium text-center leading-tight" style={{ fontFamily: 'Inter, sans-serif' }}>
                        {badge.label}
                      </span>
                    </motion.div>
                  ))}
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
                      <h3 className="text-4xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-3 flex items-center justify-center gap-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
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
                    <p className="text-gray-600 mt-4" style={{ fontFamily: 'Inter, sans-serif' }}>
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
                                  <span className="text-xs font-bold text-green-700 uppercase tracking-widest" style={{ fontFamily: 'Inter, sans-serif' }}>
                                    Qualification
                                  </span>
                                </div>
                                <h4 className="text-2xl font-bold bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent leading-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
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
                                  <p className="text-xs text-gray-500 font-semibold mb-1 uppercase tracking-wide" style={{ fontFamily: 'Inter, sans-serif' }}>Institution</p>
                                  <p className="text-green-700 font-bold text-lg" style={{ fontFamily: 'Poppins, sans-serif' }}>{qualification.institution}</p>
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
                                    <p className="text-xs text-gray-500 font-semibold mb-1 uppercase tracking-wide" style={{ fontFamily: 'Inter, sans-serif' }}>Specialization</p>
                                    <p className="text-green-700 font-semibold text-base" style={{ fontFamily: 'Poppins, sans-serif' }}>{qualification.specialization}</p>
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
                                <p className="text-gray-700 text-sm leading-relaxed bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-gray-100" style={{ fontFamily: 'Inter, sans-serif', lineHeight: '1.7' }}>
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
                                <span className="text-sm font-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>Verified Credential</span>
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
                            className={`transition-all duration-300 rounded-full ${index === currentQualificationIndex
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
                <h2 className="text-4xl font-bold text-gray-800 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>Our Services</h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto" style={{ fontFamily: 'Playfair Display, serif' }}>
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
                <h2 className="text-4xl font-bold text-gray-800 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>Contact Doctor</h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Get in touch with Dr. {doctor.name} for appointments and consultations
                </p>
              </div>
              <Contact doctor={doctor} />
            </div>
          )}
          {activeTab === 'products' && (
            <div className="w-full">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-gray-800 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>Ayurvedic Products</h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Natural remedies and herbal products by Dr. {doctor.name}
                </p>
              </div>
              <Products doctor={doctor} />
            </div>
          )}
          {activeTab === 'reviews' && (
            <div className="w-full">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-gray-800 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>Patient Reviews</h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Read what our patients say about Dr. {doctor.name}
                </p>
              </div>
              {doctor?.id && <ReviewSystem doctorId={doctor.id} />}
            </div>
          )}
          {activeTab === 'blog' && (
            <div className="w-full">
              <BlogSection doctorId={id} />
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

          {/* Stats Row removed as requested */}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">

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
    </div >
  );
};

export default DoctorProfile;