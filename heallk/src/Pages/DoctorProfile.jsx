import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import { API_BASE_URL } from '../config';

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
        <Navbar />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-200 border-t-green-500"></div>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen bg-green-50">
        <Navbar />
        <div className="text-center py-20">
          <h1 className="text-2xl font-bold text-gray-800">Doctor not found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50">
      <Navbar />
      
      {/* Professional Hero Section */}
      <section className="relative h-80 bg-gradient-to-br from-green-600 via-blue-600 to-indigo-700 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>
        
        {/* Medical Icons Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 text-white opacity-20 text-4xl">🏥</div>
          <div className="absolute top-20 right-20 text-white opacity-20 text-3xl">⚕️</div>
          <div className="absolute bottom-20 left-20 text-white opacity-20 text-3xl">🌿</div>
          <div className="absolute bottom-10 right-10 text-white opacity-20 text-4xl">💊</div>
          <div className="absolute top-1/2 left-1/4 text-white opacity-10 text-5xl">🩺</div>
          <div className="absolute top-1/3 right-1/3 text-white opacity-10 text-4xl">🧘</div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-6xl mx-auto px-4 w-full">
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
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                  <span className="text-white text-lg">✓</span>
                </div>
              </div>
              
              {/* Doctor Info */}
              <div className="text-white">
                <h1 className="text-4xl md:text-5xl font-bold mb-3 drop-shadow-lg" style={{fontFamily: 'Playfair Display, serif'}}>
                  {doctor.name}
                </h1>
                <p className="text-xl md:text-2xl text-green-100 mb-4 font-medium">
                  {doctor.role === 'admin' ? 'Senior Ayurveda Consultant' : 'Certified Ayurveda Specialist'}
                </p>
                <div className="flex flex-wrap gap-3 mb-4">
                  <span className="bg-white bg-opacity-20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium border border-white border-opacity-30">
                    ✓ Verified Professional
                  </span>
                  <span className="bg-white bg-opacity-20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium border border-white border-opacity-30">
                    📅 Since {new Date(doctor.joinedDate).getFullYear()}
                  </span>
                  {doctor.clinics.length > 0 && (
                    <span className="bg-white bg-opacity-20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium border border-white border-opacity-30">
                      🏥 {doctor.clinics.length} Clinic{doctor.clinics.length > 1 ? 's' : ''}
                    </span>
                  )}
                </div>
                <div className="flex gap-4">
                  <a 
                    href={`tel:${doctor.phone}`}
                    className="bg-white text-green-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
                  >
                    📞 Call Now
                  </a>
                  <a 
                    href={`mailto:${doctor.email}`}
                    className="bg-white bg-opacity-20 backdrop-blur-sm text-white px-6 py-3 rounded-full font-semibold hover:bg-opacity-30 transition-all duration-300 border border-white border-opacity-30 flex items-center gap-2"
                  >
                    📧 Email
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 w-full">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-16">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="#f0fdf4"></path>
          </svg>
        </div>
      </section>

      {/* Tabs Navigation */}
      <section className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-all duration-200 border-b-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600 bg-green-50'
                    : 'border-transparent text-gray-600 hover:text-green-600 hover:bg-gray-50'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
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