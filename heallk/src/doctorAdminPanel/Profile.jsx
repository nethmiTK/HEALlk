import React, { useState, useEffect, useRef } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AdminPanel.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);

  // Form states
  const [profileForm, setProfileForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    profile_pic: ''
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
          profile_pic: data.user.profile_pic || ''
        });
        // Set preview image if profile picture exists
        if (data.user.profile_pic) {
          setPreviewImage(data.user.profile_pic);
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
          profile_pic: profileForm.profile_pic
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
      phone: user?.phone || ''
    });
    setPreviewImage(user?.profile_pic || null);
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
      <div className="profile-container">
        <div className="loading-state">
          <div className="loading-spinner">⏳</div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      {/* Page Header */}
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">My Profile</h1>
          <p className="page-subtitle">Manage your account information and settings</p>
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

      <div className="profile-content">
        {/* Profile Information Card */}
        <div className="profile-card">
          <div className="profile-card-header">
            <div className="profile-info">
              <div className="profile-avatar" 
                   onClick={isEditing ? () => fileInputRef.current?.click() : (user?.profile_pic ? handleImageRemove : null)}
                   style={{ cursor: isEditing ? 'pointer' : (user?.profile_pic ? 'pointer' : 'default') }}
                   title={isEditing ? 'Click to change profile picture' : (user?.profile_pic ? 'Click to remove profile picture' : `${user?.full_name || 'User'}'s initial`)}>
                {user?.profile_pic || previewImage ? (
                  <img 
                    src={previewImage || user.profile_pic} 
                    alt="Profile" 
                    className="avatar-image"
                  />
                ) : (
                  <span className="avatar-text">
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
              <div className="profile-details">
                <h2 className="profile-name">{user?.full_name || 'Unknown User'}</h2>
                <p className="profile-email">{user?.email}</p>
                <p className="profile-role">
                  <span className="role-badge">
                    {user?.role === 'admin' ? 'Administrator' : 'Doctor'}
                  </span>
                </p>
              </div>
            </div>
            <div className="profile-actions">
              {!isEditing ? (
                <button 
                  className="btn btn-primary"
                  onClick={() => setIsEditing(true)}
                  title="Edit your profile information including name, email, phone, and profile picture"
                >
                  Edit Profile
                </button>
              ) : (
                <div className="edit-actions">
                  <button 
                    className="btn btn-success"
                    onClick={handleProfileSubmit}
                    disabled={saving}
                    title="Save all changes made to your profile information"
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button 
                    className="btn btn-secondary"
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
          <div className="profile-form-section">
            <form onSubmit={handleProfileSubmit}>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="full_name" className="form-label">
                    Full Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="full_name"
                    name="full_name"
                    className="form-input"
                    value={profileForm.full_name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    required
                    placeholder="Enter your full name"
                    title="Your full name as it will appear on your profile"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-input"
                    value={profileForm.email}
                    disabled={true}
                    placeholder="Email cannot be changed"
                  />
                  <small className="form-help">Email address cannot be modified</small>
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
