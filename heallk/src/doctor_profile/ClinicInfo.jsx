import React from 'react';

const ClinicInfo = ({ doctor }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-6">Clinic Information</h2>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Location & Hours */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Location & Hours</h3>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-green-600 text-xl">📍</span>
              <div>
                <p className="font-medium">Address</p>
                <p className="text-gray-600">
                  {doctor?.address || '123 Ayurveda Lane, Colombo 07, Sri Lanka'}
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <span className="text-green-600 text-xl">🕒</span>
              <div>
                <p className="font-medium">Working Hours</p>
                <div className="text-gray-600 space-y-1">
                  <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p>Saturday: 9:00 AM - 2:00 PM</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <span className="text-green-600 text-xl">📞</span>
              <div>
                <p className="font-medium">Contact</p>
                <p className="text-gray-600">{doctor?.phone || '+94 77 123 4567'}</p>
                <p className="text-gray-600">{doctor?.email || 'clinic@heallk.com'}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Facilities */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Facilities</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <span className="text-green-600">✅</span>
              <span className="text-sm">Air Conditioned</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600">✅</span>
              <span className="text-sm">Parking Available</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600">✅</span>
              <span className="text-sm">Wheelchair Access</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600">✅</span>
              <span className="text-sm">Online Booking</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600">✅</span>
              <span className="text-sm">Herbal Pharmacy</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600">✅</span>
              <span className="text-sm">Treatment Rooms</span>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold mb-4 mt-6">Payment Methods</h3>
          <div className="space-y-2">
            <p className="text-gray-600">💳 Credit/Debit Cards</p>
            <p className="text-gray-600">💰 Cash</p>
            <p className="text-gray-600">📱 Mobile Banking</p>
            <p className="text-gray-600">🏦 Bank Transfer</p>
          </div>
        </div>
      </div>
      
      {/* Map placeholder */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Location Map</h3>
        <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">🗺️ Interactive Map Coming Soon</p>
        </div>
      </div>
    </div>
  );
};

export default ClinicInfo;