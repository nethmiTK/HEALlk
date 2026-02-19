import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import logoImage from '../assets/logo.png';

const navItems = [
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Products', href: '#products' },
  { label: 'Clinic Info', href: '#clinic-info' },
  { label: 'Reviews', href: '#reviews' },
  { label: 'Blog', href: '#blog' },
  { label: 'Contact Me', href: '#contact' },
];

const DoctorProfileNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeHref, setActiveHref] = useState('');

  useEffect(() => {
    const update = () => setActiveHref(window.location.hash || '');
    update();
    window.addEventListener('hashchange', update);
    return () => window.removeEventListener('hashchange', update);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const handleClick = (href) => {
    setActiveHref(href);
    setMenuOpen(false);
    const el = document.getElementById(href.replace('#', ''));
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* ════════════════ NAVBAR BAR ════════════════ */}
      <nav className="bg-white shadow-md border border-blue-50 rounded-2xl mx-3 my-4 md:max-w-[1020px] md:mx-auto md:my-6 px-4 md:px-6 py-3 flex items-center justify-between gap-4 relative z-[100]">

        {/* Logo */}
        <img src={logoImage} alt="HealLanka" className="h-10 md:h-12 w-auto object-contain drop-shadow flex-shrink-0" />

        {/* ── Desktop tabs (hidden on mobile) ── */}
        <ul className="hidden md:flex flex-1 justify-center items-center gap-1 list-none m-0 p-0">
          {navItems.map((item) => {
            const active = activeHref === item.href;
            return (
              <li key={item.label}>
                <a
                  href={item.href}
                  onClick={(e) => { e.preventDefault(); handleClick(item.href); }}
                  className={`relative block px-3.5 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-all duration-200 no-underline ${active
                      ? 'text-[#0077b6] font-semibold bg-blue-50'
                      : 'text-gray-600 hover:text-[#0077b6] hover:bg-blue-50'
                    }`}
                >
                  {item.label}
                  {active && (
                    <motion.div
                      layoutId="doc-nav-underline"
                      className="absolute bottom-1 left-2 right-2 h-[2.5px] bg-[#0077b6] rounded-full"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </a>
              </li>
            );
          })}
        </ul>

        {/* ── Hamburger button (mobile only) ── */}
        <button
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          className="md:hidden flex flex-col items-center justify-center w-10 h-10 gap-[5px] rounded-xl bg-gray-50 hover:bg-blue-50 transition-colors flex-shrink-0 border-none cursor-pointer"
        >
          <motion.span
            animate={menuOpen ? { rotate: 45, y: 7.5 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.25 }}
            className="block w-[22px] h-[2.5px] bg-gray-700 rounded-full"
            style={{ transformOrigin: 'center' }}
          />
          <motion.span
            animate={menuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.18 }}
            className="block w-[22px] h-[2.5px] bg-gray-700 rounded-full"
          />
          <motion.span
            animate={menuOpen ? { rotate: -45, y: -7.5 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.25 }}
            className="block w-[22px] h-[2.5px] bg-gray-700 rounded-full"
            style={{ transformOrigin: 'center' }}
          />
        </button>
      </nav>

      {/* ════════════════ MOBILE MENU ════════════════ */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="dpn-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 bg-black/40 z-[150] md:hidden"
            />

            {/* Slide-down panel */}
            <motion.div
              key="dpn-panel"
              initial={{ y: '-100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '-100%', opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="fixed top-0 left-0 right-0 z-[160] md:hidden bg-white rounded-b-2xl shadow-2xl border-b border-blue-100 px-3 pt-4 pb-5 flex flex-col gap-1"
            >
              {/* Close button row */}
              <div className="flex items-center justify-between mb-2 px-1">
                <img src={logoImage} alt="HealLanka" className="h-9 w-auto" />
                <button
                  onClick={() => setMenuOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors border-none cursor-pointer"
                >
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Nav items */}
              {navItems.map((item, i) => {
                const active = activeHref === item.href;
                return (
                  <motion.a
                    key={item.label}
                    href={item.href}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.06 + i * 0.045, duration: 0.22 }}
                    onClick={(e) => { e.preventDefault(); handleClick(item.href); }}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium no-underline border transition-all duration-150 ${active
                        ? 'bg-blue-50 text-[#0077b6] font-semibold border-blue-200'
                        : 'text-gray-700 hover:bg-gray-50 border-transparent hover:border-gray-100'
                      }`}
                  >
                    <span>{item.label}</span>
                    {active && (
                      <svg className="w-4 h-4 text-[#0077b6] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </motion.a>
                );
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default DoctorProfileNavbar;
