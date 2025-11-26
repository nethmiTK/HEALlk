import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReviewSystem from '../doctor_profile/ReviewSystem';
import aboutImg from '../assets/about.png';
import ServicesSection from '../doctor_profile/ServicesSection';
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
  useEffect(() => {
  const interval = setInterval(() => {
    nextServices();
  }, 8000);

  return () => clearInterval(interval);
}, [currentServiceIndex]);


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
    
      
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
       
      {/* Section 3: button */}

      <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-8 text-white text-center">
    <h2 className="text-3xl font-bold mb-4">Ready to Book a Consultation?</h2>
    <p className="text-lg mb-6">Get personalized Ayurvedic treatment from Dr. {doctor?.name || 'John Doe'}</p>
    <button
      onClick={() => {
        const contactSection = document.getElementById('contact');
        if (contactSection) contactSection.scrollIntoView({ behavior: 'smooth' });
      }}
      className="bg-white text-green-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
    >
      Contact Now
    </button>
             </div>
       </div>

{/* Section 3: Our Services */}
 
      <ServicesSection doctorId={doctor?.id} />

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