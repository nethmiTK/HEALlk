import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReviewSystem from '../Components/ReviewSystem';
import aboutImg from '../assets/about.png';

const About = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [doctorData, setDoctorData] = useState(null);
  const [services, setServices] = useState([]);
  const [currentServiceIndex, setCurrentServiceIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDoctorProfile();
    fetchDoctorData();
  }, [id]);

  const loadDoctorProfile = async () => {
    // Using static data since backend is not available
    setDoctor({
      id: id,
      name: 'Dr. Sample Doctor',
      email: 'doctor@heallk.com',
      phone: '+94 77 123 4567',
      address: 'Colombo, Sri Lanka',
      description: 'Experienced Ayurvedic doctor specializing in traditional healing methods.',
      cover_photo: null // Will use gradient background
    });
    fetchServices(id);
    setLoading(false);
  };

  const fetchDoctorData = async () => {
    // Static data - no API call
    setDoctorData({
      description: 'Experienced Ayurvedic doctor specializing in traditional healing methods and holistic wellness.'
    });
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
      <section className="relative h-96 overflow-hidden pt-16">
        {/* Background Image */}
        <div className="absolute inset-0">
          {doctor?.cover_photo ? (
            <img src={doctor.cover_photo} alt="Doctor Cover" className="w-full h-full object-cover" />
          ) : (
            <img src={aboutImg} alt="Medical Background" className="w-full h-full object-cover" />
          )}
        </div>
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        <div className="absolute bottom-6 left-6 text-white">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{doctor?.name || 'Dr. Sample Doctor'}</h1>
          <p className="text-lg opacity-90">Ayurvedic Specialist</p>
        </div>
      </section>
      
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* About Me Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-2" style={{fontFamily: 'Playfair Display, serif'}}>About Me</h2>
          <div className="w-24 h-1 bg-green-500 mx-auto rounded-full"></div>
        </div>
        <div className="text-center">
          <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
            {doctorData?.description || doctor?.description || 'Experienced Ayurvedic doctor specializing in traditional healing methods and holistic wellness. Committed to providing personalized treatment plans for optimal health outcomes.'}
          </p>
        </div>
      </div>

      {/* Section 2: Ready to Book a Consultation? */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-md p-8 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Book a Consultation?</h2>
        <p className="text-lg mb-6">Get personalized Ayurvedic treatment from Dr. {doctor?.name || 'John Doe'}</p>
        <button 
          onClick={() => {
            const contactSection = document.getElementById('contact');
            if (contactSection) {
              contactSection.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          className="bg-white text-green-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
        >
          Contact Now
        </button>
      </div>

      {/* Section 3: Our Services */}
      <div id="services" className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2" style={{fontFamily: 'Playfair Display, serif'}}>Our Services</h2>
            <div className="w-24 h-1 bg-green-500 rounded-full"></div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={prevServices}
              className="w-10 h-10 bg-green-500 text-white rounded-full hover:bg-green-600 flex items-center justify-center font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              ‹
            </button>
            <button 
              onClick={nextServices}
              className="w-10 h-10 bg-green-500 text-white rounded-full hover:bg-green-600 flex items-center justify-center font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              ›
            </button>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {services.slice(currentServiceIndex, currentServiceIndex + 3).map((service, index) => (
            <div key={service.id || index} className="bg-gradient-to-br from-white to-green-50 border-2 border-green-100 rounded-xl p-6 hover:shadow-xl hover:border-green-300 transition-all duration-300 transform hover:-translate-y-2">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl">⚕️</span>
                </div>
                <span className="text-2xl font-bold text-green-600">Rs. {service.price || '2,500'}</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3" style={{fontFamily: 'Playfair Display, serif'}}>
                {service.title || service.name || `Service ${index + 1}`}
              </h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                {service.description || 'Professional healthcare service'}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">{service.duration || '30 mins'}</span>
                <button 
                  onClick={() => {
                    const servicesTab = document.querySelector('[data-tab="services"]');
                    if (servicesTab) {
                      servicesTab.click();
                    } else {
                      window.location.hash = 'services';
                    }
                  }}
                  className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-green-600 transition-colors"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 4: Clinic Information */}
      <div id="clinic" className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Clinic Information</h2>
          <div className="w-24 h-1 bg-green-500 rounded-full"></div>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
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
      <div id="contact" className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Contact & Appointment</h2>
          <div className="w-24 h-1 bg-green-500 rounded-full"></div>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
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