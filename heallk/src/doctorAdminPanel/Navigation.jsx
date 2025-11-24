import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Tooltip } from 'react-tooltip';

const Navigation = ({ user, isCollapsed }) => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (user) {
      const hasShownWelcome = sessionStorage.getItem('heallk_welcome_shown');
      
      if (!hasShownWelcome) {
        toast.success(`Welcome Dr. ${user.name || 'Randula'}! 🩺`, {
          position: "top-right",
          autoClose: 4000,
        });
        
        sessionStorage.setItem('heallk_welcome_shown', 'true');
      }
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('heallk_token');
      if (token) {
        await fetch('http://localhost:5000/api/auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('heallk_token');
      navigate('/login');
    }
  };

  const handleViewProfile = () => {
    const userId = user?.user_id;
    
    if (userId) {
      navigate(`/doctor-profile/${userId}`);
    } else {
      toast.error('User ID not available');
    }
  };

  const getUserInitials = () => {
    if (!user?.name) return 'R';
    const names = user.name.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    }
    return user.name[0].toUpperCase();
  };

  return (
    <div className="sidebar-footer">
      {/* Quick Actions - Profile View and Logout Buttons */}
      <div className="quick-actions">
        <button 
          className="action-btn profile-btn" 
          {...(isCollapsed && {
            'data-tooltip-id': 'profile-btn-tooltip',
            'data-tooltip-content': 'View My Public Profile'
          })}
          onClick={handleViewProfile}
        >
          {!isCollapsed ? (
            <>
              <span className="profile-icon">👤</span>
              <span className="profile-text">My Profile</span>
            </>
          ) : (
            <span className="profile-icon">👤</span>
          )}
        </button>
        
        <button 
          className="action-btn logout-btn professional-logout" 
          {...(isCollapsed && {
            'data-tooltip-id': 'logout-btn-tooltip',
            'data-tooltip-content': 'Sign Out - End your session securely'
          })}
          onClick={handleLogout}
        >
          {!isCollapsed ? (
            <>
              <span className="logout-icon">🚪</span>
              <span className="logout-text">Sign Out</span>
            </>
          ) : (
            <span className="logout-icon">🚪</span>
          )}
        </button>
      </div>
      
      {/* Tooltips for Navigation */}
      <>
        <Tooltip 
          id="profile-settings-tooltip" 
          place="top" 
          style={{ 
            backgroundColor: '#0A3D62', 
            color: '#ffffff',
            fontSize: '13px',
            fontWeight: '500',
            maxWidth: '260px',
            borderRadius: '8px',
            padding: '8px 12px'
          }}
        />
        <Tooltip 
          id="logout-dropdown-tooltip" 
          place="top" 
          style={{ 
            backgroundColor: '#0A3D62', 
            color: '#ffffff',
            fontSize: '13px',
            fontWeight: '500',
            maxWidth: '260px',
            borderRadius: '8px',
            padding: '8px 12px'
          }}
        />
        <Tooltip 
          id="profile-btn-tooltip" 
          place="top" 
          style={{ 
            backgroundColor: '#0A3D62', 
            color: '#ffffff',
            fontSize: '13px',
            fontWeight: '500',
            maxWidth: '220px',
            borderRadius: '8px',
            padding: '8px 12px'
          }}
        />
        <Tooltip 
          id="logout-btn-tooltip" 
          place="top" 
          style={{ 
            backgroundColor: '#0A3D62', 
            color: '#ffffff',
            fontSize: '13px',
            fontWeight: '500',
            maxWidth: '220px',
            borderRadius: '8px',
            padding: '8px 12px'
          }}
        />
      </>
    </div>
  );
};

export default Navigation;