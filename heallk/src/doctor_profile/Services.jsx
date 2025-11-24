import React from 'react';

const Services = ({ doctor }) => {
  const services = [
    {
      name: 'General Consultation',
      price: 'Rs. 2,500',
      duration: '30 mins',
      description: 'Complete health assessment and treatment planning'
    },
    {
      name: 'Panchakarma Treatment',
      price: 'Rs. 15,000',
      duration: '7 days',
      description: 'Traditional detoxification and rejuvenation therapy'
    },
    {
      name: 'Herbal Medicine Consultation',
      price: 'Rs. 3,000',
      duration: '45 mins',
      description: 'Personalized herbal prescriptions and guidance'
    },
    {
      name: 'Lifestyle Counseling',
      price: 'Rs. 2,000',
      duration: '30 mins',
      description: 'Diet and lifestyle modifications for wellness'
    },
    {
      name: 'Stress Management',
      price: 'Rs. 2,500',
      duration: '45 mins',
      description: 'Ayurvedic approaches to stress and anxiety relief'
    },
    {
      name: 'Follow-up Consultation',
      price: 'Rs. 1,500',
      duration: '20 mins',
      description: 'Progress review and treatment adjustments'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-6">Services Offered</h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        {services.map((service, index) => (
          <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold text-green-600">{service.name}</h3>
              <span className="text-xl font-bold text-gray-800">{service.price}</span>
            </div>
            <p className="text-sm text-gray-500 mb-2">Duration: {service.duration}</p>
            <p className="text-gray-700">{service.description}</p>
            <button className="mt-3 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 text-sm">
              Book Now
            </button>
          </div>
        ))}
      </div>
      
      <div className="mt-8 p-4 bg-green-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Treatment Packages</h3>
        <p className="text-gray-700">
          Special packages available for comprehensive treatment programs. 
          Contact us for customized treatment plans and package pricing.
        </p>
      </div>
    </div>
  );
};

export default Services;