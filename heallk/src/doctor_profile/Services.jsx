import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

const Services = ({ doctor, onBookNow }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredServices, setFilteredServices] = useState([]);

  useEffect(() => {
    if (doctor?.id) {
      fetchServices();
    }
  }, [doctor?.id]);

  useEffect(() => {
    const filtered = services.filter(service =>
      (service.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (service.category || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (service.description || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredServices(filtered);
  }, [services, searchTerm]);

  const fetchServices = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/public/services/doctor/${doctor.id}`);
      const data = await response.json();
      
      if (data.success) {
        setServices(data.services);
      } else {
        setServices([]);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-green-200 border-t-green-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Services Offered</h2>
        
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search services by name, category, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <div className="absolute right-3 top-2.5 text-gray-400">
            🔍
          </div>
        </div>
      </div>
      
      {filteredServices.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-6">
          {filteredServices.map((service) => (
            <div key={service.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-green-600">{service.title || 'Service'}</h3>
                <span className="text-xl font-bold text-gray-800">Rs. {service.price || '0'}</span>
              </div>
              <div className="flex items-center gap-4 mb-2">
                <p className="text-sm text-gray-500">Duration: {service.duration || 'N/A'}</p>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                  {service.category || 'General'}
                </span>
              </div>
              {service.service_for && (
                <p className="text-sm text-blue-600 mb-2">
                  <strong>Service for:</strong> {service.service_for}
                </p>
              )}
              <p className="text-gray-700 mb-3">{service.description || 'No description available'}</p>
              <div className="flex gap-2">
                <button 
                  onClick={onBookNow}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 text-sm"
                >
                  Book Now
                </button>
                <button className="border border-green-500 text-green-500 px-4 py-2 rounded hover:bg-green-50 text-sm">
                  More Info
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🏥</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            {searchTerm ? 'No services found' : 'No Services Available'}
          </h3>
          <p className="text-gray-500">
            {searchTerm 
              ? `No services match "${searchTerm}". Try a different search term.`
              : `Dr. ${doctor?.name || 'Doctor'} hasn't added any services yet.`
            }
          </p>
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="mt-3 text-green-600 hover:text-green-800"
            >
              Clear search
            </button>
          )}
        </div>
      )}
      
      {filteredServices.length > 0 && (
        <div className="mt-8 p-4 bg-green-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Treatment Packages</h3>
          <p className="text-gray-700">
            Special packages available for comprehensive treatment programs. 
            Contact Dr. {doctor?.name || 'us'} for customized treatment plans and package pricing.
          </p>
        </div>
      )}
    </div>
  );
};

export default Services;