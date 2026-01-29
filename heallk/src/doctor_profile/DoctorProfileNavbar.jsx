import React from 'react';
import './DoctorProfileNavbar.css';

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
