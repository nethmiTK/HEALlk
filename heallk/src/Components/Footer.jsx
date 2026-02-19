import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-green-800 via-green-700 to-green-600 text-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
         <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
           <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-white text-green-600 px-4 py-2 rounded-lg font-bold text-xl">
                HELA LANKA
              </div>
            </div>
            <p className="text-green-100 leading-relaxed">
              Your trusted platform for connecting with verified Ayurvedic doctors and healthcare professionals across Sri Lanka.
            </p>
           
          </div>

           <div>
            <h3 className="font-semibold text-lg mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-green-100 hover:text-white transition-colors duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-green-100 hover:text-white transition-colors duration-200">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/doctors" className="text-green-100 hover:text-white transition-colors duration-200">
                  Find Doctor
                </Link>
              </li>
              <li>
                <Link to="/" className="text-green-100 hover:text-white transition-colors duration-200">
                  Specializations
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-green-100 hover:text-white transition-colors duration-200">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

           <div>
            <h3 className="font-semibold text-lg mb-4 text-white">Our Services</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-green-100 hover:text-white transition-colors duration-200">
                  Panchakarma Treatment
                </a>
              </li>
              <li>
                <a href="#" className="text-green-100 hover:text-white transition-colors duration-200">
                  Herbal Medicine
                </a>
              </li>
              <li>
                <a href="#" className="text-green-100 hover:text-white transition-colors duration-200">
                  Ayurvedic Consultation
                </a>
              </li>
              <li>
                <a href="#" className="text-green-100 hover:text-white transition-colors duration-200">
                  Beauty & Wellness
                </a>
              </li>
              <li>
                <a href="#" className="text-green-100 hover:text-white transition-colors duration-200">
                  Child Care
                </a>
              </li>
            </ul>
          </div>

           <div>
            <h3 className="font-semibold text-lg mb-4 text-white">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                 
                 
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="bg-green-600 p-2 rounded-full">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-green-100 text-sm">+94 76 747 2935</p>
                  <p className="text-green-100 text-xs">Mon - Sun, 8AM - 9PM</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="bg-green-600 p-2 rounded-full">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                </div>
                <p className="text-green-100 text-sm">https://codebuilder.it.com</p>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-green-600 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-green-100 text-sm">
              © 2025 HEALA LANKA. All rights reserved. Connecting you with trusted healthcare professionals.
            </div>
            <div className="flex space-x-6 text-sm">
              <Link to="/privacy-policy" className="text-green-100 hover:text-white transition-colors duration-200">
                Privacy Policy
              </Link>
              <Link to="/terms-of-service" className="text-green-100 hover:text-white transition-colors duration-200">
                Terms of Service
              </Link>
              <Link to="/cookie-policy" className="text-green-100 hover:text-white transition-colors duration-200">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
 
    </footer>
  );
};

export default Footer;
