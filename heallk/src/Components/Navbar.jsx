import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import logoImage from '../assets/logo.png';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/doctors', label: 'Find Doctor' },
    { href: '/products', label: 'All Products' },
    { href: '/contact', label: 'Contact' },
  ];

  const handleNavClick = () => {
    window.scrollTo(0, 0);
    setMenuOpen(false);
  };

  // isActive must be defined outside .map() — never call hooks inside .map()
  const isActive = (href) =>
    href === '/' ? location.pathname === '/' : location.pathname.startsWith(href);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close drawer on route change
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <>
      {/* ══════════════════════════════════════════
          NAVBAR BAR  (design unchanged from original)
          ══════════════════════════════════════════ */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-lg backdrop-blur-sm' : 'bg-transparent'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <div className="flex items-center shrink-0">
              <Link to="/" className="flex items-center group" onClick={handleNavClick}>
                <motion.div
                  className="p-2"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <img
                    src={logoImage}
                    alt="HealLanka Logo"
                    className="h-12 w-auto transition-all duration-300 drop-shadow-lg"
                  />
                </motion.div>
              </Link>
            </div>

            {/* ── Desktop nav links ── */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                {navLinks.map((link) => {
                  const active = isActive(link.href);
                  return (
                    <Link
                      key={link.label}
                      to={link.href}
                      onClick={handleNavClick}
                      className={`relative px-5 py-2 rounded-md text-base font-medium transition-colors duration-200 ${scrolled
                        ? active ? 'text-green-700' : 'text-gray-700 hover:text-green-600'
                        : active ? 'text-green-200' : 'text-white hover:text-green-200'
                        }`}
                    >
                      {link.label}
                      {active && (
                        <motion.div
                          className={`absolute bottom-0 left-0 right-0 h-[3px] rounded-full ${scrolled ? 'bg-green-600' : 'bg-green-300'
                            }`}
                          layoutId="navbar-underline"
                          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* ── Desktop Register button ── */}
            <div className="hidden md:block">
              <Link
                to="/register"
                onClick={handleNavClick}
                className={`px-6 py-2 rounded-full text-base font-medium transition-all duration-200 ${scrolled
                  ? 'bg-green-600 text-white hover:bg-green-700 shadow-md'
                  : 'bg-white text-green-600 hover:bg-green-50 border border-green-200'
                  }`}
              >
                Register
              </Link>
            </div>

            {/* ── Mobile hamburger (animated 3 bars → ×) ── */}
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle navigation menu"
              aria-expanded={menuOpen}
              className={`md:hidden w-10 h-10 flex flex-col items-center justify-center gap-[5px] rounded-lg transition-colors touch-manipulation ${scrolled || menuOpen
                ? 'text-gray-700 hover:bg-gray-100'
                : 'text-white hover:bg-white/10'
                }`}
            >
              <motion.span
                animate={menuOpen ? { rotate: 45, y: 7.5 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.25 }}
                className={`block w-[22px] h-0.5 rounded-full ${scrolled || menuOpen ? 'bg-gray-700' : 'bg-white'}`}
              />
              <motion.span
                animate={menuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.18 }}
                className={`block w-[22px] h-0.5 rounded-full ${scrolled || menuOpen ? 'bg-gray-700' : 'bg-white'}`}
              />
              <motion.span
                animate={menuOpen ? { rotate: -45, y: -7.5 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.25 }}
                className={`block w-[22px] h-0.5 rounded-full ${scrolled || menuOpen ? 'bg-gray-700' : 'bg-white'}`}
              />
            </button>

          </div>
        </div>
      </nav>

      {/* ══════════════════════════════════════════
          LEFT-SIDE FULL-HEIGHT DRAWER  (mobile only)
          ══════════════════════════════════════════ */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Dark backdrop — tap anywhere to close */}
            <motion.div
              key="nav-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="fixed inset-0 bg-black/50 z-[55] md:hidden"
              onClick={() => setMenuOpen(false)}
            />

            {/* Drawer panel — slides in from left edge */}
            <motion.div
              key="nav-drawer"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="fixed top-0 left-0 bottom-0 w-4/5 max-w-xs z-[60] md:hidden bg-white flex flex-col shadow-2xl"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-5 h-16 border-b border-gray-100 flex-shrink-0">
                <Link to="/" onClick={handleNavClick}>
                  <img src={logoImage} alt="HealLanka" className="h-10 w-auto" />
                </Link>
                <button
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close menu"
                  className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Nav link list */}
              <div className="flex-1 overflow-y-auto px-4 py-5 space-y-1">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.06 + i * 0.05, duration: 0.22 }}
                  >
                    <Link
                      to={link.href}
                      onClick={handleNavClick}
                      className={`flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-150 border ${isActive(link.href)
                        ? 'bg-green-50 text-green-700 border-green-200'
                        : 'text-gray-700 hover:bg-gray-50 border-transparent hover:border-gray-100'
                        }`}
                    >
                      <span>{link.label}</span>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Register button pinned to bottom */}
              <div className="px-4 pb-8 pt-2 flex-shrink-0">
                <Link
                  to="/register"
                  onClick={handleNavClick}
                  className="flex items-center justify-center w-full py-3.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-sm font-bold transition-all shadow-lg shadow-green-200"
                >
                  Register
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
