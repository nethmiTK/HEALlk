import React from 'react';
import Navbar from '../Components/Navbar';

const Doctors = () => {
  return (
    <div className="min-h-screen bg-green-50">
      <Navbar />
      
      {/* Hero Section for Doctors Page */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6" style={{fontFamily: 'Playfair Display, serif'}}>
            Meet Our Expert Team
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Our certified Ayurvedic practitioners bring years of experience and dedication to your wellness journey
          </p>
        </div>
      </section>

      {/* Verified Ayurveda Doctors Section */}
      <section id="doctors" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4" style={{fontFamily: 'Playfair Display, serif'}}>
              Our Verified Ayurveda Doctors
            </h2>
            <div className="w-24 h-1 bg-green-500 mx-auto rounded-full mb-4"></div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Meet our team of certified and experienced Ayurvedic practitioners dedicated to your wellness journey
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Doctor 1 */}
            <div className="bg-green-50 p-8 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-green-200 hover:border-green-300">
              <div className="relative mb-6">
                <div className="w-32 h-32 mx-auto rounded-full overflow-hidden shadow-xl border-4 border-white">
                  <div className="w-full h-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                    <span className="text-4xl text-white font-bold">Dr</span>
                  </div>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-sm">✓</span>
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold mb-2 text-gray-800" style={{fontFamily: 'Playfair Display, serif'}}>Dr. Ayesha Perera</h3>
                <p className="text-green-600 font-medium mb-3">Senior Panchakarma Specialist</p>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  15+ years experience in traditional Ayurvedic treatments and Panchakarma therapy. Specialized in detox programs and stress management.
                </p>
                <div className="flex justify-center space-x-2 mb-4">
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">BAMS</span>
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">MD Ayurveda</span>
                </div>
                <div className="space-y-2 mb-4">
                  <p className="text-xs text-gray-500">Available: Mon-Fri 9AM-6PM</p>
                  <p className="text-xs text-gray-500">Languages: English, Sinhala, Tamil</p>
                </div>
                <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 w-full">
                  Book Appointment
                </button>
              </div>
            </div>

            {/* Doctor 2 */}
            <div className="bg-green-50 p-8 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-green-200 hover:border-green-300">
              <div className="relative mb-6">
                <div className="w-32 h-32 mx-auto rounded-full overflow-hidden shadow-xl border-4 border-white">
                  <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                    <span className="text-4xl text-white font-bold">Dr</span>
                  </div>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-sm">✓</span>
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold mb-2 text-gray-800" style={{fontFamily: 'Playfair Display, serif'}}>Dr. Rohan Silva</h3>
                <p className="text-green-600 font-medium mb-3">Herbal Medicine Expert</p>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  Specialized in traditional herbal formulations and natural wellness therapies. Expert in digestive disorders and immunity building.
                </p>
                <div className="flex justify-center space-x-2 mb-4">
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs">BAMS</span>
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs">PhD Ayurveda</span>
                </div>
                <div className="space-y-2 mb-4">
                  <p className="text-xs text-gray-500">Available: Tue-Sat 10AM-7PM</p>
                  <p className="text-xs text-gray-500">Languages: English, Sinhala</p>
                </div>
                <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 w-full">
                  Book Appointment
                </button>
              </div>
            </div>

            {/* Doctor 3 */}
            <div className="bg-green-50 p-8 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-green-200 hover:border-green-300">
              <div className="relative mb-6">
                <div className="w-32 h-32 mx-auto rounded-full overflow-hidden shadow-xl border-4 border-white">
                  <div className="w-full h-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                    <span className="text-4xl text-white font-bold">Dr</span>
                  </div>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-sm">✓</span>
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold mb-2 text-gray-800" style={{fontFamily: 'Playfair Display, serif'}}>Dr. Priya Fernando</h3>
                <p className="text-green-600 font-medium mb-3">Women & Child Wellness</p>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  Expert in Ayurvedic treatments for women's health and pediatric care. Specialized in pregnancy care and child development.
                </p>
                <div className="flex justify-center space-x-2 mb-4">
                  <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs">BAMS</span>
                  <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs">Certified</span>
                </div>
                <div className="space-y-2 mb-4">
                  <p className="text-xs text-gray-500">Available: Mon-Thu 9AM-5PM</p>
                  <p className="text-xs text-gray-500">Languages: English, Sinhala, Tamil</p>
                </div>
                <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 w-full">
                  Book Appointment
                </button>
              </div>
            </div>

            {/* Doctor 4 */}
            <div className="bg-green-50 p-8 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-green-200 hover:border-green-300">
              <div className="relative mb-6">
                <div className="w-32 h-32 mx-auto rounded-full overflow-hidden shadow-xl border-4 border-white">
                  <div className="w-full h-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                    <span className="text-4xl text-white font-bold">Dr</span>
                  </div>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-sm">✓</span>
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold mb-2 text-gray-800" style={{fontFamily: 'Playfair Display, serif'}}>Dr. Kasun Rajapaksha</h3>
                <p className="text-green-600 font-medium mb-3">Pain Management Specialist</p>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  Expert in Ayurvedic physiotherapy and pain relief treatments. Specialized in joint disorders and sports injuries.
                </p>
                <div className="flex justify-center space-x-2 mb-4">
                  <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs">BAMS</span>
                  <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs">Sports Medicine</span>
                </div>
                <div className="space-y-2 mb-4">
                  <p className="text-xs text-gray-500">Available: Wed-Sun 8AM-6PM</p>
                  <p className="text-xs text-gray-500">Languages: English, Sinhala</p>
                </div>
                <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 w-full">
                  Book Appointment
                </button>
              </div>
            </div>

            {/* Doctor 5 */}
            <div className="bg-green-50 p-8 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-green-200 hover:border-green-300">
              <div className="relative mb-6">
                <div className="w-32 h-32 mx-auto rounded-full overflow-hidden shadow-xl border-4 border-white">
                  <div className="w-full h-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center">
                    <span className="text-4xl text-white font-bold">Dr</span>
                  </div>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-sm">✓</span>
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold mb-2 text-gray-800" style={{fontFamily: 'Playfair Display, serif'}}>Dr. Nimal Wickramasinghe</h3>
                <p className="text-green-600 font-medium mb-3">Senior Consultation Expert</p>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  25+ years experience in Ayurvedic consultation and lifestyle counseling. Expert in chronic disease management.
                </p>
                <div className="flex justify-center space-x-2 mb-4">
                  <span className="bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-xs">BAMS</span>
                  <span className="bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-xs">Senior Consultant</span>
                </div>
                <div className="space-y-2 mb-4">
                  <p className="text-xs text-gray-500">Available: Mon-Fri 7AM-4PM</p>
                  <p className="text-xs text-gray-500">Languages: English, Sinhala, Tamil</p>
                </div>
                <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 w-full">
                  Book Appointment
                </button>
              </div>
            </div>

            {/* Doctor 6 */}
            <div className="bg-green-50 p-8 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-green-200 hover:border-green-300">
              <div className="relative mb-6">
                <div className="w-32 h-32 mx-auto rounded-full overflow-hidden shadow-xl border-4 border-white">
                  <div className="w-full h-full bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center">
                    <span className="text-4xl text-white font-bold">Dr</span>
                  </div>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-sm">✓</span>
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold mb-2 text-gray-800" style={{fontFamily: 'Playfair Display, serif'}}>Dr. Sanduni Amarasekara</h3>
                <p className="text-green-600 font-medium mb-3">Beauty & Wellness Expert</p>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  Specialized in Ayurvedic beauty treatments and skin care. Expert in anti-aging and natural cosmetic therapies.
                </p>
                <div className="flex justify-center space-x-2 mb-4">
                  <span className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-xs">BAMS</span>
                  <span className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-xs">Beauty Specialist</span>
                </div>
                <div className="space-y-2 mb-4">
                  <p className="text-xs text-gray-500">Available: Tue-Sat 9AM-6PM</p>
                  <p className="text-xs text-gray-500">Languages: English, Sinhala</p>
                </div>
                <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 w-full">
                  Book Appointment
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4" style={{fontFamily: 'Playfair Display, serif'}}>Ready to Begin Your Healing Journey?</h2>
          <p className="text-lg mb-8">Choose your preferred doctor and book your consultation today</p>
          <button className="bg-white text-green-600 px-8 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors shadow-lg">
            Book Now
          </button>
        </div>
      </section>
    </div>
  );
};

export default Doctors;