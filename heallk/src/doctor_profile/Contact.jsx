import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { API_BASE_URL } from '../config';

const Contact = ({ doctor }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      toast.error('Name and phone number are required');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/contact/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          date: formData.date,
          message: formData.message,
          doctorId: doctor?.id
        })
      });

      const data = await response.json();
      if (data.success) {
        toast.success('✅ Appointment saved to database successfully!', {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        setFormData({ name: '', email: '', phone: '', date: '', message: '' });
      } else {
        toast.error(data.message || 'Failed to send appointment request');
      }
    } catch (error) {
      toast.error('Failed to send appointment request');
    } finally {
      setIsSubmitting(false);
    }
  };
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
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your Name *"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Your Email"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Phone Number *"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Message (Optional)"
                  rows="4"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                ></textarea>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Sending...' : 'Book Appointment'}
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