import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';

const NavBarTitle = ({ user, pageName, isCollapsed, setIsCollapsed }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('heallk_token');
    navigate('/login');
  };

  const handleViewProfile = () => {
    const userId = user?.user_id;
    if (userId) {
      navigate(`/doctor-profile/${userId}`);
    }
  };

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
        case '/doctor-admin/products':
        return {
          title: 'Products',
          subtitle: 'Manage your products and inventory'
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
    <div className={`fixed top-0 z-30 p-2.5 bg-gray-50 border-b-2 border-black border-opacity-10 shadow-lg h-[70px] flex items-center transition-all duration-300 ${
      isCollapsed ? 'left-20 w-[calc(100vw-80px)]' : 'left-[280px] w-[calc(100vw-280px)]'
    }`}>
      <div className="flex items-center justify-between w-full h-full">

        
        {/* Page Title Section */}
        <div className="text-left flex-1">
          <h2 className="text-3xl font-extrabold text-gray-800 m-0 cursor-pointer transition-all duration-300 hover:text-blue-900 tracking-tight lg:text-2xl md:text-xl sm:text-lg">
            {pageInfo.title}
          </h2>
          <p className="text-sm text-gray-600 mt-1 mb-0 cursor-pointer transition-colors duration-300 hover:text-blue-900 block font-medium lg:text-xs sm:hidden">
            {pageInfo.subtitle}
          </p>
        </div>

        {/* User Profile Section - Now on the right */}
        <div className="flex items-center gap-3 ml-auto">
          {/* View Profile Button */}
          <button
            onClick={handleViewProfile}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-blue-800 transition-all shadow-md hover:shadow-lg"
            title="View My Public Profile"
          >
            <span className="text-lg">👤</span>
            <span className="font-semibold text-sm hidden md:inline">My Profile</span>
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg hover:from-red-600 hover:to-red-700 transition-all shadow-md hover:shadow-lg"
            title="Logout"
          >
            <span className="text-lg">🚪</span>
            <span className="font-semibold text-sm hidden md:inline">Logout</span>
          </button>

          {/* User Info with Avatar */}
          <div className="flex items-center gap-2 bg-gray-100 py-1.5 px-3 rounded-xl border border-gray-200">
            <div className="flex flex-col gap-0 text-right sm:hidden">
              <h3
                className="text-sm font-semibold text-gray-800 m-0 cursor-pointer"
                onClick={() => navigate('/doctor-admin/profile')}
              >
                Dr. {user?.full_name || formatUserName()}
              </h3>
              <span className="text-xs text-gray-600 cursor-pointer">
                {user?.email || 'admin@gmail.com'}
              </span>
            </div>

            <div
              className="w-10 h-10 rounded-full bg-gradient-to-br from-white to-gray-50 flex items-center justify-center cursor-pointer overflow-hidden border-2 border-gray-300 shadow-sm"
              onClick={() => navigate('/doctor-admin/profile')}
            >
              {user?.profile_pic ? (
                <img
                  src={user.profile_pic}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <span className="text-base font-bold text-blue-900">
                  {getUserInitials()}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Removed tooltips for cleaner interaction */}
    </div>
  );
};

export default NavBarTitle;
