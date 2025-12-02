import React, { useState, useEffect, useRef } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Profile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [previewCover, setPreviewCover] = useState(null);
  const fileInputRef = useRef(null);
  const coverInputRef = useRef(null);

  // Form states
  const [profileForm, setProfileForm] = useState({
    full_name: '',
    email: '',
    country_code: '+94',
    phone: '',
    profile_pic: '',
    cover_photo: '',
    description: ''
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [passwordError, setPasswordError] = useState(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('heallk_token');
      
      const response = await fetch('http://localhost:5000/api/auth/profile', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (response.ok && data.success && data.user) {
        setUser(data.user);
        setProfileForm({
          full_name: data.user.full_name || '',
          email: data.user.email || '',
          country_code: data.user.country_code || '+94',
          phone: data.user.phone || '',
          profile_pic: data.user.profile_pic || '',
          cover_photo: data.user.cover_photo || '',
          description: data.user.description || ''
        });
        // Set preview images if they exist
        if (data.user.profile_pic) {
          setPreviewImage(data.user.profile_pic);
        }
        if (data.user.cover_photo) {
          setPreviewCover(data.user.cover_photo);
        }
      } else {
        throw new Error(data.message || 'Failed to load profile data');
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast.error('Failed to load profile information 📋', {
        position: "top-right",
        autoClose: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Validate phone number - only allow 10 digits
    if (name === 'phone') {
      const phoneValue = value.replace(/\D/g, '');
      if (phoneValue.length > 9) return;
      setProfileForm(prev => ({
        ...prev,
        [name]: phoneValue
      }));
      return;
    }
    
    setProfileForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB 📁', {
          position: "top-right",
          autoClose: 4000,
        });
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file 🖼️', {
          position: "top-right",
          autoClose: 4000,
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setPreviewImage(base64String);
        setProfileForm(prev => ({
          ...prev,
          profile_pic: base64String
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageRemove = () => {
    setPreviewImage(null);
    setProfileForm(prev => ({
      ...prev,
      profile_pic: ''
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB 📁');
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file 🖼️');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setPreviewCover(base64String);
        setProfileForm(prev => ({
          ...prev,
          cover_photo: base64String
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverRemove = () => {
    setPreviewCover(null);
    setProfileForm(prev => ({
      ...prev,
      cover_photo: ''
    }));
    if (coverInputRef.current) {
      coverInputRef.current.value = '';
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    // Validate phone number before submission
    if (!profileForm.phone || profileForm.phone.length !== 10) {
      toast.error('Please enter a valid 10-digit phone number 📱', {
        position: "top-right",
        autoClose: 4000,
      });
      return;
    }

    if (!profileForm.country_code) {
      toast.error('Please select a country code 🌍', {
        position: "top-right",
        autoClose: 4000,
      });
      return;
    }
    
    try {
      setSaving(true);
      const token = localStorage.getItem('heallk_token');

      const response = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          full_name: profileForm.full_name,
          country_code: profileForm.country_code,
          phone: profileForm.phone,
          profile_pic: profileForm.profile_pic,
          cover_photo: profileForm.cover_photo,
          description: profileForm.description
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setUser(data.user);
        toast.success('Profile updated successfully! ✅', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        setIsEditing(false);
      } else {
        throw new Error(data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.message || 'Failed to update profile ❌', {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match 🔄', {
        position: "top-right",
        autoClose: 4000,
      });
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long 🔑', {
        position: "top-right",
        autoClose: 4000,
      });
      return;
    }

    try {
      setSaving(true);
      const token = localStorage.getItem('heallk_token');

      const response = await fetch('http://localhost:5000/api/auth/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success('Password changed successfully! 🔒', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setShowPasswordForm(false);
      } else {
        throw new Error(data.message || 'Failed to change password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      setPasswordError(error.message || 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setProfileForm({
      full_name: user?.full_name || '',
      email: user?.email || '',
      country_code: user?.country_code || '+94',
      phone: user?.phone || '',
      profile_pic: user?.profile_pic || '',
      cover_photo: user?.cover_photo || '',
      description: user?.description || ''
    });
    setPreviewImage(user?.profile_pic || null);
    setPreviewCover(user?.cover_photo || null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="p-6 bg-green-50 min-h-screen">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-6xl animate-pulse">⏳</div>
          <p className="ml-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-green-50 min-h-screen p-6 sm:p-4">
      {/* Page Header */}
      <div className="mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your account information and settings</p>
        </div>
      </div>

      {/* Toast Container for notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <div className="space-y-6">
        {/* Profile Information Card */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold cursor-pointer hover:scale-105 transition-transform" 
                     onClick={isEditing ? () => fileInputRef.current?.click() : (user?.profile_pic ? handleImageRemove : null)}
                     style={{ cursor: isEditing ? 'pointer' : (user?.profile_pic ? 'pointer' : 'default') }}
                     title={isEditing ? 'Click to change profile picture' : (user?.profile_pic ? 'Click to remove profile picture' : `${user?.full_name || 'User'}'s initial`)}>
                  {user?.profile_pic || previewImage ? (
                    <img 
                      src={previewImage || user.profile_pic} 
                      alt="Profile" 
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <span>
                      {user?.full_name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  )}
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="file-input"
                  style={{ display: 'none' }}
                />
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-1">{user?.full_name || 'Unknown User'}</h2>
                  <p className="text-gray-600 mb-2">{user?.email}</p>
                  <p>
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                      {user?.role === 'admin' ? 'Administrator' : 'Doctor'}
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
              {!isEditing ? (
                <button 
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
                  onClick={() => setIsEditing(true)}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  ✏️ Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button 
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-semibold disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
                    onClick={handleProfileSubmit}
                    disabled={saving || profileForm.phone.length !== 9}
                    title={profileForm.phone.length !== 9 ? 'Please enter a 9-digit phone number' : ''}
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        💾 Save Changes
                      </>
                    )}
                  </button>
                  <button 
                    className="px-6 py-3 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-xl font-semibold disabled:opacity-50 transition-all duration-200"
                    onClick={cancelEdit}
                    disabled={saving}
                  >
                    ❌ Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

          {/* Profile Form */}
          <div className="p-8">
            <form onSubmit={handleProfileSubmit} className="space-y-8">
              {/* Basic Information Section */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                  👤 Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="full_name" className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      📝 Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="full_name"
                      name="full_name"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
                      value={profileForm.full_name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      required
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      📧 Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 cursor-not-allowed shadow-sm"
                      value={profileForm.email}
                      disabled={true}
                      placeholder="Email cannot be changed"
                    />
                    <small className="text-xs text-gray-500 mt-2 block flex items-center gap-1">
                      🔒 Email address cannot be modified for security reasons
                    </small>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <label htmlFor="country_code" className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      🌍 Country Code
                    </label>
                    <select
                      id="country_code"
                      name="country_code"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
                      value={profileForm.country_code}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    >
                      <option value="+94">🇱🇰 Sri Lanka (+94)</option>
                      <option value="+1">🇺🇸 United States (+1)</option>
                      <option value="+44">🇬🇧 United Kingdom (+44)</option>
                      <option value="+61">🇦🇺 Australia (+61)</option>
                      <option value="+86">🇨🇳 China (+86)</option>
                      <option value="+81">🇯🇵 Japan (+81)</option>
                      <option value="+91">🇮🇳 India (+91)</option>
                      <option value="+65">🇸🇬 Singapore (+65)</option>
                      <option value="+60">🇲🇾 Malaysia (+60)</option>
                      <option value="+66">🇹🇭 Thailand (+66)</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      📱 Phone Number
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600 font-medium whitespace-nowrap">{profileForm.country_code}</span>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
                        value={profileForm.phone}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        placeholder="Enter 10-digit phone number"
                        maxLength="10"
                        inputMode="numeric"
                      />
                    </div>
                    <small className="text-xs text-gray-500 mt-2 block">
                      🔢 Phone number must be exactly 10 digits
                    </small>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      📅 Account Created
                    </label>
                    <div className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-700 shadow-sm">
                      {user?.created_at ? formatDate(user.created_at) : 'Unknown'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Cover Photo Section
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                  🖼️ Cover Photo
                </h3>
                <div className="space-y-4">
                  {previewCover || user?.cover_photo ? (
                    <div className="relative">
                      <img 
                        src={previewCover || user.cover_photo} 
                        alt="Cover" 
                        className="w-full h-48 object-cover rounded-xl shadow-lg border-2 border-white"
                      />
                      {isEditing && (
                        <button 
                          type="button" 
                          onClick={handleCoverRemove}
                          className="absolute top-3 right-3 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium shadow-lg"
                        >
                          🗑️ Remove
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="h-48 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="text-4xl mb-2">📷</div>
                      <span className="text-gray-500 font-medium">No cover photo uploaded</span>
                    </div>
                  )}
                  {isEditing && (
                    <>
                      <input
                        type="file"
                        ref={coverInputRef}
                        onChange={handleCoverChange}
                        accept="image/*"
                        className="hidden"
                      />
                      <button 
                        type="button" 
                        onClick={() => coverInputRef.current?.click()}
                        className="w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
                      >
                        📸 {previewCover || user?.cover_photo ? 'Change Cover Photo' : 'Upload Cover Photo'}
                      </button>
                    </>
                  )}
                </div>
              </div> */}

              {/* Professional Description Section */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                  📋 Professional Description
                </h3>
                <div>
                  <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    ✍️ About Your Practice
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md resize-none"
                    value={profileForm.description}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    rows="5"
                    placeholder="Describe your professional background, specializations, experience, and what makes your practice unique..."
                  />
                  <small className="text-xs text-gray-500 mt-2 block">
                    💡 This description will appear on your public profile to help patients understand your expertise
                  </small>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Security Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-red-50 to-orange-50 p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                  🔐 Security Settings
                </h3>
                <p className="text-gray-600">Manage your password and account security</p>
              </div>
              <button 
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
                onClick={() => setShowPasswordForm(!showPasswordForm)}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                {showPasswordForm ? '❌ Cancel' : '🔒 Change Password'}
              </button>
            </div>
          </div>

          {showPasswordForm && (
            <div className="p-8">
              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                {passwordError && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                    <div className="flex items-center">
                      <span className="text-red-500 text-lg mr-3">⚠️</span>
                      <span className="text-red-700 font-medium">{passwordError}</span>
                    </div>
                  </div>
                )}

                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    🔑 Current Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 shadow-sm hover:shadow-md"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordChange}
                    required
                    placeholder="Enter your current password"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      🆕 New Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 shadow-sm hover:shadow-md"
                      value={passwordForm.newPassword}
                      onChange={handlePasswordChange}
                      required
                      minLength="8"
                      placeholder="Enter new password (min 8 characters)"
                    />
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      ✅ Confirm Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 shadow-sm hover:shadow-md"
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordChange}
                      required
                      placeholder="Confirm your new password"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                  <button 
                    type="button"
                    className="px-6 py-3 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-xl font-semibold transition-all duration-200"
                    onClick={() => {
                      setShowPasswordForm(false);
                      setPasswordForm({
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: ''
                      });
                      setPasswordError(null);
                    }}
                  >
                    ❌ Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-semibold disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        Updating...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        🔒 Update Password
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {!showPasswordForm && (
            <div className="p-8">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      🔐 Password Security
                    </h4>
                    <p className="text-gray-600">Your password was last updated on your registration date</p>
                  </div>
                  <div>
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                      ✅ Secure
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Profile;
