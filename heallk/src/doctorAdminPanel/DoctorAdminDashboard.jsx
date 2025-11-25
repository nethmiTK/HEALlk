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
import ProductTest from './ProductTest';



const DoctorAdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [autoToggleEnabled, setAutoToggleEnabled] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  // Toggle functionality
  const handleMouseEnterSidebar = () => {};
  const handleMouseLeaveSidebar = () => {};

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
            
            // Allow all authenticated users for now
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
      <div className="min-h-screen w-full bg-cyan-50 font-sans">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading doctor panel...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full bg-cyan-50 font-sans">

      <NavBarTitle 
        user={user} 
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />
      <Navbar 
        user={user} 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed}
        onMouseEnter={handleMouseEnterSidebar}
        onMouseLeave={handleMouseLeaveSidebar}
      />
      <main className={`min-h-screen pt-[70px] transition-all duration-300 ${
        isCollapsed ? 'ml-20' : 'ml-[280px]'
      }`}>
        <div className="w-full ${isModalOpen ? 'pointer-events-none' : ''}">
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/services" element={<Services />} />
            <Route path="/qualifications" element={<Qualifications />} />
            <Route path="/clinic-info" element={<ClinicForm />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/products" element={<ProductTest />} />
            {/* Redirect any unknown routes to overview */}
            <Route path="*" element={<Navigate to="/doctor-admin" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default DoctorAdminDashboard;