import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import Contact from './Contact';
import logoImage from '../assets/logo.png';

const DoctorContactPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

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
    <div className="min-h-screen bg-gray-50 pt-16">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-white via-blue-50 to-white shadow-xl backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-2 sm:px-4">
          <div className="flex justify-between items-center h-16 sm:h-20">
            <div onClick={() => navigate('/')} className="flex items-center cursor-pointer group hover:opacity-80 transition-all duration-300">
              <img 
                src={logoImage} 
                alt="Ayurveda Logo" 
                className="h-12 sm:h-14 w-auto object-contain drop-shadow-md group-hover:drop-shadow-lg transition-all duration-300"
              />
            </div>
            <button 
              onClick={() => navigate(`/doctor-profile/${id}`)}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base rounded-full font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Back to Profile
            </button>
          </div>
        </div>
      </nav>
      
      <div className="max-w-6xl mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <Contact doctor={doctor} />
      </div>
    </div>
  );
};

export default DoctorContactPage;