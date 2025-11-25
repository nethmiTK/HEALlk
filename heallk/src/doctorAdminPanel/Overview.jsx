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
    <div className="bg-green-50 min-h-screen p-6 sm:p-4">
      {/* Page Header */}
      <div className="mb-8 sm:mb-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 sm:text-2xl">Dashboard Overview</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="text-3xl font-bold text-blue-600 mb-2">{stats.services}</div>
          <div className="text-sm text-gray-600 font-medium">Total Services</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="text-3xl font-bold text-green-600 mb-2">{stats.products}</div>
          <div className="text-sm text-gray-600 font-medium">Products</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
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
          <div className="text-3xl font-bold text-indigo-600 mb-2">{stats.totalAppointments}</div>
          <div className="text-sm text-gray-600 font-medium">Total Appointments</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="text-3xl font-bold text-teal-600 mb-2">{stats.todayAppointments}</div>
          <div className="text-sm text-gray-600 font-medium">Today's Appointments</div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200" title="Recent activities and updates in your clinic management system">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Recent Activity</h3>
            <button className="text-green-600 hover:text-green-800 text-sm font-medium flex items-center gap-1" title="View all recent activities and system updates">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              View All
            </button>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="text-2xl">
                  {activity.type === 'appointment' && '📅'}
                  {activity.type === 'review' && '⭐'}
                  {activity.type === 'patient' && '👤'}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-800 font-medium">{activity.message}</p>
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200" title="Quick access to frequently used features and sections">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Quick Actions</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action) => (
              <button key={action.id} className="flex flex-col items-center p-4 bg-gray-50 hover:bg-green-50 rounded-lg transition-colors border border-gray-200 hover:border-green-300 shadow-sm hover:shadow-md" title={`Navigate to ${action.title} section`}>
                <span className="text-2xl mb-2">{action.icon}</span>
                <span className="text-sm font-medium text-gray-700">{action.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200" title="Your appointments scheduled for today with patient details and status">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Today's Schedule</h3>
            <span className="text-sm text-gray-500 font-medium" title="Current date">{new Date().toLocaleDateString()}</span>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg" title="Confirmed appointment with Sarah Johnson at 09:00 AM for General Consultation">
              <div className="text-sm font-semibold text-blue-600">09:00 AM</div>
              <div className="flex-1 mx-4">
                <p className="text-sm font-medium text-gray-800">Sarah Johnson</p>
                <p className="text-xs text-gray-600">General Consultation</p>
              </div>
              <div className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium" title="Appointment is confirmed and ready">Confirmed</div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg" title="Confirmed follow-up appointment with Michael Brown at 11:30 AM">
              <div className="text-sm font-semibold text-blue-600">11:30 AM</div>
              <div className="flex-1 mx-4">
                <p className="text-sm font-medium text-gray-800">Michael Brown</p>
                <p className="text-xs text-gray-600">Follow-up</p>
              </div>
              <div className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium" title="Appointment is confirmed and ready">Confirmed</div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg" title="Pending appointment with Emma Davis at 02:00 PM for routine checkup">
              <div className="text-sm font-semibold text-blue-600">02:00 PM</div>
              <div className="flex-1 mx-4">
                <p className="text-sm font-medium text-gray-800">Emma Davis</p>
                <p className="text-xs text-gray-600">Checkup</p>
              </div>
              <div className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full font-medium" title="Appointment is pending confirmation">Pending</div>
            </div>
          </div>
        </div>

        {/* Performance Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 lg:col-span-2" title="Monthly performance metrics and analytics for your clinic">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Monthly Performance</h3>
            <select className="border border-gray-300 rounded-md px-3 py-1 text-sm" title="Select the type of data to display in the performance chart">
              <option value="appointments">Appointments</option>
              <option value="patients">New Patients</option>
              <option value="revenue">Revenue</option>
            </select>
          </div>
          <div className="text-center py-12">
            <div className="text-6xl mb-4">
              📈
            </div>
            <p className="text-gray-600">
              Your appointment bookings have increased by 15% this month compared to last month.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;