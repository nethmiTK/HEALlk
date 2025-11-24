import React, { useState } from 'react';
import DoctorProfileNavbar from '../Components/DoctorProfileNavbar';
import About from './About';
import Services from './Services';
import ClinicInfo from './ClinicInfo';
import Contact from './Contact';
import ReviewSystem from '../Components/ReviewSystem';

const Home = ({ doctor }) => {
  const [activeTab, setActiveTab] = useState('about');

  const renderContent = () => {
    switch (activeTab) {
      case 'about':
        return <About doctor={doctor} />;
      case 'services':
        return <Services doctor={doctor} />;
      case 'clinic':
        return <ClinicInfo doctor={doctor} />;
      case 'contact':
        return <Contact doctor={doctor} />;
      case 'reviews':
        return <ReviewSystem doctorId={doctor?.id || 1} />;
      default:
        return <About doctor={doctor} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Doctor Info */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-3xl font-bold">Dr</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Dr. {doctor?.name || 'John Doe'}</h1>
              <p className="text-lg text-gray-600">{doctor?.specialization || 'Ayurvedic Specialist'}</p>
              <p className="text-gray-500">{doctor?.experience || '10+ years experience'}</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <DoctorProfileNavbar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Tab Content */}
        <div className="mt-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Home;