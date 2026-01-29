import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../Components/Navbar';
import './Auth.css';
import authVideo from '../../assets/auth.mp4';

const Register = () => {
  const SPECIALIZATIONS = [
    'Ayurvedic Physicians',
    'Panchakarma Specialists',
    'Wellness & Lifestyle Consultants'
  ];

  const SRI_LANKA_DISTRICTS = [
    'Ampara', 'Anuradhapura', 'Badulla', 'Batticaloa', 'Colombo', 'Galle',
    'Gampaha', 'Jaffna', 'Kalutara', 'Kandy', 'Kegalle', 'Kilinochchi',
    'Kurunegala', 'Madurai', 'Mannar', 'Matara', 'Maturai', 'Monaragala',
    'Mullaitivu', 'Nuwara Eliya', 'Polonnaruwa', 'Puttalam', 'Ratnapura',
    'Ruwanella', 'Trincomalee', 'Vavuniya'
  ];

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    countryCode: '+94',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeToPolicy: false,
    specialization: '',
    address: '',
    district: '',
    paymentSlip: null
  });

  const COUNTRY_CODES = [
    { code: '+94', country: 'Sri Lanka 🇱🇰', example: '701234567' },
    { code: '+91', country: 'India 🇮🇳', example: '9876543210' },
    { code: '+1', country: 'USA/Canada 🇺🇸', example: '2125551234' },
    { code: '+44', country: 'UK 🇬🇧', example: '2071838750' },
    { code: '+61', country: 'Australia 🇦🇺', example: '212345678' },
  ];

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [slipPreview, setSlipPreview] = useState(null);
  const navigate = useNavigate();

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
    const { name, value, type, checked, files } = e.target;
    
    if (type === 'file' && files && files[0]) {
      const file = files[0];
      setFormData(prev => ({
        ...prev,
        [name]: file
      }));
      
      // Create preview for image files
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setSlipPreview({
            type: 'image',
            data: event.target.result
          });
        };
        reader.readAsDataURL(file);
      } else if (file.type === 'application/pdf') {
        setSlipPreview({
          type: 'pdf',
          name: file.name
        });
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
    
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

    if (formData.phone && formData.phone.length < 9) {
      newErrors.phone = 'Please enter a valid phone number';
    } else if (formData.phone && !/^\d+$/.test(formData.phone)) {
      newErrors.phone = 'Phone number should only contain digits';
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

    if (!formData.specialization) {
      newErrors.specialization = 'Please select your specialization';
    } else if (!SPECIALIZATIONS.includes(formData.specialization)) {
      newErrors.specialization = 'Invalid specialization selected';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!formData.district) {
      newErrors.district = 'Please select your district';
    }

    if (!formData.paymentSlip) {
      newErrors.paymentSlip = 'Payment slip is required';
    } else if (!['image/jpeg', 'image/png', 'application/pdf'].includes(formData.paymentSlip.type)) {
      newErrors.paymentSlip = 'Payment slip must be a PDF, JPG, or PNG file';
    } else if (formData.paymentSlip.size > 5 * 1024 * 1024) {
      newErrors.paymentSlip = 'Payment slip must be less than 5MB';
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
        const formDataToSend = new FormData();
        formDataToSend.append('full_name', formData.full_name);
        formDataToSend.append('email', formData.email);
        // Combine country code with phone number
        const fullPhone = formData.phone ? `${formData.countryCode}${formData.phone}` : '';
        formDataToSend.append('phone', fullPhone);
        formDataToSend.append('password', formData.password);
        formDataToSend.append('specialization', formData.specialization);
        formDataToSend.append('address', formData.address);
        formDataToSend.append('district', formData.district);
        formDataToSend.append('status', 'requested');
        if (formData.paymentSlip) {
          formDataToSend.append('paymentSlip', formData.paymentSlip);
        }

        const response = await fetch('http://localhost:5000/api/auth/register', {
          method: 'POST',
          body: formDataToSend
        });
        const data = await response.json();
        if (response.ok && data.success) {
          localStorage.setItem('heallk_token', data.token);
          setSuccessMessage('Account created successfully! Your status is pending approval. Redirecting...');
          setTimeout(() => {
            navigate('/');
          }, 2000);
        } else {
          throw new Error(data.message || 'Registration failed');
        }
      } catch (error) {
        setErrors({ general: error.message || 'Registration failed. Please try again.' });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

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
            <p>Join HELA Lanka to access quality healthcare services</p>
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
                  autoComplete="name"
                />
                {errors.full_name && <span className="error-message">{errors.full_name}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="specialization" className="form-label">
                  Specialization
                </label>
                <select
                  id="specialization"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleInputChange}
                  className={`form-input ${errors.specialization ? 'error' : ''}`}
                >
                  <option value="">Select specialization</option>
                  {SPECIALIZATIONS.map(spec => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
                {errors.specialization && <span className="error-message">{errors.specialization}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="address" className="form-label">
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className={`form-input ${errors.address ? 'error' : ''}`}
                  placeholder="Enter your full address"
                  autoComplete="street-address"
                />
                {errors.address && <span className="error-message">{errors.address}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="district" className="form-label">
                  District
                </label>
                <select
                  id="district"
                  name="district"
                  value={formData.district}
                  onChange={handleInputChange}
                  className={`form-input ${errors.district ? 'error' : ''}`}
                >
                  <option value="">Select district</option>
                  {SRI_LANKA_DISTRICTS.map(dist => (
                    <option key={dist} value={dist}>{dist}</option>
                  ))}
                </select>
                {errors.district && <span className="error-message">{errors.district}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="paymentSlip" className="form-label">
                  Payment Slip *
                </label>
                <div className="file-input-wrapper">
                  <input
                    type="file"
                    id="paymentSlip"
                    name="paymentSlip"
                    onChange={handleInputChange}
                    accept=".pdf,.jpg,.jpeg,.png"
                    className={`form-input ${errors.paymentSlip ? 'error' : ''}`}
                  />
                  <span className="file-input-label">
                    {formData.paymentSlip ? `✓ ${formData.paymentSlip.name}` : 'Choose payment slip (PDF, JPG, PNG - Max 5MB)'}
                  </span>
                </div>
                {errors.paymentSlip && <span className="error-message">{errors.paymentSlip}</span>}
                
                {/* Payment Slip Preview */}
                {slipPreview && (
                  <div className="payment-slip-preview">
                    <h4>Preview</h4>
                    {slipPreview.type === 'image' ? (
                      <img src={slipPreview.data} alt="Payment Slip Preview" className="preview-image" />
                    ) : (
                      <div className="pdf-preview">
                        <div className="pdf-icon">📄</div>
                        <p>{slipPreview.name}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="phone" className="form-label">
                  Phone Number (Optional)
                </label>
                
                <div className="phone-input-group">
                  <select
                    name="countryCode"
                    value={formData.countryCode}
                    onChange={handleInputChange}
                    className="form-input country-code-select"
                    style={{ maxWidth: '140px' }}
                  >
                    {COUNTRY_CODES.map(item => (
                      <option key={item.code} value={item.code}>
                        {item.code} {item.country}
                      </option>
                    ))}
                  </select>
                  
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`form-input ${errors.phone ? 'error' : ''}`}
                    placeholder={
                      COUNTRY_CODES.find(c => c.code === formData.countryCode)?.example || 
                      'Enter phone number'
                    }
                    style={{ flex: 1 }}
                  />
                </div>
                
                {/* Display full phone number preview */}
                {formData.phone && (
                  <div style={{ 
                    marginTop: '8px', 
                    fontSize: '13px', 
                    color: '#666',
                    padding: '8px',
                    backgroundColor: '#f0f8ff',
                    borderRadius: '4px'
                  }}>
                    📱 Full number: <strong>{formData.countryCode}{formData.phone}</strong>
                  </div>
                )}
                
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
                  autoComplete="email"
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
                    autoComplete="new-password"
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
                    autoComplete="new-password"
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
