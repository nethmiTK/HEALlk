import React, { useState, useEffect } from 'react';

const Overview = () => {
  const [stats, setStats] = useState({
    totalAppointments: 0,
    todayAppointments: 0,
    totalPatients: 0,
    reviews: 0,
    rating: 4.8,
    services: 0,
    products: 0,
    qualifications: 0,
    clinics: 0
  });

  const [recentActivity, setRecentActivity] = useState([
    { id: 1, type: 'appointment', message: 'New appointment with John Doe', time: '2 hours ago' },
    { id: 2, type: 'review', message: 'New 5-star review received', time: '5 hours ago' },
    { id: 3, type: 'patient', message: 'New patient registration: Jane Smith', time: '1 day ago' }
  ]);

  const [quickActions] = useState([
    { id: 1, title: 'View Appointments', icon: '📅', path: '/doctor-admin/appointments' },
    { id: 2, title: 'Manage Services', icon: '⚕️', path: '/doctor-admin/services' },
    { id: 3, title: 'Update Profile', icon: '👤', path: '/doctor-admin/profile' },
    { id: 4, title: 'View Analytics', icon: '📊', path: '/doctor-admin/analytics' }
  ]);

  useEffect(() => {
    // Fetch dashboard stats
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('heallk_token');
        
        // Fetch all stats from different endpoints
        const [servicesRes, productsRes, qualificationsRes, reviewsRes, clinicsRes] = await Promise.all([
          fetch('http://localhost:5000/api/services', { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch('http://localhost:5000/api/products', { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch('http://localhost:5000/api/qualifications', { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch('http://localhost:5000/api/reviews/statistics', { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch('http://localhost:5000/api/clinics', { headers: { 'Authorization': `Bearer ${token}` } })
        ]);

        const services = servicesRes.ok ? await servicesRes.json() : { services: [] };
        const products = productsRes.ok ? await productsRes.json() : { products: [] };
        const qualifications = qualificationsRes.ok ? await qualificationsRes.json() : { qualifications: [] };
        const reviews = reviewsRes.ok ? await reviewsRes.json() : { statistics: { total_reviews: 0, average_rating: 0 } };
        const clinics = clinicsRes.ok ? await clinicsRes.json() : { clinics: [] };

        setStats({
          totalAppointments: 142,
          todayAppointments: 8,
          totalPatients: 89,
          reviews: reviews.statistics?.total_reviews || 0,
          rating: reviews.statistics?.average_rating || 0,
          services: services.services?.length || 0,
          products: products.products?.length || 0,
          qualifications: qualifications.qualifications?.length || 0,
          clinics: clinics.clinics?.length || 0
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        // Set default values on error
        setStats({
          totalAppointments: 0,
          todayAppointments: 0,
          totalPatients: 0,
          reviews: 0,
          rating: 0,
          services: 0,
          products: 0,
          qualifications: 0,
          clinics: 0
        });
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="bg-green-50 min-h-screen p-2 sm:p-4 lg:p-6">
      {/* Page Header */}
      <div className="mb-4 sm:mb-6 lg:mb-8">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-1 sm:mb-2">Dashboard Overview</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
        <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-lg shadow-md border border-gray-200">
          <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-600 mb-1 sm:mb-2">{stats.services}</div>
          <div className="text-xs sm:text-sm text-gray-600 font-medium">Total Services</div>
        </div>

        <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-lg shadow-md border border-gray-200">
          <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-600 mb-1 sm:mb-2">{stats.products}</div>
          <div className="text-xs sm:text-sm text-gray-600 font-medium">Products</div>
        </div>

        <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-lg shadow-md border border-gray-200">
          <div className="text-3xl font-bold text-purple-600 mb-2">{stats.qualifications}</div>
          <div className="text-sm text-gray-600 font-medium">Qualifications</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="text-3xl font-bold text-orange-600 mb-2">{stats.clinics}</div>
          <div className="text-sm text-gray-600 font-medium">Clinics</div>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="text-3xl font-bold text-red-600 mb-2">{stats.reviews}</div>
          <div className="text-sm text-gray-600 font-medium">Total Reviews</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="text-3xl font-bold text-yellow-600 mb-2">{Number(stats.rating).toFixed(1)}</div>
          <div className="text-sm text-gray-600 font-medium">Average Rating</div>
        </div>
 

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="text-3xl font-bold text-teal-600 mb-2">{stats.todayAppointments}</div>
          <div className="text-sm text-gray-600 font-medium">Today's Appointments</div>
        </div>
      </div>

      
    </div>
  );
};

export default Overview;