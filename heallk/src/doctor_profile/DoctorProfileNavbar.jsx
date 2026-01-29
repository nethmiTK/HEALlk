import React from 'react';
import './DoctorProfileNavbar.css';
import logoImage from '../assets/logo.png';

const navItems = [
  { label: 'About', href: 'about' },
  { label: 'Services', href: 'services' },
  { label: 'Products', href: 'products' },
  { label: 'Clinic Info', href: 'clinic-info' },
  { label: 'Reviews', href: 'reviews' },
  { label: 'Blog', href: 'blog' },
  { label: 'Contact Me', href: 'contact' },
];

const DoctorProfileNavbar = () => (
  <nav className="doctor-profile-navbar">
    <div className="navbar-logo">
      <img src={logoImage} alt="Ayurveda Logo" />
    </div>
    <ul>
      {navItems.map((item) => (
        <li key={item.label}>
          <a href={item.href}>{item.label}</a>
        </li>
      ))}
    </ul>
  </nav>
);

export default DoctorProfileNavbar;
