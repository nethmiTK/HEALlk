import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';

const NavBarTitle = ({ user, pageName, isCollapsed }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const getPageInfo = () => {
    const path = location.pathname;

    switch (path) {
      case '/doctor-admin':
        return {
          title: 'Dashboard Overview',
          subtitle: 'View your clinic statistics and recent activities'
        };
      case '/doctor-admin/profile':
        return {
          title: 'My Profile',
          subtitle: 'Manage your account information and settings'
        };
      case '/doctor-admin/services':
        return {
          title: 'Medical Services',
          subtitle: 'Manage the services you offer to patients'
        };
      case '/doctor-admin/qualifications':
        return {
          title: 'Qualifications',
          subtitle: 'Display your medical degrees and certifications'
        };
      case '/doctor-admin/clinic-info':
        return {
          title: 'Clinic Information',
          subtitle: 'Update clinic details and contact information'
        };
      case '/doctor-admin/reviews':
        return {
          title: 'Patient Reviews',
          subtitle: 'View and respond to patient feedback'
        };
      default:
        return {
          title: pageName || 'Dashboard',
          subtitle: 'Manage your account information and settings'
        };
    }
  };

  const pageInfo = getPageInfo();
  const getUserInitials = () => {
    if (!user?.full_name) return 'R';
    const names = user.full_name.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    }
    return user.full_name[0].toUpperCase();
  };

  const formatUserName = () => {
    if (!user?.full_name) return 'Ms. Randula';
    return user.full_name;
  };

  return (
    <div className={`navbar-title-container ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
      <div className="navbar-title-content">
        {/* Page Title Section - Now on the left */}
        <div className="navbar-page-section">
          <h2 className="navbar-page-title">
            {pageInfo.title}
          </h2>
          <p className="navbar-page-subtitle">
            {pageInfo.subtitle}
          </p>
        </div>

        {/* User Profile Section - Now on the right */}
        <div className="navbar-user-section">
          <div className="navbar-user-info">
            <h3
              className="navbar-user-name"
              onClick={() => navigate('/doctor-admin/profile')}
            >
              Dr. {formatUserName()}
            </h3>
            <span className="navbar-user-email">
              {user?.email || 'admin@gmail.com'}
            </span>
          </div>

          <div
            className="navbar-user-avatar"
            onClick={() => navigate('/doctor-admin/profile')}
          >
            {user?.profile_pic ? (
              <img
                src={user.profile_pic}
                alt="Profile"
                className="navbar-profile-image"
              />
            ) : (
              <span className="navbar-avatar-initials">
                {getUserInitials()}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Removed tooltips for cleaner interaction */}
    </div>
  );
};

export default NavBarTitle;
