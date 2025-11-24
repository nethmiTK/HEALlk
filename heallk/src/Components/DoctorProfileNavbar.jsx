import React from 'react';

const DoctorProfileNavbar = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'about', label: 'About' },
    { id: 'services', label: 'Services' },
    { id: 'clinic', label: 'Clinic Info' },
    { id: 'contact', label: 'Contact' },
    { id: 'reviews', label: 'Reviews' }
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-16 z-40">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default DoctorProfileNavbar;