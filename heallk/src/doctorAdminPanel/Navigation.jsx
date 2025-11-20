import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Navigation = ({ user, isCollapsed }) => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  // Show notification only on first login
  useEffect(() => {
    if (user) {
      const hasShownWelcome = sessionStorage.getItem('heallk_welcome_shown');
      
      if (!hasShownWelcome) {
        toast.success(`Welcome Dr. ${user.name || 'Randula'}! 🩺`, {
          position: "top-right",
          autoClose: 4000,
        });
        
        // Mark welcome as shown for this session
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
          title={`Click to view profile options - Dr. ${user?.name || 'Randula'} (${user?.email || 'admin@gmail.com'})`}
        >
          <div className="user-avatar" title={`User: ${getUserInitials()} - Dr. ${user?.name || 'Randula'} | Email: ${user?.email || 'admin@gmail.com'}`}>
            <span className="user-avatar-placeholder" title="User Avatar showing initials - Click for more options">
              {getUserInitials()}
            </span>
          </div>
          {!isCollapsed && (
            <div className="user-details">
              <div className="user-name" title={`Full Name: Dr. ${user?.name || 'Ms. Randula'} - Click to edit profile`}>
                {user?.name || 'Ms. Randula'}
              </div>
              <div className="user-role" title={`Role: Doctor | Email: ${user?.email || 'admin@gmail.com'} - Professional medical practitioner`}>
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
              title="Profile Settings - Edit personal information, change password, and manage account settings"
              onClick={() => {
                navigate('/doctor-admin/profile');
                toast.info('Opening Profile Settings', { autoClose: 2000 });
                setShowDropdown(false);
              }}
            >
              <span className="dropdown-icon" title="Profile Settings Icon - 👤 | Navigate to profile management page">👤</span>
              {!isCollapsed && <span>Profile Settings</span>}
            </div>
            <div 
              className="dropdown-item" 
              title="Logout - Sign out safely and securely end your current session. You will be redirected to login page"
              onClick={() => {
                toast.success('Logging out...', { autoClose: 1000 });
                setTimeout(handleLogout, 1000);
                setShowDropdown(false);
              }}
            >
              <span className="dropdown-icon" title="Logout Icon - 🚪 | End your session and return to login">🚪</span>
              {!isCollapsed && <span>Logout</span>}
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions - Always Visible */}
      <div className="quick-actions">
        <button 
          className="action-btn" 
          title="Profile Settings - Manage your account settings and personal information"
          onClick={() => {
            navigate('/doctor-admin/profile');
            toast.info('Opening Profile Settings', { autoClose: 2000 });
          }}
        >
          <span title="Settings Icon - ⚙️">⚙️</span>
        </button>
        <button 
          className="action-btn" 
          title="Help & Support - Get assistance, documentation and customer support"
          onClick={() => {
            toast.info('Help & Support - Coming Soon!', { autoClose: 2000 });
          }}
        >
          <span title="Help Icon - ❓">❓</span>
        </button>
        <button 
          className="action-btn logout-btn" 
          title="Logout - Sign out from your account and end your session securely"
          onClick={() => {
            toast.success('Logging out...', { autoClose: 1000 });
            setTimeout(handleLogout, 1000);
          }}
        >
          <span title="Logout Icon - 🚪">🚪</span>
        </button>
      </div>
    </div>
  );
};

export default Navigation;