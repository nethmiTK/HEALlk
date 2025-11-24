import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import aboutImg from '../assets/about.png';

const DoctorProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('about');

  const tabs = [
    { id: 'about', label: '👤 About', icon: '👤' },
    { id: 'services', label: '⚕️ Services', icon: '⚕️' },
    { id: 'clinics', label: '🏥 Clinic Info', icon: '🏥' },
    { id: 'contact', label: '📞 Contact', icon: '📞' },
    { id: 'reviews', label: '⭐ Reviews', icon: '⭐' }
  ];

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
    <div className="min-h-screen bg-gray-50">
      {/* Portfolio Hero Section */}
      <section className="relative h-96 bg-gradient-to-br from-green-400 via-blue-500 to-indigo-600 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 opacity-20">
          <img src={aboutImg} alt="Medical Background" className="w-full h-full object-cover" />
        </div>
        
        {/* Doctor Profile Navbar */}
        <nav className="relative z-20 bg-transparent">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-center h-16">
              <div onClick={() => navigate('/')} className="flex items-center gap-2 cursor-pointer">
                <div className="w-10 h-10 bg-white bg-opacity-20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white border-opacity-30">
                  <span className="text-white font-bold text-lg">H</span>
                </div>
                <span className="text-xl font-bold text-white">HEALlk</span>
              </div>
              
              {/* Profile Tabs */}
              <div className="flex items-center space-x-6">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                      activeTab === tab.id
                        ? 'bg-white bg-opacity-20 backdrop-blur-sm text-white border border-white border-opacity-50'
                        : 'text-white hover:text-green-200 hover:bg-white hover:bg-opacity-10'
                    }`}
                  >
                    <span className="text-lg">{tab.icon}</span>
                    <span className="hidden sm:block">{tab.label.split(' ')[1]}</span>
                  </button>
                ))}
              </div>
              
              <button onClick={() => navigate('/register')} className="bg-white bg-opacity-20 backdrop-blur-sm border-2 border-white border-opacity-50 text-white px-6 py-2 rounded-full font-semibold hover:bg-white hover:text-green-600 transition-all duration-300">Register</button>
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
          <div className="max-w-7xl mx-auto px-4 w-full">
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
              <div className="text-white flex-1">
                <h1 className="text-4xl lg:text-5xl font-bold mb-2 drop-shadow-2xl" style={{fontFamily: 'Playfair Display, serif'}}>
                  {doctor.name.toUpperCase()}
                </h1>
                <p className="text-xl lg:text-2xl text-blue-100 mb-4 font-light">
                  {doctor.role === 'admin' ? 'Senior Ayurveda Consultant' : 'Certified Ayurveda Specialist'}
                </p>
                
                {/* Status Badges */}
                <div className="flex flex-wrap gap-3 mb-6">
                  <div className="bg-white bg-opacity-20 backdrop-blur-lg px-4 py-2 rounded-full border border-white border-opacity-30">
                    <span className="text-white font-medium text-sm">✓ Verified Professional</span>
                  </div>
                  <div className="bg-white bg-opacity-20 backdrop-blur-lg px-4 py-2 rounded-full border border-white border-opacity-30">
                    <span className="text-white font-medium text-sm">📅 Since {new Date(doctor.joinedDate).getFullYear()}</span>
                  </div>
                  {doctor.clinics.length > 0 && (
                    <div className="bg-white bg-opacity-20 backdrop-blur-lg px-4 py-2 rounded-full border border-white border-opacity-30">
                      <span className="text-white font-medium text-sm">🏥 {doctor.clinics.length} Clinic{doctor.clinics.length > 1 ? 's' : ''}</span>
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
                    className="bg-white bg-opacity-20 backdrop-blur-lg text-white px-5 py-2 rounded-full font-semibold hover:bg-opacity-30 transition-all duration-300 border border-white border-opacity-50 flex items-center gap-2 text-sm"
                  >
                    📧 Email
                  </a>
                  <a 
                    href={`https://wa.me/${doctor.phone.replace(/[^0-9]/g, '')}`}
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
      <section className="py-12 bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto px-4">
          {activeTab === 'about' && (
            <div className="space-y-8">
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">👤 About Dr. {doctor.name}</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-green-50 p-6 rounded-xl text-center">
                    <div className="text-3xl mb-3">📧</div>
                    <h3 className="font-semibold text-gray-800 mb-2">Email</h3>
                    <p className="text-gray-600">{doctor.email}</p>
                  </div>
                  <div className="bg-blue-50 p-6 rounded-xl text-center">
                    <div className="text-3xl mb-3">📞</div>
                    <h3 className="font-semibold text-gray-800 mb-2">Phone</h3>
                    <p className="text-gray-600">{doctor.phone}</p>
                  </div>
                  <div className="bg-purple-50 p-6 rounded-xl text-center">
                    <div className="text-3xl mb-3">🏥</div>
                    <h3 className="font-semibold text-gray-800 mb-2">Clinics</h3>
                    <p className="text-gray-600">{doctor.clinics.length} Location{doctor.clinics.length !== 1 ? 's' : ''}</p>
                  </div>
                </div>
              </div>
              
              {/* Qualifications */}
              {doctor.qualifications.length > 0 && (
                <div className="bg-white rounded-xl shadow-lg p-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-6">🎓 Qualifications & Education</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    {doctor.qualifications.map((qual, index) => (
                      <div key={qual.id} className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="text-lg font-bold text-gray-800">{qual.degreeName}</h4>
                          {qual.isVerified && (
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">✓ Verified</span>
                          )}
                        </div>
                        <p className="text-blue-600 font-medium mb-2">{qual.institution}</p>
                        <p className="text-gray-600 mb-2">{qual.specialization}</p>
                        <p className="text-sm text-gray-500 mb-3">Completed: {qual.yearCompleted}</p>
                        {qual.description && (
                          <p className="text-sm text-gray-600 leading-relaxed">{qual.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'services' && (
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">⚕️ Services Offered</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Sample services - you can make this dynamic later */}
                <div className="bg-green-50 p-6 rounded-xl">
                  <div className="text-2xl mb-3">🌿</div>
                  <h3 className="font-semibold text-gray-800 mb-2">Panchakarma Treatment</h3>
                  <p className="text-gray-600 text-sm">Traditional detoxification and rejuvenation therapy</p>
                </div>
                <div className="bg-blue-50 p-6 rounded-xl">
                  <div className="text-2xl mb-3">💊</div>
                  <h3 className="font-semibold text-gray-800 mb-2">Herbal Medicine</h3>
                  <p className="text-gray-600 text-sm">Natural herbal formulations for various conditions</p>
                </div>
                <div className="bg-purple-50 p-6 rounded-xl">
                  <div className="text-2xl mb-3">🧘</div>
                  <h3 className="font-semibold text-gray-800 mb-2">Wellness Consultation</h3>
                  <p className="text-gray-600 text-sm">Personalized health and lifestyle guidance</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'clinics' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">🏥 Clinic Locations</h2>
              {doctor.clinics.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-8">
                  {doctor.clinics.map((clinic, index) => (
                    <div key={clinic.id} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                      <h3 className="text-xl font-bold text-gray-800 mb-4">{clinic.name}</h3>
                      <div className="space-y-3 text-gray-600">
                        <div className="flex items-start gap-3">
                          <span className="text-blue-500">📍</span>
                          <div>
                            <p>{clinic.address}</p>
                            <p>{clinic.city}</p>
                          </div>
                        </div>
                        {clinic.phone && (
                          <div className="flex items-center gap-3">
                            <span className="text-green-500">📞</span>
                            <p>{clinic.phone}</p>
                          </div>
                        )}
                        {clinic.email && (
                          <div className="flex items-center gap-3">
                            <span className="text-purple-500">📧</span>
                            <p>{clinic.email}</p>
                          </div>
                        )}
                        
                        {clinic.specializations && clinic.specializations.length > 0 && (
                          <div className="mt-4">
                            <p className="font-semibold text-gray-700 mb-2">Specializations:</p>
                            <div className="flex flex-wrap gap-2">
                              {clinic.specializations.map(spec => (
                                <span key={spec} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                                  {spec}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {clinic.facilities && clinic.facilities.length > 0 && (
                          <div className="mt-4">
                            <p className="font-semibold text-gray-700 mb-2">Facilities:</p>
                            <div className="flex flex-wrap gap-2">
                              {clinic.facilities.map(facility => (
                                <span key={facility} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                  {facility}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {clinic.workingHours && (
                          <div className="mt-4">
                            <p className="font-semibold text-gray-700 mb-2">Working Hours:</p>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              {Object.entries(clinic.workingHours).map(([day, hours]) => (
                                <div key={day} className="flex justify-between">
                                  <span className="capitalize font-medium">{day}:</span>
                                  <span className={hours.isOpen ? 'text-green-600' : 'text-red-500'}>
                                    {hours.isOpen ? `${hours.open} - ${hours.close}` : 'Closed'}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                  <div className="text-4xl mb-4">🏥</div>
                  <p className="text-gray-600">No clinic information available</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">📞 Contact Information</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl">
                    <div className="text-2xl">📞</div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Phone</h3>
                      <p className="text-gray-600">{doctor.phone}</p>
                      <a href={`tel:${doctor.phone}`} className="text-green-600 hover:text-green-700 text-sm font-medium">
                        Call Now →
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl">
                    <div className="text-2xl">📧</div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Email</h3>
                      <p className="text-gray-600">{doctor.email}</p>
                      <a href={`mailto:${doctor.email}`} className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                        Send Email →
                      </a>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-xl">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">📅 Book Appointment</h3>
                  <p className="text-gray-600 mb-4">Ready to schedule a consultation? Contact Dr. {doctor.name} directly.</p>
                  <div className="space-y-3">
                    <a 
                      href={`tel:${doctor.phone}`}
                      className="block w-full bg-green-500 hover:bg-green-600 text-white text-center py-3 rounded-lg font-medium transition-colors"
                    >
                      📞 Call to Book
                    </a>
                    <a 
                      href={`mailto:${doctor.email}?subject=Appointment Request`}
                      className="block w-full bg-blue-500 hover:bg-blue-600 text-white text-center py-3 rounded-lg font-medium transition-colors"
                    >
                      📧 Email to Book
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">⭐ Patient Reviews</h2>
              <div className="text-center py-12">
                <div className="text-4xl mb-4">⭐</div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Reviews Coming Soon</h3>
                <p className="text-gray-600">Patient reviews and ratings will be available here.</p>
              </div>
            </div>
          )}
        </div>
      </section>



      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
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