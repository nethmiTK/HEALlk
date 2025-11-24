import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import NavBarTitle from './NavBarTitle';
import Overview from './Overview';
import Profile from './Profile';
import Services from './Services';
import Qualifications from './Qualifications';
import ClinicForm from './ClinicForm';
import Reviews from './Reviews';
import Product from './Product';
import './AdminPanel.css';

const DoctorAdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [autoToggleEnabled, setAutoToggleEnabled] = useState(true);
  const navigate = useNavigate();

  // Auto-toggle functionality
  const handleMouseEnterSidebar = () => {
    if (isCollapsed) {
      setIsCollapsed(false);
    }
  };

  const handleMouseLeaveSidebar = () => {
    if (!isCollapsed) {
      // Add a small delay before auto-collapsing
      setTimeout(() => {
        setIsCollapsed(true);
      }, 800);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Require authentication to access admin panel
        const token = localStorage.getItem('heallk_token');
        if (!token) {
          navigate('/login');
          return;
        }

        // If authenticated, fetch user profile
        try {
          const response = await fetch('http://localhost:5000/api/auth/profile', {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
          
          const profileResponse = await response.json();
          
          if (response.ok && profileResponse.success && profileResponse.user) {
            setUser(profileResponse.user);
            
            // Check if user is a doctor (optional role check)
            if (profileResponse.user.role && profileResponse.user.role !== 'doctor') {
              // For testing, allow non-doctors as well
              console.log('Non-doctor user accessing admin panel');
            }
          } else {
            throw new Error(profileResponse.message || 'Profile fetch failed');
          }
        } catch (profileError) {
          console.error('Profile fetch failed:', profileError);
          navigate('/login');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="loading-container">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading doctor panel...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="admin-dashboard"
      onMouseMove={(e) => {
        // Check if mouse is near left edge
        if (e.clientX < 100 && isCollapsed) {
          setIsCollapsed(false);
        } else if (e.clientX > 300 && !isCollapsed) {
          setTimeout(() => setIsCollapsed(true), 500);
        }
      }}
    >
      <NavBarTitle 
        user={user} 
        isCollapsed={isCollapsed}
      />
      <Navbar 
        user={user} 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed}
        onMouseEnter={handleMouseEnterSidebar}
        onMouseLeave={handleMouseLeaveSidebar}
      />
      <main className={`admin-main-content ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
        <div className="content-wrapper">
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/services" element={<Services />} />
            <Route path="/qualifications" element={<Qualifications />} />
            <Route path="/clinic-info" element={<ClinicForm />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/products" element={<Product />} />
            {/* Redirect any unknown routes to overview */}
            <Route path="*" element={<Navigate to="/doctor-admin" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default DoctorAdminDashboard;