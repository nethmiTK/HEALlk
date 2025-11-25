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
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  onClick={() => setIsEditing(true)}
                  title="Edit your profile information including name, email, phone, and profile picture"
                >
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button 
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50"
                    onClick={handleProfileSubmit}
                    disabled={saving}
                    title="Save all changes made to your profile information"
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button 
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium disabled:opacity-50"
                    onClick={cancelEdit}
                    disabled={saving}
                    title="Cancel editing and discard all unsaved changes"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Profile Form */}
          <div className="p-6">
            <form onSubmit={handleProfileSubmit}>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="full_name"
                    name="full_name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    value={profileForm.full_name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    required
                    placeholder="Enter your full name"
                    title="Your full name as it will appear on your profile"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                    value={profileForm.email}
                    disabled={true}
                    placeholder="Email cannot be changed"
                  />
                  <small className="text-xs text-gray-500 mt-1 block">Email address cannot be modified</small>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone" className="form-label">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="form-input"
                    value={profileForm.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="Enter your phone number"
                    title="Your contact phone number"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Account Created</label>
                  <div className="form-display">
                    {user?.created_at ? formatDate(user.created_at) : 'Unknown'}
                  </div>
                </div>
              </div>

              {/* Cover Photo Section */}
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Cover Photo</label>
                  <div className="cover-photo-section">
                    {previewCover || user?.cover_photo ? (
                      <div className="cover-preview">
                        <img 
                          src={previewCover || user.cover_photo} 
                          alt="Cover" 
                          className="cover-image"
                          style={{width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px'}}
                        />
                        {isEditing && (
                          <button 
                            type="button" 
                            onClick={handleCoverRemove}
                            className="btn btn-secondary"
                            style={{marginTop: '8px'}}
                          >
                            Remove Cover
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="cover-placeholder" style={{height: '200px', border: '2px dashed #ccc', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                        <span>No cover photo</span>
                      </div>
                    )}
                    {isEditing && (
                      <input
                        type="file"
                        ref={coverInputRef}
                        onChange={handleCoverChange}
                        accept="image/*"
                        className="file-input"
                        style={{ display: 'none' }}
                      />
                    )}
                    {isEditing && (
                      <button 
                        type="button" 
                        onClick={() => coverInputRef.current?.click()}
                        className="btn btn-outline"
                        style={{marginTop: '8px'}}
                      >
                        {previewCover || user?.cover_photo ? 'Change Cover' : 'Add Cover Photo'}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Description Section */}
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="description" className="form-label">
                    Professional Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    className="form-input"
                    value={profileForm.description}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    rows="4"
                    placeholder="Describe your professional background, specializations, and experience..."
                    title="Your professional description that will appear on your public profile"
                  />
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Security Section */}
        <div className="profile-card">
          <div className="profile-card-header">
            <div className="section-info">
              <h3 className="section-title">Security Settings</h3>
              <p className="section-subtitle">Manage your password and account security</p>
            </div>
            <button 
              className="btn btn-outline"
              onClick={() => setShowPasswordForm(!showPasswordForm)}
              title={showPasswordForm ? 'Cancel password change' : 'Change your account password'}
            >
              {showPasswordForm ? 'Cancel' : 'Change Password'}
            </button>
          </div>

          {showPasswordForm && (
            <div className="password-form-section">
              <form onSubmit={handlePasswordSubmit}>
                {passwordError && (
                  <div className="alert alert-error">
                    <span className="alert-icon">⚠️</span>
                    <span className="alert-message">{passwordError}</span>
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="currentPassword" className="form-label">
                    Current Password <span className="required">*</span>
                  </label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    className="form-input"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordChange}
                    required
                    placeholder="Enter your current password"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="newPassword" className="form-label">
                      New Password <span className="required">*</span>
                    </label>
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      className="form-input"
                      value={passwordForm.newPassword}
                      onChange={handlePasswordChange}
                      required
                      minLength="8"
                      placeholder="Enter new password (min 8 characters)"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="confirmPassword" className="form-label">
                      Confirm New Password <span className="required">*</span>
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      className="form-input"
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordChange}
                      required
                      placeholder="Confirm your new password"
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button 
                    type="submit"
                    className="btn btn-primary"
                    disabled={saving}
                    title="Update your account password with the new password"
                  >
                    {saving ? 'Updating...' : 'Update Password'}
                  </button>
                  <button 
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowPasswordForm(false);
                      setPasswordForm({
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: ''
                      });
                      setPasswordError(null);
                    }}
                    title="Cancel password change and clear form"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {!showPasswordForm && (
            <div className="security-info">
              <div className="security-item" title="Your account password security information">
                <div className="security-details">
                  <h4>Password</h4>
                  <p>Your password was last updated on your registration date</p>
                </div>
                <div className="security-status">
                  <span className="status-badge secure" title="Your password meets security requirements">Secure</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Account Statistics */}
        <div className="profile-stats">
          <div className="stat-card" title="Your account role and permissions level">
            <div className="stat-info">
              <h3>Account Type</h3>
              <p className="stat-value">{user?.role === 'admin' ? 'Administrator' : 'Doctor'}</p>
            </div>
          </div>

          <div className="stat-card" title="Date when your account was created">
            <div className="stat-info">
              <h3>Member Since</h3>
              <p className="stat-value">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'short' 
                }) : 'Unknown'}
              </p>
            </div>
          </div>

          <div className="stat-card" title="Your account security rating based on password strength and settings">
            <div className="stat-info">
              <h3>Security Level</h3>
              <p className="stat-value">High</p>
            </div>
          </div>

          <div className="stat-card" title="Current status of your account">
            <div className="stat-info">
              <h3>Account Status</h3>
              <p className="stat-value">Active</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
