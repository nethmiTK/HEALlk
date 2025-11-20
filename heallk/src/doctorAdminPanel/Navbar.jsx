import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Navigation from './Navigation';
import './AdminPanel.css';

const Navbar = ({ user }) => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    {
      path: '/doctor-admin',
      icon: '📊',
      label: 'Overview',
      exact: true,
      tooltip: 'Dashboard Overview - View your clinic statistics and recent activities'
    },
    {
      path: '/doctor-admin/profile',
      icon: '👤',
      label: 'Profile',
      tooltip: 'Profile Management - Edit your personal information and account settings'
    },
    {
      path: '/doctor-admin/services',
      icon: '⚕️',
      label: 'Services',
      tooltip: 'Medical Services - Manage the services you offer to patients'
    },
    {
      path: '/doctor-admin/qualifications',
      icon: '🎓',
      label: 'Qualifications',
      tooltip: 'Professional Qualifications - Display your medical degrees and certifications'
    },
    {
      path: '/doctor-admin/clinic-info',
      icon: '🏥',
      label: 'Clinic Info',
      tooltip: 'Clinic Information - Update clinic details, hours, and contact information'
    },
    {
      path: '/doctor-admin/reviews',
      icon: '⭐',
      label: 'Reviews',
      tooltip: 'Patient Reviews - View and respond to patient feedback and ratings'
    }
  ];

  const isActiveItem = (item) => {
    if (item.exact) {
      return location.pathname === item.path;
    }
    return location.pathname.startsWith(item.path);
  };

  return (
    <div className={`admin-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      {/* Sidebar Header */}
      <div className="sidebar-header">
        <div className="logo-section">
          {!isCollapsed && (
            <>
              <h2 className="logo-text">HEALlk</h2>
              <span className="logo-subtitle">Doctor Panel</span>
            </>
          )}
          {isCollapsed && <span className="logo-icon">H</span>}
        </div>
        <button 
          className="collapse-btn"
          onClick={() => setIsCollapsed(!isCollapsed)}
          title={isCollapsed ? 'Expand sidebar to show full navigation' : 'Collapse sidebar to save space'}
        >
          {isCollapsed ? '▶️' : '◀️'}
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="sidebar-nav">
        <ul className="nav-menu">
          {menuItems.map((item) => (
            <li key={item.path} className="nav-item">
              <Link
                to={item.path}
                className={`nav-link ${isActiveItem(item) ? 'active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                {!isCollapsed && <span className="nav-label">{item.label}</span>}
                {isActiveItem(item) && <div className="active-indicator"></div>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Navigation Section */}
      <Navigation user={user} isCollapsed={isCollapsed} />
    </div>
  );
};

export default Navbar;
