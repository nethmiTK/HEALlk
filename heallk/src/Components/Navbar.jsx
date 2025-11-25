import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import logoImage from '../assets/logo.png';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/doctors', label: 'Find Doctor' },
    { href: '/contact', label: 'Contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-white shadow-lg backdrop-blur-sm' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
           
          <div className="flex items-center">
            <div className="shrink-0">
              <Link to="/" className="flex items-center group">
                <div className="p-2">
                  <img 
                    src={logoImage} 
                    alt="HEALlk Logo" 
                    className="h-10 w-auto transition-all duration-300 group-hover:scale-105 brightness-100 drop-shadow-lg"
                  />
                </div>
              </Link>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    scrolled
                      ? 'text-gray-700 hover:text-green-600 hover:bg-green-50'
                      : 'text-white hover:text-green-200 hover:bg-white/10'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* REGISTER Button */}
          <div className="hidden md:block">
            <Link
              to="/register"
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                scrolled
                  ? 'bg-green-600 text-white hover:bg-green-700 shadow-md'
                  : 'bg-white text-green-600 hover:bg-green-50 border border-green-200'
              }`}
            >
              Register
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={`p-3 rounded-md transition-colors touch-manipulation ${
                scrolled ? 'text-gray-600 hover:bg-gray-100' : 'text-white hover:bg-white/10'
              }`}
              aria-label="Toggle navigation menu"
              aria-expanded={menuOpen}
            >
              <svg
                className="h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200 shadow-lg max-h-screen overflow-y-auto">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="block px-4 py-3 rounded-md text-base font-medium text-gray-700 hover:text-green-600 hover:bg-green-50 transition-colors touch-manipulation"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/register"
              className="block px-4 py-3 mt-4 bg-green-600 text-white text-center rounded-md font-medium hover:bg-green-700 transition-colors touch-manipulation"
              onClick={() => setMenuOpen(false)}
            >
              Register
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;


