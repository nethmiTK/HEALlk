import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReviewSystem from '../doctor_profile/ReviewSystem';
import aboutImg from '../assets/about.png';
import ServicesSection from '../doctor_profile/ServicesSection';
import { API_BASE_URL } from '../config';

const About = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [doctorData, setDoctorData] = useState(null);
  const [qualifications, setQualifications] = useState([]);
  const [services, setServices] = useState([]);
  const [currentServiceIndex, setCurrentServiceIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDoctorProfile();
  }, [id]);
  useEffect(() => {
  const interval = setInterval(() => {
    nextServices();
  }, 8000);

  return () => clearInterval(interval);
}, [currentServiceIndex]);


  const loadDoctorProfile = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/public/doctors/${id}`);
      const data = await response.json();
      
      if (data.success && data.doctor) {
        setDoctor({
          id: data.doctor.id,
          name: data.doctor.name,
          email: data.doctor.email,
          phone: data.doctor.phone,
          address: data.doctor.clinics[0]?.address || 'N/A',
          description: data.doctor.description || 'Experienced Ayurvedic doctor',
          cover_photo: data.doctor.profilePic
        });
        
        // Set qualifications
        setQualifications(data.doctor.qualifications || []);
        
        // Set doctor data
        setDoctorData({
          description: data.doctor.description || 'Experienced Ayurvedic doctor specializing in traditional healing methods.'
        });
      } else {
        // Fallback to static data
        setDoctor({
          id: id,
          name: 'Dr. Sample Doctor',
          email: 'doctor@heallk.com',
          phone: '+94 77 123 4567',
          address: 'Colombo, Sri Lanka',
          description: 'Experienced Ayurvedic doctor specializing in traditional healing methods.',
          cover_photo: null
        });
      }
      
      fetchServices(id);
      setLoading(false);
    } catch (error) {
      console.error('Error loading doctor profile:', error);
      // Fallback to static data
      setDoctor({
        id: id,
        name: 'Dr. Sample Doctor',
        email: 'doctor@heallk.com',
        phone: '+94 77 123 4567',
        address: 'Colombo, Sri Lanka',
        description: 'Experienced Ayurvedic doctor specializing in traditional healing methods.',
        cover_photo: null
      });
      fetchServices(id);
      setLoading(false);
    }
  };

  const fetchServices = async (doctorId) => {
    // Using fallback data until backend is ready
    setServices([
      { id: 1, title: 'Consultation', description: 'General health consultation', price: '2500', duration: '30 mins' },
      { id: 2, title: 'Treatment', description: 'Ayurvedic treatment', price: '3500', duration: '45 mins' },
      { id: 3, title: 'Therapy', description: 'Specialized therapy', price: '4000', duration: '60 mins' }
    ]);
  };

  const nextServices = () => {
    setCurrentServiceIndex((prev) => 
      prev + 3 >= services.length ? 0 : prev + 3
    );
  };

  const prevServices = () => {
    setCurrentServiceIndex((prev) => 
      prev - 3 < 0 ? Math.max(0, services.length - 3) : prev - 3
    );
  };

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
    
      
      <div className="max-w-6xl mx-auto px-2 sm:px-4 py-4 sm:py-8 space-y-4 sm:space-y-8">
       
      {/* Education & Certifications Section */}
      {qualifications.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 lg:p-6">
          <div className="mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-semibold mb-2">🎓 Education & Certifications</h2>
            <div className="w-16 sm:w-24 h-1 bg-green-500 rounded-full"></div>
          </div>
          <div className="space-y-4 sm:space-y-6">
            {qualifications.map((qualification, index) => (
              <div key={qualification.id || index} className="border-l-4 border-green-500 pl-3 sm:pl-4 py-2">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-0">
                  <div className="flex-1">
                    <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-800">
                      {qualification.degreeName}
                      {qualification.isVerified && (
                        <span className="ml-2 inline-flex items-center px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                          ✓ Verified
                        </span>
                      )}
                    </h3>
                    <p className="text-green-600 font-medium mt-1">{qualification.institution}</p>
                    {qualification.specialization && (
                      <p className="text-gray-600 mt-1">
                        <span className="font-medium">Specialization:</span> {qualification.specialization}
                      </p>
                    )}
                    {qualification.description && (
                      <p className="text-gray-600 mt-2">{qualification.description}</p>
                    )}
                  </div>
                  <div className="ml-4 text-right">
                    <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                      {qualification.yearCompleted}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section 3: button */}

      <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 sm:p-6 lg:p-8 text-white text-center">
    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 sm:mb-4">Ready to Book a Consultation?</h2>
    <p className="text-sm sm:text-base lg:text-lg mb-4 sm:mb-6">Get personalized Ayurvedic treatment from Dr. {doctor?.name || 'John Doe'}</p>
    <button
      onClick={() => {
        const contactSection = document.getElementById('contact');
        if (contactSection) contactSection.scrollIntoView({ behavior: 'smooth' });
      }}
      className="bg-white text-green-600 px-4 sm:px-6 lg:px-8 py-2 sm:py-3 text-sm sm:text-base rounded-full font-semibold hover:bg-gray-100 transition-colors"
    >
      Contact Now
    </button>
             </div>
       </div>

{/* Section 3: Our Services */}
 
      <ServicesSection doctorId={doctor?.id} />

      {/* Section 4: Clinic Information */}
      <div id="clinic" className="bg-white rounded-lg shadow-md p-3 sm:p-4 lg:p-6">
        <div className="mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold mb-2">Clinic Information</h2>
          <div className="w-16 sm:w-24 h-1 bg-green-500 rounded-full"></div>
        </div>
        <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-green-600 text-xl">📍</span>
              <div>
                <p className="font-medium">Address</p>
                <p className="text-gray-600">{doctor?.address || 'Colombo, Sri Lanka'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-green-600 text-xl">📞</span>
              <div>
                <p className="font-medium">Phone</p>
                <p className="text-gray-600">{doctor?.phone || '+94 77 123 4567'}</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-green-600 text-xl">🕒</span>
              <div>
                <p className="font-medium">Working Hours</p>
                <p className="text-gray-600">Mon - Fri: 9:00 AM - 6:00 PM</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-green-600 text-xl">✉️</span>
              <div>
                <p className="font-medium">Email</p>
                <p className="text-gray-600">{doctor?.email || 'doctor@heallk.com'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div id="contact" className="bg-white rounded-lg shadow-md p-3 sm:p-4 lg:p-6">
        <div className="mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold mb-2">Contact & Appointment</h2>
          <div className="w-16 sm:w-24 h-1 bg-green-500 rounded-full"></div>
        </div>
        <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <h3 className="text-lg font-medium mb-3">Book Appointment</h3>
            <form className="space-y-4">
              <input type="text" placeholder="Your Name" className="w-full p-3 border rounded-lg" />
              <input type="email" placeholder="Email" className="w-full p-3 border rounded-lg" />
              <input type="tel" placeholder="Phone" className="w-full p-3 border rounded-lg" />
              <input type="date" className="w-full p-3 border rounded-lg" />
              <textarea placeholder="Message" rows="3" className="w-full p-3 border rounded-lg"></textarea>
              <button className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700">
                Book Appointment
              </button>
            </form>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-3">Quick Contact</h3>
            <div className="space-y-3">
              <p className="flex items-center gap-2">
                <span className="text-green-600">📞</span> {doctor?.phone || '+94 77 123 4567'}
              </p>
              <p className="flex items-center gap-2">
                <span className="text-green-600">✉️</span> {doctor?.email || 'doctor@heallk.com'}
              </p>
              <p className="flex items-center gap-2">
                <span className="text-green-600">📍</span> {doctor?.address || 'Colombo, Sri Lanka'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Section 5: Reviews */}
      <div id="reviews" className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Patient Reviews</h2>
          <div className="w-24 h-1 bg-green-500 rounded-full"></div>
        </div>
        <ReviewSystem doctorId={doctor?.id || 1} />
      </div>
    </div>
    </div>
  );
};

export default About;