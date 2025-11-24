import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';
import ReviewSystem from '../Components/ReviewSystem';

const About = ({ doctor }) => {
  const [doctorData, setDoctorData] = useState(null);
  const [services, setServices] = useState([]);
  const [currentServiceIndex, setCurrentServiceIndex] = useState(0);

  useEffect(() => {
    fetchDoctorData();
    fetchServices();
  }, [doctor?.id]);

  const fetchDoctorData = async () => {
    try {
      // Fetch from your user table with description
      const response = await fetch(`${API_BASE_URL}/api/doctors/${doctor?.id || 1}`);
      const data = await response.json();
      if (data.success) {
        setDoctorData(data.doctor);
      }
    } catch (error) {
      console.error('Error fetching doctor data:', error);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/services/doctor/${doctor?.id || 1}`);
      const data = await response.json();
      if (data.success) {
        setServices(data.services);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    }
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

  return (
    <div className="space-y-8">
      {/* Section 1: About Me */}
      <div id="about" className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4">About Me</h2>
        <p className="text-gray-700 leading-relaxed">
          {doctorData?.description || doctor?.about || 'Experienced Ayurvedic doctor specializing in traditional healing methods and holistic wellness. Committed to providing personalized treatment plans for optimal health outcomes.'}
        </p>
      </div>

      {/* Section 2: Ready to Book a Consultation? */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-md p-8 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Book a Consultation?</h2>
        <p className="text-lg mb-6">Get personalized Ayurvedic treatment from Dr. {doctor?.name || 'John Doe'}</p>
        <button className="bg-white text-green-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">
          Book Now
        </button>
      </div>

      {/* Section 3: Our Services */}
      <div id="services" className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Our Services</h2>
          <div className="flex gap-2">
            <button 
              onClick={prevServices}
              className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"
            >
              ←
            </button>
            <button 
              onClick={nextServices}
              className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"
            >
              →
            </button>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {services.slice(currentServiceIndex, currentServiceIndex + 3).map((service, index) => (
            <div key={service.id || index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <h3 className="text-lg font-semibold text-green-600 mb-2">
                {service.name || `Service ${index + 1}`}
              </h3>
              <p className="text-gray-600 mb-3">
                {service.description || 'Professional healthcare service'}
              </p>
              <div className="text-xl font-bold text-gray-800">
                Rs. {service.price || '2,500'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 4: Clinic Information */}
      <div id="clinic" className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4">Clinic Information</h2>
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
        <h2 className="text-2xl font-semibold mb-4">Contact & Appointment</h2>
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
        <h2 className="text-2xl font-semibold mb-4">Patient Reviews</h2>
        <ReviewSystem doctorId={doctor?.id || 1} />
      </div>
    </div>
  );
};

export default About;