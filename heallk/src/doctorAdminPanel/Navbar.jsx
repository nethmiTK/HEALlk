import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Navigation from './Navigation';
import { Tooltip } from 'react-tooltip';


const Navbar = ({ user, isCollapsed, setIsCollapsed, onMouseEnter, onMouseLeave }) => {
  const location = useLocation();

  const menuItems = [
    {
      path: '/doctor-admin',
      label: 'Overview',
      icon: '📊',
      exact: true,
      tooltip: 'Dashboard Overview'
    },
    {
      path: '/doctor-admin/services',
      label: 'Services',
      icon: '🏥',
      tooltip: 'Medical Services'
    },
    {
      path: '/doctor-admin/qualifications',
      label: 'Qualifications',
      icon: '🎓',
      tooltip: 'Professional Qualifications'
    },
    {
      path: '/doctor-admin/clinic-info',
      label: 'Clinic Info',
      icon: '🏢',
      tooltip: 'Clinic Information'
    },
    {
      path: '/doctor-admin/reviews',
      label: 'Reviews',
      icon: '⭐',
      tooltip: 'Patient Reviews'
    },
    {
      path: '/doctor-admin/products',
      label: 'Products',
      icon: '💊',
      tooltip: 'Manage Products'
    }
  ];

  const isActiveItem = (item) => {
    if (item.exact) {
      return location.pathname === item.path;
    }
    return location.pathname.startsWith(item.path);
  };

  return (
    <div 
      className="fixed left-0 top-0 h-screen bg-gray-50 text-white flex flex-col shadow-lg z-50 w-[280px]"
    >
      {/* Sidebar Header */}
      <div className="p-5 border-b border-gray-200 flex items-center justify-center min-h-[80px]">
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-bold text-gray-800 m-0">HEALlk</h2>
          <span className="text-xs opacity-80 mt-0.5 text-gray-600">Doctor Panel</span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 py-5">
        <ul className="list-none p-0 m-0">
          {menuItems.map((item) => (
            <li key={item.path} className="mb-1">
              <Link
                to={item.path}
                className={`flex items-center gap-3 py-3 px-5 text-gray-600 no-underline transition-all duration-200 relative ${
                  isActiveItem(item) 
                    ? 'bg-blue-100 text-blue-900 font-medium' 
                    : 'hover:bg-gray-200 hover:text-blue-900'
                }`}
                onClick={() => {
                  // Close any open modals/forms when navigating
                  const closeButtons = document.querySelectorAll('[data-modal-close]');
                  closeButtons.forEach(btn => btn.click());
                }}
              >
                <span className="text-xl flex items-center justify-center w-6 h-6">{item.icon}</span>
                <span className="text-sm font-medium">{item.label}</span>
                {isActiveItem(item) && <div className="absolute right-0 top-0 bottom-0 w-1 bg-blue-900"></div>}
              </Link>
            </li>
          ))}
        </ul>

      </nav>

      {/* User Navigation Section */}
      <Navigation user={user} isCollapsed={false} />
    </div>
  );
};

export default Navbar;
