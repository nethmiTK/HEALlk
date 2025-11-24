import React from 'react';
import { useNavigate } from 'react-router-dom';

const DoctorNavbar = ({ doctor }) => {
  const navigate = useNavigate();

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">H</span>
            </div>
            <span className="text-xl font-bold text-gray-800">HEALlk</span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => navigate('/')}
              className="text-gray-600 hover:text-green-600 font-medium transition-colors"
            >
              Home
            </button>
            <a href="#about" className="text-gray-600 hover:text-green-600 font-medium transition-colors">
              About
            </a>
            <a href="#services" className="text-gray-600 hover:text-green-600 font-medium transition-colors">
              Services
            </a>
            <a href="#clinics" className="text-gray-600 hover:text-green-600 font-medium transition-colors">
              Find Doctor
            </a>
            <a href="#contact" className="text-gray-600 hover:text-green-600 font-medium transition-colors">
              Contact
            </a>
          </div>

          {/* Register Button */}
          <button 
            onClick={() => navigate('/register')}
            className="bg-white border-2 border-green-500 text-green-600 px-6 py-2 rounded-full font-semibold hover:bg-green-500 hover:text-white transition-all duration-300"
          >
            Register
          </button>
        </div>
      </div>
    </nav>
  );
};

export default DoctorNavbar;