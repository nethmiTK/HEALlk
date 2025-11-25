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
    <div className="p-5 border-t border-gray-200">
      {/* Quick Actions - Profile View and Logout Buttons */}
      <div className="flex flex-col gap-2 p-4 border-t border-white border-opacity-10 justify-center">
        <button 
          className={`flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-semibold rounded-lg transition-all duration-200 min-h-[40px] bg-gradient-to-r from-blue-500 to-blue-700 border border-white border-opacity-20 text-white cursor-pointer z-50 relative hover:from-blue-700 hover:to-blue-800 hover:-translate-y-0.5 hover:shadow-lg ${
            isCollapsed ? 'w-14 px-2.5 justify-center' : 'w-full'
          }`}
          {...(isCollapsed && {
            'data-tooltip-id': 'profile-btn-tooltip',
            'data-tooltip-content': 'View My Public Profile'
          })}
          onClick={handleViewProfile}
        >
          {!isCollapsed ? (
            <>
              <span className="text-base flex items-center justify-center">👤</span>
              <span className="text-sm font-semibold tracking-wide">My Profile</span>
            </>
          ) : (
            <span className="text-base flex items-center justify-center">👤</span>
          )}
        </button>
        
        <button 
          className={`flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-semibold rounded-lg transition-all duration-200 min-h-[40px] bg-gradient-to-r from-red-500 to-red-600 border border-transparent text-white shadow-md cursor-pointer z-50 relative hover:from-red-600 hover:to-red-700 hover:-translate-y-0.5 hover:shadow-lg ${
            isCollapsed ? 'w-14 px-2.5 justify-center' : 'w-full'
          }`}
          {...(isCollapsed && {
            'data-tooltip-id': 'logout-btn-tooltip',
            'data-tooltip-content': 'Sign Out - End your session securely'
          })}
          onClick={handleLogout}
        >
          {!isCollapsed ? (
            <>
              <span className="text-base flex items-center justify-center">🚪</span>
              <span className="text-sm font-semibold tracking-wide">Sign Out</span>
            </>
          ) : (
            <span className="text-base flex items-center justify-center">🚪</span>
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