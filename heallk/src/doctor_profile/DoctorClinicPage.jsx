import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import ClinicInfo from './ClinicInfo';

const DoctorClinicPage = () => {
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
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-green-400 via-blue-500 to-indigo-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-2 sm:px-4">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div onClick={() => navigate('/')} className="flex items-center gap-1 sm:gap-2 cursor-pointer">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white bg-opacity-20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white border-opacity-30">
                <span className="text-white font-bold text-base sm:text-lg">H</span>
              </div>
              <span className="text-lg sm:text-xl font-bold text-white">HEALlk</span>
            </div>
            <button 
              onClick={() => navigate(`/doctor-profile/${id}`)}
              className="bg-white bg-opacity-20 backdrop-blur-sm border-2 border-white border-opacity-50 text-white px-3 py-1.5 sm:px-6 sm:py-2 rounded-full text-sm sm:text-base font-semibold hover:bg-white hover:text-green-600 transition-all duration-300"
            >
              Back to Profile
            </button>
          </div>
        </div>
      </nav>
      
      <div className="max-w-6xl mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <ClinicInfo doctor={doctor} />
      </div>
    </div>
  );
};

export default DoctorClinicPage;