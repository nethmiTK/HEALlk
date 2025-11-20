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
      {/* User Section */}
      <div className="user-section">
        <div 
          className="user-info"
          onClick={() => setShowDropdown(!showDropdown)}
          style={{ cursor: 'pointer' }}
          {...(!isCollapsed && {
            title: `Click to view profile options - Dr. ${user?.name || 'Randula'} (${user?.email || 'admin@gmail.com'})`
          })}
        >
          <div className="user-avatar" {...(!isCollapsed && {
            title: `User: ${getUserInitials()} - Dr. ${user?.name || 'Randula'} | Email: ${user?.email || 'admin@gmail.com'}`
          })}>
            <span className="user-avatar-placeholder" {...(!isCollapsed && {
              title: "User Avatar showing initials - Click for more options"
            })}>
              {getUserInitials()}
            </span>
          </div>
          {!isCollapsed && (
            <div className="user-details">
              <div className="user-name" {...(!isCollapsed && {
                title: `Full Name: Dr. ${user?.name || 'Ms. Randula'} - Click to edit profile`
              })}>
                {user?.name || 'Ms. Randula'}
              </div>
              <div className="user-role" {...(!isCollapsed && {
                title: `Role: Doctor | Email: ${user?.email || 'admin@gmail.com'} - Professional medical practitioner`
              })}>
                Doctor
              </div>
            </div>
          )}
        </div>

        {/* User Dropdown Menu */}
        {showDropdown && (
          <div className="user-dropdown">
            <div 
              className="dropdown-item" 
              {...(!isCollapsed && {
                'data-tooltip-id': 'profile-settings-tooltip',
                'data-tooltip-content': 'Profile Settings - Edit personal information, change password, and manage account settings'
              })}
              onClick={() => {
                navigate('/doctor-admin/profile');
                setShowDropdown(false);
              }}
            >
              {!isCollapsed && <span>Profile Settings</span>}
              {isCollapsed && <span>Profile</span>}
            </div>
            <div 
              className="dropdown-item" 
              {...(!isCollapsed && {
                'data-tooltip-id': 'logout-dropdown-tooltip',
                'data-tooltip-content': 'Logout - Sign out safely and securely end your current session. You will be redirected to login page'
              })}
              onClick={() => {
                handleLogout();
                setShowDropdown(false);
              }}
            >
              {!isCollapsed && <span>Logout</span>}
              {isCollapsed && <span>Exit</span>}
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions - Logout Only */}
      <div className="quick-actions">
        <button 
          className="action-btn logout-btn" 
          {...(!isCollapsed && {
            'data-tooltip-id': 'logout-btn-tooltip',
            'data-tooltip-content': 'Logout - Sign out from your account'
          })}
          onClick={() => {
            handleLogout();
          }}
        >
          <span>🚪 {!isCollapsed ? 'Logout' : ''}</span>
        </button>
      </div>
      
      {/* Tooltips for Navigation - Only logout tooltip */}
      {!isCollapsed && (
        <>
          <Tooltip 
            id="profile-settings-tooltip" 
            place="top" 
            style={{ 
              backgroundColor: '#0f172a', 
              color: '#ffffff',
              fontSize: '12px',
              maxWidth: '250px'
            }}
          />
          <Tooltip 
            id="logout-dropdown-tooltip" 
            place="top" 
            style={{ 
              backgroundColor: '#0f172a', 
              color: '#ffffff',
              fontSize: '12px',
              maxWidth: '250px'
            }}
          />
          <Tooltip 
            id="logout-btn-tooltip" 
            place="top" 
            style={{ 
              backgroundColor: '#0f172a', 
              color: '#ffffff',
              fontSize: '12px',
              maxWidth: '200px'
            }}
          />
        </>
      )}
    </div>
  );
};

export default Navigation;