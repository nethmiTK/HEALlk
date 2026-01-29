import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DoctorProfileNavbar from './DoctorProfileNavbar';
import { useParams, useNavigate } from 'react-router-dom';
import ReviewSystem from '../doctor_profile/ReviewSystem';
import aboutImg from '../assets/about.png';
import ServicesSection from '../doctor_profile/ServicesSection';
import { API_BASE_URL } from '../config';

const About = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [doctorData, setDoctorData] = useState(null);
  const [qualifications, setQualifications] = useState([]);
  const [services, setServices] = useState([]);
  const [currentServiceIndex, setCurrentServiceIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDoctorProfile();
  }, [name]);
  useEffect(() => {
  const interval = setInterval(() => {
    nextServices();
  }, 8000);

  return () => clearInterval(interval);
}, [currentServiceIndex]);


  const loadDoctorProfile = async () => {
    try {
      // Fetch doctor by name instead of id
      const response = await fetch(`${API_BASE_URL}/public/doctors/name/${encodeURIComponent(name)}`);
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
        setQualifications(data.doctor.qualifications || []);
        setDoctorData({
          description: data.doctor.description || 'Experienced Ayurvedic doctor specializing in traditional healing methods.'
        });
      } else {
        setDoctor({
          id: name,
          name: 'Dr. Sample Doctor',
          email: 'doctor@heallk.com',
          phone: '+94 77 123 4567',
          address: 'Colombo, Sri Lanka',
          description: 'Experienced Ayurvedic doctor specializing in traditional healing methods.',
          cover_photo: null
        });
      }
      fetchServices(name);
      setLoading(false);
    } catch (error) {
      console.error('Error loading doctor profile:', error);
      setDoctor({
        id: name,
        name: 'Dr. Sample Doctor',
        email: 'doctor@heallk.com',
        phone: '+94 77 123 4567',
        address: 'Colombo, Sri Lanka',
        description: 'Experienced Ayurvedic doctor specializing in traditional healing methods.',
        cover_photo: null
      });
      fetchServices(name);
      setLoading(false);
    }
  };

  const fetchServices = async (doctorId) => {
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
    <>
      <DoctorProfileNavbar />
      <div className="min-h-screen bg-gray-50">
    
      
      <div className="max-w-6xl mx-auto px-2 sm:px-4 py-4 sm:py-8 space-y-4 sm:space-y-8">
       
      {/* Education & Certifications Section */}
      {qualifications.length > 0 && (
        <motion.div 
          className="bg-white rounded-lg shadow-md p-4 sm:p-6 lg:p-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-4 sm:mb-6">
            <motion.h2 
              className="text-2xl sm:text-3xl font-semibold mb-2"
              initial={{ x: -30, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              🎓 Education & Certifications
            </motion.h2>
            <motion.div 
              className="w-20 sm:w-28 h-1 bg-green-500 rounded-full"
              initial={{ width: 0 }}
              whileInView={{ width: 112 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            ></motion.div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {qualifications.map((qualification, index) => (
              <motion.div
                key={qualification.id || index}
                className="flex items-start gap-4 p-4 border border-gray-100 rounded-lg hover:shadow-lg transition-shadow bg-white"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="flex-shrink-0 mt-1">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-green-50 text-green-600 font-semibold text-sm">
                    {qualification.institution ? qualification.institution.charAt(0).toUpperCase() : '🎓'}
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                      {qualification.degreeName}
                    </h3>
                    {qualification.isVerified && (
                      <span className="ml-2 inline-flex items-center px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                        ✓ Verified
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-green-600 font-medium mt-1">{qualification.institution}</p>
                  {qualification.specialization && (
                    <p className="text-gray-600 mt-1 text-sm">
                      <span className="font-medium">Specialization:</span> {qualification.specialization}
                    </p>
                  )}
                  {qualification.description && (
                    <p className="text-gray-600 mt-2 text-sm">{qualification.description}</p>
                  )}
                </div>

                <div className="ml-4 text-right hidden sm:block">
                  <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    {qualification.yearCompleted}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Section 3: button */}
      <motion.div 
        className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 sm:p-6 lg:p-8 text-white text-center">
              <motion.h2 
                className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 sm:mb-4"
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Ready to Book a Consultation?
              </motion.h2>
              <motion.p 
                className="text-sm sm:text-base lg:text-lg mb-4 sm:mb-6"
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Get personalized Ayurvedic treatment from Dr. {doctor?.name || 'John Doe'}
              </motion.p>
              <motion.button
                onClick={() => {
                  const contactSection = document.getElementById('contact');
                  if (contactSection) contactSection.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-white text-green-600 px-4 sm:px-6 lg:px-8 py-2 sm:py-3 text-sm sm:text-base rounded-full font-semibold hover:bg-gray-100 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Contact Now
              </motion.button>
             </div>
       </motion.div>

      {/* Section 3: Our Services */}
 
      <ServicesSection doctorId={doctor?.id} />

      {/* Section 4: Clinic Information */}
      <motion.div 
        id="clinic" 
        className="bg-white rounded-lg shadow-md p-3 sm:p-4 lg:p-6"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="mb-4 sm:mb-6">
          <motion.h2 
            className="text-xl sm:text-2xl font-semibold mb-2"
            initial={{ x: -30, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Clinic Information
          </motion.h2>
          <motion.div 
            className="w-16 sm:w-24 h-1 bg-green-500 rounded-full"
            initial={{ width: 0 }}
            whileInView={{ width: 96 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
          ></motion.div>
        </div>
        <motion.div 
          className="grid md:grid-cols-2 gap-4 sm:gap-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
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
        </motion.div>
      </motion.div>

      {/* Contact Section */}
      <motion.div 
        id="contact" 
        className="bg-white rounded-lg shadow-md p-3 sm:p-4 lg:p-6"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="mb-4 sm:mb-6">
          <motion.h2 
            className="text-xl sm:text-2xl font-semibold mb-2"
            initial={{ x: -30, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Contact & Appointment
          </motion.h2>
          <motion.div 
            className="w-16 sm:w-24 h-1 bg-green-500 rounded-full"
            initial={{ width: 0 }}
            whileInView={{ width: 96 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
          ></motion.div>
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
      </motion.div>

      {/* Section 5: Reviews */}
      <motion.div 
        id="reviews" 
        className="bg-white rounded-lg shadow-md p-6"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="mb-6">
          <motion.h2 
            className="text-2xl font-semibold mb-2"
            initial={{ x: -30, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Patient Reviews
          </motion.h2>
          <motion.div 
            className="w-24 h-1 bg-green-500 rounded-full"
            initial={{ width: 0 }}
            whileInView={{ width: 96 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
          ></motion.div>
        </div>
        <ReviewSystem doctorId={doctor?.id || 1} />
      </motion.div>
      </div>
    </div>
    </>
  );
};

export default About;