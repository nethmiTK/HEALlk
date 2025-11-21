import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ApiService from '../../services/api';
import Navbar from '../../Components/Navbar';
import './Auth.css';
import authVideo from '../../assets/auth.mp4';

const Register = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeToPolicy: false
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Preload Login page for faster switching
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = '/login';
    document.head.appendChild(link);
    
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (formData.phone && formData.phone.length < 10) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.agreeToPolicy) {
      newErrors.agreeToPolicy = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      setErrors({});
      
      try {
        const response = await ApiService.register({
          full_name: formData.full_name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password
        });

        if (response.success) {
          // Save token
          ApiService.saveToken(response.token);
          
          // Show success message
          setSuccessMessage('Account created successfully! Redirecting...');
          
          // Redirect to home page after 2 seconds
          setTimeout(() => {
            navigate('/');
          }, 2000);
        }
      } catch (error) {
        setErrors({ 
          general: error.message || 'Registration failed. Please try again.' 
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div className="auth-container">
        {/* Background Video */}
        <video 
          className="auth-video-background" 
          autoPlay 
          loop 
          muted 
          playsInline
        >
          <source src={authVideo} type="video/mp4" />
          {/* Fallback for browsers that don't support video */}
        </video>
        
        <div className="auth-card">
          {/* Form Switch Buttons */}
          <div className="form-switch-container">
            <Link to="/login" className="form-switch-btn">
              Sign In
            </Link>
            <div className="form-switch-btn active">
              Sign Up
            </div>
          </div>

          <div className="auth-header">
          <h2>Create Your Account</h2>
          <p>Join HEALlk to access quality healthcare services</p>
        </div>

        <div className="auth-form-container">
          {/* Success Message */}
          {successMessage && (
            <div className="success-message">
              ✅ {successMessage}
            </div>
          )}

          {/* Error Message */}
          {errors.general && (
            <div className="error-message">
              ❌ {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="full_name" className="form-label">
              Full Name
            </label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              value={formData.full_name}
              onChange={handleInputChange}
              className={`form-input ${errors.full_name ? 'error' : ''}`}
              placeholder="Enter your full name"
            />
            {errors.full_name && <span className="error-message">{errors.full_name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="phone" className="form-label">
              Phone Number (Optional)
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className={`form-input ${errors.phone ? 'error' : ''}`}
              placeholder="Enter your phone number"
            />
            {errors.phone && <span className="error-message">{errors.phone}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`form-input ${errors.email ? 'error' : ''}`}
              placeholder="Enter your email"
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`form-input ${errors.password ? 'error' : ''}`}
                placeholder="Create a password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm Password
            </label>
            <div className="password-input-wrapper">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                placeholder="Confirm your password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
          </div>

          <div className="form-group">
            <div className="checkbox-wrapper">
              <input
                type="checkbox"
                id="agreeToPolicy"
                name="agreeToPolicy"
                checked={formData.agreeToPolicy}
                onChange={handleInputChange}
                className={`form-checkbox ${errors.agreeToPolicy ? 'error' : ''}`}
              />
              <label htmlFor="agreeToPolicy" className="checkbox-label">
                I agree to the{' '}
                <Link to="/terms" className="policy-link">
                  Terms and Conditions
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="policy-link">
                  Privacy Policy
                </Link>
              </label>
            </div>
            {errors.agreeToPolicy && <span className="error-message">{errors.agreeToPolicy}</span>}
          </div>

          <button 
            type="submit" 
            className={`auth-button ${isSubmitting ? 'loading' : ''}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="loading-spinner"></span>
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </button>

          <div className="auth-footer">
            <p>
              Already have an account?{' '}
              <Link to="/login" className="auth-link">
                Sign in here
              </Link>
            </p>
          </div>
          </form>
        </div>
      </div>
    </div>
    </>
  );
};

export default Register;
