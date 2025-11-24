import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Navigation from './Navigation';
import { Tooltip } from 'react-tooltip';
import './AdminPanel.css';

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
      className={`admin-sidebar ${isCollapsed ? 'collapsed' : ''}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Sidebar Header */}
      <div className="sidebar-header">
        <div className="logo-section">
          {!isCollapsed && (
            <>
              <h2 className="logo-text">HEALlk</h2>
              <span className="logo-subtitle">Doctor Panel</span>
            </>
          )}
          {isCollapsed && (
            <div className="logo-collapsed">
              <span className="logo-icon">🏥</span>
              <span className="logo-text-small">HEALlk</span>
            </div>
          )}
        </div>
        <button 
          className="collapse-btn"
          onClick={() => setIsCollapsed(!isCollapsed)}
          data-tooltip-id="sidebar-toggle-tooltip"
          data-tooltip-content={isCollapsed ? 'Expand sidebar to show full navigation' : 'Collapse sidebar to save space'}
        >
          <span className="toggle-icon">
            {isCollapsed ? '⮞' : '⮜'}
          </span>
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
                {...(isCollapsed && {
                  'data-tooltip-id': `nav-tooltip-${item.label.toLowerCase().replace(' ', '-')}`,
                  'data-tooltip-content': item.tooltip
                })}
              >
                {!isCollapsed && <span className="nav-label">{item.label}</span>}
                {isCollapsed && <span className="nav-label-collapsed">{item.icon}</span>}
                {isActiveItem(item) && <div className="active-indicator"></div>}
              </Link>
            </li>
          ))}
        </ul>
        
        {/* Navigation Tooltips - Only show when collapsed */}
        {isCollapsed && menuItems.map((item) => (
          <Tooltip 
            key={`tooltip-${item.label}`}
            id={`nav-tooltip-${item.label.toLowerCase().replace(' ', '-')}`}
            place="right" 
            style={{ 
              backgroundColor: '#0A3D62', 
              color: '#ffffff',
              fontSize: '13px',
              fontWeight: '500',
              maxWidth: '220px',
              zIndex: 9999,
              borderRadius: '8px',
              padding: '8px 12px'
            }}
          />
        ))}
        
        {/* Sidebar Toggle Tooltip */}
        <Tooltip 
          id="sidebar-toggle-tooltip" 
          place="right" 
          style={{ 
            backgroundColor: '#0A3D62', 
            color: '#ffffff',
            fontSize: '13px',
            fontWeight: '500',
            maxWidth: '220px',
            zIndex: 9999,
            borderRadius: '8px',
            padding: '8px 12px'
          }}
        />
      </nav>

      {/* User Navigation Section */}
      <Navigation user={user} isCollapsed={isCollapsed} />
    </div>
  );
};

export default Navbar;
