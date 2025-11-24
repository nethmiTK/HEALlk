import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { API_BASE_URL } from '../config';
import './ClinicForm.css';

const ClinicForm = () => {
  const [clinicData, setClinicData] = useState({
    clinicName: '',
    address: '',
    city: '',
    postalCode: '',
    phone: '',
    email: '',
    website: '',
    description: '',
    specializations: [],
    facilities: [],
    workingHours: {
      monday: { open: '09:00', close: '17:00', isOpen: true },
      tuesday: { open: '09:00', close: '17:00', isOpen: true },
      wednesday: { open: '09:00', close: '17:00', isOpen: true },
      thursday: { open: '09:00', close: '17:00', isOpen: true },
      friday: { open: '09:00', close: '17:00', isOpen: true },
      saturday: { open: '09:00', close: '13:00', isOpen: true },
      sunday: { open: '09:00', close: '17:00', isOpen: false }
    },
    emergencyContact: '',
    insuranceAccepted: []
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const specializations = [
    'General Medicine', 'Cardiology', 'Neurology', 'Orthopedics', 
    'Dermatology', 'Pediatrics', 'Gynecology', 'Psychiatry'
  ];

  const facilities = [
    'Parking', 'Wheelchair Accessible', 'Laboratory', 'X-Ray', 
    'ECG', 'Ultrasound', 'Pharmacy', 'Emergency Care'
  ];

  const insuranceCompanies = [
    'Ceylinco Insurance', 'Sri Lanka Insurance', 'AIA Insurance', 
    'Allianz Insurance', 'Union Assurance', 'Janashakthi Insurance'
  ];

  const daysOfWeek = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' }
  ];

  useEffect(() => {
    loadClinicData();
  }, []);

  const loadClinicData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('heallk_token');
      
      const response = await fetch(`${API_BASE_URL}/clinics`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.clinicInfo) {
          setClinicData(prev => ({
            ...prev,
            ...data.clinicInfo,
            workingHours: data.clinicInfo.working_hours || prev.workingHours,
            insuranceAccepted: data.clinicInfo.insurance_accepted || prev.insuranceAccepted
          }));
          setIsEditing(true);
        }
      }
    } catch (error) {
      console.error('Error loading clinic data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setClinicData(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (field, value) => {
    setClinicData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const handleWorkingHoursChange = (day, field, value) => {
    setClinicData(prev => ({
      ...prev,
      workingHours: {
        ...prev.workingHours,
        [day]: {
          ...prev.workingHours[day],
          [field]: field === 'isOpen' ? !prev.workingHours[day].isOpen : value
        }
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('heallk_token');
      const method = isEditing ? 'PUT' : 'POST';
      
      const response = await fetch(`${API_BASE_URL}/clinics`, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(clinicData)
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(data.message);
        if (!isEditing) setIsEditing(true);
      } else {
        throw new Error('Failed to save clinic information');
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="clinic-form-loading">
        <div className="loading-spinner"></div>
        <p>Loading clinic information...</p>
      </div>
    );
  }

  return (
    <div className="clinic-form-container">
      <div className="clinic-form-header">
        <h2>🏥 Clinic Information</h2>
        <p>Manage your clinic details and settings</p>
      </div>

      <form onSubmit={handleSubmit} className="clinic-form">
        {/* Basic Information */}
        <div className="form-section">
          <h3>📋 Basic Information</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Clinic Name *</label>
              <input
                type="text"
                name="clinicName"
                value={clinicData.clinicName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Phone Number *</label>
              <input
                type="tel"
                name="phone"
                value={clinicData.phone}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group full-width">
              <label>Address *</label>
              <input
                type="text"
                name="address"
                value={clinicData.address}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>City *</label>
              <input
                type="text"
                name="city"
                value={clinicData.city}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Postal Code</label>
              <input
                type="text"
                name="postalCode"
                value={clinicData.postalCode}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={clinicData.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Website</label>
              <input
                type="url"
                name="website"
                value={clinicData.website}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Emergency Contact</label>
              <input
                type="tel"
                name="emergencyContact"
                value={clinicData.emergencyContact}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group full-width">
              <label>Description</label>
              <textarea
                name="description"
                value={clinicData.description}
                onChange={handleInputChange}
                rows="3"
                placeholder="Brief description of your clinic and services..."
              />
            </div>
          </div>
        </div>

        {/* Working Hours */}
        <div className="form-section">
          <h3>🕐 Working Hours</h3>
          <div className="working-hours-grid">
            {daysOfWeek.map(({ key, label }) => (
              <div key={key} className="day-schedule">
                <div className="day-header">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={clinicData.workingHours[key].isOpen}
                      onChange={() => handleWorkingHoursChange(key, 'isOpen')}
                    />
                    <span>{label}</span>
                  </label>
                </div>
                {clinicData.workingHours[key].isOpen ? (
                  <div className="time-inputs">
                    <input
                      type="time"
                      value={clinicData.workingHours[key].open}
                      onChange={(e) => handleWorkingHoursChange(key, 'open', e.target.value)}
                    />
                    <span>to</span>
                    <input
                      type="time"
                      value={clinicData.workingHours[key].close}
                      onChange={(e) => handleWorkingHoursChange(key, 'close', e.target.value)}
                    />
                  </div>
                ) : (
                  <div className="closed-indicator">Closed</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Specializations */}
        <div className="form-section">
          <h3>⚕️ Specializations</h3>
          <div className="checkbox-grid">
            {specializations.map(spec => (
              <label key={spec} className="checkbox-item">
                <input
                  type="checkbox"
                  checked={clinicData.specializations.includes(spec)}
                  onChange={() => handleArrayChange('specializations', spec)}
                />
                <span>{spec}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Facilities */}
        <div className="form-section">
          <h3>🏢 Facilities</h3>
          <div className="checkbox-grid">
            {facilities.map(facility => (
              <label key={facility} className="checkbox-item">
                <input
                  type="checkbox"
                  checked={clinicData.facilities.includes(facility)}
                  onChange={() => handleArrayChange('facilities', facility)}
                />
                <span>{facility}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Insurance */}
        <div className="form-section">
          <h3>💳 Insurance Accepted</h3>
          <div className="checkbox-grid">
            {insuranceCompanies.map(insurance => (
              <label key={insurance} className="checkbox-item">
                <input
                  type="checkbox"
                  checked={clinicData.insuranceAccepted.includes(insurance)}
                  onChange={() => handleArrayChange('insuranceAccepted', insurance)}
                />
                <span>{insurance}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="save-btn" disabled={loading}>
            {loading ? '💾 Saving...' : `💾 ${isEditing ? 'Update' : 'Save'} Clinic Info`}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClinicForm;