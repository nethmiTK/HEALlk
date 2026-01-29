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
        console.log('🔍 Services fetched:', data.services);
        console.log('📊 Service count:', data.services.length);
        data.services.forEach((s, i) => {
          console.log(`  Service ${i}: id=${s.id}, title=${s.title}, image=${s.image || 'NULL'}`);
        });
        setServices(data.services);
      } else {
        console.warn('API returned success=false:', data);
        setServices([]);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to construct full image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/')) {
      return `http://localhost:5000${imagePath}`;
    }
    return `http://localhost:5000/uploads/service/${imagePath}`;
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
    <div className="bg-white rounded-lg shadow-md p-3 sm:p-6">
      <div className="mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">Services Offered</h2>
        
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <div className="absolute right-3 top-2.5 text-gray-400">
            🔍
          </div>
        </div>
      </div>
      
      {filteredServices.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-3 sm:gap-6">
          {filteredServices.map((service) => (
            <div key={service.id} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow bg-white">
              {/* Service Image */}
              {service.image ? (
                <div className="relative h-40 sm:h-48 w-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                  <img 
                    src={getImageUrl(service.image)} 
                    alt={service.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      console.warn('Image failed to load:', getImageUrl(service.image));
                      e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><rect fill="%23e5e7eb" width="400" height="300"/><text x="200" y="150" font-size="80" text-anchor="middle" dominant-baseline="middle">📷</text></svg>';
                    }}
                  />
                </div>
              ) : null}
              
              {/* Service Content */}
              <div className="p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-1 sm:gap-0">
                  <h3 className="text-base sm:text-lg font-semibold text-green-600">{service.title || 'Service'}</h3>
                  <span className="text-lg sm:text-xl font-bold text-gray-800">LKR {service.price || '0'}</span>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-3">
                  <p className="text-sm text-gray-500">⏱️ {service.duration || 'N/A'}</p>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full w-fit">
                    {service.category || 'General'}
                  </span>
                </div>
                
                {service.service_for && (
                  <p className="text-sm text-blue-600 mb-2">
                    <strong>Service for:</strong> {service.service_for}
                  </p>
                )}
                
                <p className="text-sm text-gray-700 mb-4 line-clamp-2">{service.description || 'No description available'}</p>
                
                <div className="flex gap-2">
                  <button 
                    onClick={onBookNow}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 text-sm font-medium transition-colors flex-1"
                  >
                    Book Now
                  </button>
                  <button className="border border-green-500 text-green-500 px-4 py-2 rounded-lg hover:bg-green-50 text-sm font-medium transition-colors flex-1">
                    More Info
                  </button>
                </div>
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