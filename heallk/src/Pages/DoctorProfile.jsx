import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
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
    { id: 'contact', label: 'Contact' },
    { id: 'reviews', label: 'Reviews' }
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
              <div className="flex items-center space-x-6">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => handleTabClick(tab.id)}
                    className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                      activeTab === tab.id
                        ? 'bg-green-500 text-white shadow-lg'
                        : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              
              <button onClick={() => navigate('/register')} className="bg-green-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-green-600 transition-all duration-300">Register</button>
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
                <div className="flex gap-3">
                  <a 
                    href={`tel:${doctor.phone}`}
                    className="bg-white text-green-600 px-5 py-2 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2 text-sm"
                  >
                    📞 Call Now
                  </a>
                  <a 
                    href={`mailto:${doctor.email}`}
                    className="bg-green-200 text-black px-5 py-2 rounded-full font-semibold hover:bg-green-300 transition-all duration-300 flex items-center gap-2 text-sm"
                  >
                    📧 Email
                  </a>
                  <a 
                    href={`https://wa.me/${doctor.phone?.replace(/[^0-9]/g, '') || ''}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-500 text-white px-5 py-2 rounded-full font-semibold hover:bg-green-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2 text-sm"
                  >
                    📱 WhatsApp
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
      <section className="py-12 bg-green-50 min-h-screen">
        <div className="w-full">
          {activeTab === 'about' && (
            <div className="w-full">
              {/* Hero Section */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 mb-8">
                <div className="flex flex-col lg:flex-row items-center gap-8">
                  <div className="relative">
                    <div className="w-48 h-48 rounded-full overflow-hidden shadow-2xl border-4 border-white">
                      {doctor.profilePic ? (
                        <img src={doctor.profilePic} alt={doctor.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                          <span className="text-6xl text-white font-bold">Dr</span>
                        </div>
                      )}
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white text-xl">✓</span>
                    </div>
                  </div>
                  
                  <div className="flex-1 text-center lg:text-left">
                    <h2 className="text-4xl font-bold text-gray-800 mb-4">About Dr. {doctor.name}</h2>
                    <p className="text-lg text-gray-600 leading-relaxed mb-6">
                      {doctor.description || 'Experienced Ayurvedic doctor specializing in traditional healing methods and holistic wellness. Committed to providing personalized treatment plans for optimal health outcomes.'}
                    </p>
                    
                    {/* Stats Cards */}
                    <div className="grid grid-cols-3 gap-4 mt-6">
                      <div className="bg-white rounded-lg p-4 shadow-md text-center">
                        <div className="text-2xl font-bold text-green-600">5+</div>
                        <div className="text-sm text-gray-600">Years Experience</div>
                      </div>
                      <div className="bg-white rounded-lg p-4 shadow-md text-center">
                        <div className="text-2xl font-bold text-blue-600">500+</div>
                        <div className="text-sm text-gray-600">Happy Patients</div>
                      </div>
                      <div className="bg-white rounded-lg p-4 shadow-md text-center">
                        <div className="text-2xl font-bold text-purple-600">4.9</div>
                        <div className="text-sm text-gray-600">Rating</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Specializations */}
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                    <span className="text-3xl mr-3">🌿</span>
                    Specializations
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span className="text-gray-700">Panchakarma Therapy</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span className="text-gray-700">Herbal Medicine</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span className="text-gray-700">Stress Management</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span className="text-gray-700">Lifestyle Counseling</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                    <span className="text-3xl mr-3">🎓</span>
                    Education & Certifications
                  </h3>
                  <div className="space-y-4">
                    <div className="border-l-4 border-green-500 pl-4">
                      <h4 className="font-semibold text-gray-800">BAMS Degree</h4>
                      <p className="text-gray-600 text-sm">Bachelor of Ayurvedic Medicine</p>
                    </div>
                    <div className="border-l-4 border-blue-500 pl-4">
                      <h4 className="font-semibold text-gray-800">MD Ayurveda</h4>
                      <p className="text-gray-600 text-sm">Specialized in Panchakarma</p>
                    </div>
                    <div className="border-l-4 border-purple-500 pl-4">
                      <h4 className="font-semibold text-gray-800">Certified Practitioner</h4>
                      <p className="text-gray-600 text-sm">Traditional Ayurvedic Medicine</p>
                    </div>
                  </div>
                </div>
              </div>
              
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
              <Services doctor={doctor} />
            </div>
          )}
          {activeTab === 'clinic' && (
            <div className="w-full">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-gray-800 mb-4" style={{fontFamily: 'Playfair Display, serif'}}>Clinic Information</h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto" style={{fontFamily: 'Playfair Display, serif'}}>
                  Visit our clinic for professional healthcare services
                </p>
              </div>
              <ClinicInfo doctor={doctor} />
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





      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="w-full px-4 text-center">
          <h2 className="text-3xl font-bold mb-4" style={{fontFamily: 'Playfair Display, serif'}}>
            Ready to Book a Consultation?
          </h2>
          <p className="text-lg mb-8">Contact {doctor.name} directly to schedule your appointment</p>
          <div className="flex justify-center space-x-4">
            <a 
              href={`tel:${doctor.phone}`}
              className="bg-white text-green-600 px-6 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors shadow-lg"
            >
              📞 Call Now
            </a>
            <a 
              href={`mailto:${doctor.email}`}
              className="bg-white bg-opacity-20 text-white px-6 py-3 rounded-full font-medium hover:bg-opacity-30 transition-colors border border-white"
            >
              📧 Send Email
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DoctorProfile;