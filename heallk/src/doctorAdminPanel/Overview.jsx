import React, { useState, useEffect } from 'react';

const Overview = () => {
  const [stats, setStats] = useState({
    totalAppointments: 0,
    todayAppointments: 0,
    totalPatients: 0,
    reviews: 0,
    rating: 4.8
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
        // This would be replaced with actual API calls
        setStats({
          totalAppointments: 142,
          todayAppointments: 8,
          totalPatients: 89,
          reviews: 67,
          rating: 4.8
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="overview-container">
      {/* Page Header */}
      <div className="overview-header">
        <h1>Dashboard Overview</h1>
      </div>

      {/* Stats Cards */}
      <div className="stats-overview">
        <div className="stat-card">
          <div className="stat-number">{stats.totalAppointments}</div>
          <div className="stat-label">Total Appointments</div>
        </div>

        <div className="stat-card">
          <div className="stat-number">{stats.todayAppointments}</div>
          <div className="stat-label">Today's Appointments</div>
        </div>

        <div className="stat-card">
          <div className="stat-number">{stats.totalPatients}</div>
          <div className="stat-label">Total Patients</div>
        </div>

        <div className="stat-card">
          <div className="stat-number">{stats.rating}</div>
          <div className="stat-label">Average Rating</div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="content-grid">
        {/* Recent Activity */}
        <div className="content-card" title="Recent activities and updates in your clinic management system">
          <div className="card-header">
            <h3 className="card-title">Recent Activity</h3>
            <button className="btn-text" title="View all recent activities and system updates">View All</button>
          </div>
          <div className="activity-list">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="activity-item">
                <div className="activity-icon">
                  {activity.type === 'appointment' && '📅'}
                  {activity.type === 'review' && '⭐'}
                  {activity.type === 'patient' && '👤'}
                </div>
                <div className="activity-content">
                  <p className="activity-message">{activity.message}</p>
                  <span className="activity-time">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="content-card" title="Quick access to frequently used features and sections">
          <div className="card-header">
            <h3 className="card-title">Quick Actions</h3>
          </div>
          <div className="quick-actions-grid">
            {quickActions.map((action) => (
              <button key={action.id} className="quick-action-btn" title={`Navigate to ${action.title} section`}>
                <span className="action-icon">{action.icon}</span>
                <span className="action-title">{action.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="content-card schedule-card" title="Your appointments scheduled for today with patient details and status">
          <div className="card-header">
            <h3 className="card-title">Today's Schedule</h3>
            <span className="schedule-date" title="Current date">{new Date().toLocaleDateString()}</span>
          </div>
          <div className="schedule-list">
            <div className="schedule-item" title="Confirmed appointment with Sarah Johnson at 09:00 AM for General Consultation">
              <div className="schedule-time">09:00 AM</div>
              <div className="schedule-content">
                <p className="patient-name">Sarah Johnson</p>
                <p className="appointment-type">General Consultation</p>
              </div>
              <div className="schedule-status confirmed" title="Appointment is confirmed and ready">Confirmed</div>
            </div>
            
            <div className="schedule-item" title="Confirmed follow-up appointment with Michael Brown at 11:30 AM">
              <div className="schedule-time">11:30 AM</div>
              <div className="schedule-content">
                <p className="patient-name">Michael Brown</p>
                <p className="appointment-type">Follow-up</p>
              </div>
              <div className="schedule-status confirmed" title="Appointment is confirmed and ready">Confirmed</div>
            </div>
            
            <div className="schedule-item" title="Pending appointment with Emma Davis at 02:00 PM for routine checkup">
              <div className="schedule-time">02:00 PM</div>
              <div className="schedule-content">
                <p className="patient-name">Emma Davis</p>
                <p className="appointment-type">Checkup</p>
              </div>
              <div className="schedule-status pending" title="Appointment is pending confirmation">Pending</div>
            </div>
          </div>
        </div>

        {/* Performance Chart */}
        <div className="content-card chart-card" title="Monthly performance metrics and analytics for your clinic">
          <div className="card-header">
            <h3 className="card-title">Monthly Performance</h3>
            <select className="chart-filter" title="Select the type of data to display in the performance chart">
              <option value="appointments">Appointments</option>
              <option value="patients">New Patients</option>
              <option value="revenue">Revenue</option>
            </select>
          </div>
          <div className="chart-placeholder">
            <div className="chart-visual">
              📈 Performance chart would go here
            </div>
            <p className="chart-description">
              Your appointment bookings have increased by 15% this month compared to last month.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;