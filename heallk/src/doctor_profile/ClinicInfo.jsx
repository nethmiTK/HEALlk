import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

const ClinicInfo = ({ doctor }) => {
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (doctor?.id) {
      fetchClinicInfo();
    }
  }, [doctor?.id]);

  const fetchClinicInfo = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/public/doctors/${doctor.id}`);
      const data = await response.json();
      
      if (data.success && data.doctor.clinics) {
        setClinics(data.doctor.clinics);
      } else {
        setClinics([]);
      }
    } catch (error) {
      console.error('Error fetching clinic info:', error);
      setClinics([]);
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
    <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 lg:p-6">
      <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Clinic Information</h2>
      
      {clinics.length > 0 ? (
        <div className="space-y-6 sm:space-y-8">
          {clinics.map((clinic, index) => (
            <div key={index} className="border-b pb-4 sm:pb-6 last:border-b-0">
              <h3 className="text-lg sm:text-xl font-semibold text-green-600 mb-3 sm:mb-4">{clinic.name}</h3>
              
              <div className="grid md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                {/* Location & Hours */}
                <div>
                  <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Location & Contact</h4>
                  
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <span className="text-green-600 text-lg sm:text-xl">📍</span>
                      <div>
                        <p className="font-medium text-sm sm:text-base">Address</p>
                        <p className="text-gray-600 text-sm sm:text-base">{clinic.address}, {clinic.city}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2 sm:gap-3">
                      <span className="text-green-600 text-lg sm:text-xl">🕒</span>
                      <div>
                        <p className="font-medium text-sm sm:text-base">Working Hours</p>
                        <div className="text-gray-600 text-sm sm:text-base">
                          {clinic.workingHours && typeof clinic.workingHours === 'object' ? (
                            Object.entries(clinic.workingHours).map(([day, hours]) => (
                              <p key={day}>{day}: {String(hours)}</p>
                            ))
                          ) : (
                            <div className="space-y-1">
                              <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                              <p>Saturday: 9:00 AM - 2:00 PM</p>
                              <p>Sunday: Closed</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2 sm:gap-3">
                      <span className="text-green-600 text-lg sm:text-xl">📞</span>
                      <div>
                        <p className="font-medium text-sm sm:text-base">Contact</p>
                        <p className="text-gray-600 text-sm sm:text-base">{clinic.phone}</p>
                        {clinic.email && <p className="text-gray-600 text-sm sm:text-base">{clinic.email}</p>}
                        {clinic.website && (
                          <a href={clinic.website} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline text-sm sm:text-base">
                            🌐 Visit Website
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Facilities & Specializations */}
                <div>
                  {clinic.specializations && clinic.specializations.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold mb-4">Specializations</h4>
                      <div className="flex flex-wrap gap-2">
                        {clinic.specializations.map((spec, idx) => (
                          <span key={idx} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {clinic.facilities && clinic.facilities.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold mb-4">Facilities</h4>
                      <div className="grid grid-cols-1 gap-2">
                        {clinic.facilities.map((facility, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <span className="text-green-600">✅</span>
                            <span className="text-sm">{facility}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {clinic.description && (
                    <div className="mt-4">
                      <h4 className="text-lg font-semibold mb-2">About</h4>
                      <p className="text-gray-600">{clinic.description}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🏥</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No Clinic Information Available</h3>
          <p className="text-gray-500">Dr. {doctor?.name || 'Doctor'} hasn't added clinic information yet.</p>
        </div>
      )}
      
      {/* Payment Methods */}
      <div className="mt-8 pt-6 border-t">
        <h3 className="text-lg font-semibold mb-4">Payment Methods</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-2">
            <span className="text-green-600">💳</span>
            <span className="text-sm">Credit/Debit Cards</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-600">💰</span>
            <span className="text-sm">Cash</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-600">📱</span>
            <span className="text-sm">Mobile Banking</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-600">🏦</span>
            <span className="text-sm">Bank Transfer</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClinicInfo;