import React from 'react';

const Contact = ({ doctor }) => {
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold mb-6">Contact Information</h1>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Details */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Get in Touch</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600">📞</span>
                  </div>
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-gray-600">{doctor?.phone || '+94 77 123 4567'}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600">✉️</span>
                  </div>
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-gray-600">{doctor?.email || 'doctor@heallk.com'}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600">📍</span>
                  </div>
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-gray-600">{doctor?.address || 'Colombo, Sri Lanka'}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600">🕒</span>
                  </div>
                  <div>
                    <p className="font-medium">Working Hours</p>
                    <p className="text-gray-600">Mon - Fri: 9:00 AM - 6:00 PM</p>
                    <p className="text-gray-600">Sat: 9:00 AM - 2:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Appointment Form */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Book Appointment</h2>
              <form className="space-y-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full p-3 border rounded-lg"
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full p-3 border rounded-lg"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  className="w-full p-3 border rounded-lg"
                />
                <input
                  type="date"
                  className="w-full p-3 border rounded-lg"
                />
                <textarea
                  placeholder="Message (Optional)"
                  rows="4"
                  className="w-full p-3 border rounded-lg"
                ></textarea>
                <button
                  type="submit"
                  className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600"
                >
                  Book Appointment
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;