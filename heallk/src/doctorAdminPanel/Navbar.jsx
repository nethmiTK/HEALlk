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
      tooltip: 'Dashboard'
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
      tooltip: '  Qualifications'
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
      tooltip: 'Reviews'
    },
    {
      path: '/doctor-admin/products',
      label: 'Products',
      icon: '💊',
      tooltip: 'Products'
    },
    {
      path: '/doctor-admin/appointments',
      label: 'Appointments',
      icon: '📅',
      tooltip: 'Appointments'
    },
    {
      path: '/doctor-admin/profile',
      label: 'Profile',
      icon: '👤',
      tooltip: 'Profile'
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
      className={`fixed left-0 top-0 h-screen bg-gray-50 text-white flex flex-col shadow-lg z-50 transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-[280px]'
      }`}
      onMouseEnter={() => isCollapsed && setIsCollapsed(false)}
      onMouseLeave={() => !isCollapsed && setIsCollapsed(true)}
    >
      {/* Sidebar Header */}
      <div className="p-5 border-b border-gray-200 flex items-center justify-between min-h-[80px]">
        <div className="flex flex-col items-center">
          {!isCollapsed && (
            <>
              <h2 className="text-2xl font-bold text-gray-800 m-0">HEALlk</h2>
              <span className="text-xs opacity-80 mt-0.5 text-gray-600">Doctor Panel</span>
            </>
          )}
          {isCollapsed && (
            <span className="text-xl font-bold text-gray-800">🏥</span>
          )}
        </div>
        <button 
          className="bg-gray-200 border-none text-gray-800 w-8 h-8 rounded-md cursor-pointer flex items-center justify-center transition-all duration-200 hover:bg-gray-300 hover:scale-105"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <span className="text-base font-bold">
            ⮜
          </span>
        </button>
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
                    ? 'bg-green-100 text-green-900 font-medium' 
                    : 'hover:bg-gray-200 hover:text-green-900'
                }`}
                onClick={() => {
                  console.log('Navigating to:', item.path);
                  // Close any open modals/forms when navigating
                  const closeButtons = document.querySelectorAll('[data-modal-close]');
                  closeButtons.forEach(btn => btn.click());
                }}
              >
                <span className="text-xl flex items-center justify-center w-6 h-6">{item.icon}</span>
                {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
                {isActiveItem(item) && <div className="absolute right-0 top-0 bottom-0 w-1 bg-green-900"></div>}
              </Link>
            </li>
          ))}
        </ul>

      </nav>
      <Navigation user={user} isCollapsed={isCollapsed} />
    </div>
  );
};

export default Navbar;
