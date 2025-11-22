import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { API_BASE_URL } from '../config';

const ClinicInfo = () => {
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
    insuranceAccepted: [],
    images: []
  });

  const [activeTab, setActiveTab] = useState('basic');

  const availableSpecializations = [
    'General Medicine',
    'Cardiology',
    'Neurology',
    'Orthopedics',
    'Dermatology',
    'Pediatrics',
    'Gynecology',
    'Psychiatry',
    'Surgery',
    'Ophthalmology'
  ];

  const availableFacilities = [
    'Parking',
    'Wheelchair Accessible',
    'Laboratory',
    'X-Ray',
    'ECG',
    'Ultrasound',
    'Pharmacy',
    'Emergency Care',
    'Online Consultation',
    'Home Visits'
  ];

  const insuranceCompanies = [
    'Ceylinco Insurance',
    'Sri Lanka Insurance',
    'AIA Insurance',
    'Allianz Insurance',
    'Union Assurance',
    'Janashakthi Insurance',
    'Continental Insurance',
    'HNB Assurance'
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
    const loadClinicData = async () => {
      try {
        const token = localStorage.getItem('heallk_token');
        if (!token) {
          console.warn('No authentication token found. User might not be logged in.');
          return;
        }

        const response = await fetch(`${API_BASE_URL}/clinics`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.clinicInfo.working_hours) data.clinicInfo.workingHours = data.clinicInfo.working_hours;
          if (data.clinicInfo.insurance_accepted) data.clinicInfo.insuranceAccepted = data.clinicInfo.insurance_accepted;

          setClinicData(prev => ({
            ...prev,
            ...data.clinicInfo,
            // Ensure the correct primary key is used from the backend response
            id: data.clinicInfo.id || null,
            workingHours: data.clinicInfo.working_hours || prev.workingHours,
            insuranceAccepted: data.clinicInfo.insurance_accepted || prev.insuranceAccepted,
          }));
          toast.success('Clinic information loaded successfully!');
        } else if (response.status === 404) {
          console.info('No existing clinic information found for this user. Starting fresh.');
          toast.info('No clinic information found. Please add your clinic details.');
        } else {
          throw new Error('Failed to load clinic information');
        }
      } catch (error) {
        console.error('Error loading clinic data:', error);
        toast.error(error.message || 'Failed to load clinic information.');
      }
    };

    loadClinicData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setClinicData(prev => ({
      ...prev,
      [name]: value
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

  const handleArrayFieldChange = (field, value) => {
    setClinicData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('heallk_token');
      if (!token) {
        toast.error('Authentication token not found. Please log in.');
        return;
      }

      // Use clinicData.id to determine if it's an update or new entry
      const method = clinicData.id ? 'PUT' : 'POST'; 
      const url = `${API_BASE_URL}/clinics`;

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(clinicData),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(data.message);
        // If adding new data, update the clinicData state with the new id from the backend
        if (method === 'POST' && data.clinicId) {
            setClinicData(prev => ({ ...prev, id: data.clinicId }));
        }
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save clinic information');
      }
    } catch (error) {
      console.error('Error saving clinic data:', error);
      toast.error(error.message || 'Failed to save clinic information.');
    }
  };

  return (
    <div className="clinic-info-container">
      {/* Page Header */}
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">Clinic Information</h1>
          <p className="page-subtitle">Manage your clinic details and settings</p>
        </div>
        <div className="header-actions">
            <button 
              className="btn btn-primary"
              onClick={handleSave}
            >
              💾 Save Changes
            </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button 
          className={`tab-btn ${activeTab === 'basic' ? 'active' : ''}`}
          onClick={() => setActiveTab('basic')}
        >
          📋 Basic Info
        </button>
        <button 
          className={`tab-btn ${activeTab === 'hours' ? 'active' : ''}`}
          onClick={() => setActiveTab('hours')}
        >
          🕐 Working Hours
        </button>
        <button 
          className={`tab-btn ${activeTab === 'services' ? 'active' : ''}`}
          onClick={() => setActiveTab('services')}
        >
          ⚕️ Services & Facilities
        </button>
        <button 
          className={`tab-btn ${activeTab === 'insurance' ? 'active' : ''}`}
          onClick={() => setActiveTab('insurance')}
        >
          💳 Insurance
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {/* Basic Information Tab */}
        {activeTab === 'basic' && (
          <div className="basic-info-tab">
            <form className="clinic-form">
              <div className="form-section">
                <h3 className="section-title">Basic Information</h3>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="clinicName">Clinic Name</label>
                    <input
                      type="text"
                      id="clinicName"
                      name="clinicName"
                      value={clinicData.clinicName}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="phone">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={clinicData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="address">Address</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={clinicData.address}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="city">City</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={clinicData.city}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="postalCode">Postal Code</label>
                    <input
                      type="text"
                      id="postalCode"
                      name="postalCode"
                      value={clinicData.postalCode}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={clinicData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="website">Website</label>
                    <input
                      type="url"
                      id="website"
                      name="website"
                      value={clinicData.website}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="emergencyContact">Emergency Contact</label>
                  <input
                    type="tel"
                    id="emergencyContact"
                    name="emergencyContact"
                    value={clinicData.emergencyContact}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={clinicData.description}
                    onChange={handleInputChange}
                    rows="4"
                    placeholder="Describe your clinic and services..."
                  ></textarea>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Working Hours Tab */}
        {activeTab === 'hours' && (
          <div className="working-hours-tab">
            <div className="form-section">
              <h3 className="section-title">Working Hours</h3>
              
              <div className="hours-grid">
                {daysOfWeek.map(({ key, label }) => (
                  <div key={key} className="day-hours">
                    <div className="day-header">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={clinicData.workingHours[key].isOpen}
                          onChange={() => handleWorkingHoursChange(key, 'isOpen')}
                        />
                        <span className="day-name">{label}</span>
                      </label>
                    </div>
                    
                    {clinicData.workingHours[key].isOpen && (
                      <div className="time-inputs">
                        <input
                          type="time"
                          value={clinicData.workingHours[key].open}
                          onChange={(e) => handleWorkingHoursChange(key, 'open', e.target.value)}
                        />
                        <span className="time-separator">to</span>
                        <input
                          type="time"
                          value={clinicData.workingHours[key].close}
                          onChange={(e) => handleWorkingHoursChange(key, 'close', e.target.value)}
                        />
                      </div>
                    )}
                    
                    {!clinicData.workingHours[key].isOpen && (
                      <div className="closed-indicator">Closed</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Services & Facilities Tab */}
        {activeTab === 'services' && (
          <div className="services-tab">
            <div className="form-section">
              <h3 className="section-title">Specializations</h3>
              <div className="checkbox-grid">
                {availableSpecializations.map(specialization => (
                  <label key={specialization} className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={clinicData.specializations.includes(specialization)}
                      onChange={() => handleArrayFieldChange('specializations', specialization)}
                    />
                    <span className="checkbox-text">{specialization}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="form-section">
              <h3 className="section-title">Facilities Available</h3>
              <div className="checkbox-grid">
                {availableFacilities.map(facility => (
                  <label key={facility} className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={clinicData.facilities.includes(facility)}
                      onChange={() => handleArrayFieldChange('facilities', facility)}
                    />
                    <span className="checkbox-text">{facility}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Insurance Tab */}
        {activeTab === 'insurance' && (
          <div className="insurance-tab">
            <div className="form-section">
              <h3 className="section-title">Insurance Companies Accepted</h3>
              <div className="checkbox-grid">
                {insuranceCompanies.map(insurance => (
                  <label key={insurance} className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={clinicData.insuranceAccepted.includes(insurance)}
                      onChange={() => handleArrayFieldChange('insuranceAccepted', insurance)}
                    />
                    <span className="checkbox-text">{insurance}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClinicInfo;