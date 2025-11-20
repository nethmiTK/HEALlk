import React, { useState, useEffect } from 'react';

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

  const [isEditing, setIsEditing] = useState(false);
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
    // Load existing clinic data
    const loadClinicData = () => {
      const mockData = {
        clinicName: 'HEALlk Medical Center',
        address: '123 Main Street',
        city: 'Colombo',
        postalCode: '00100',
        phone: '+94 11 234 5678',
        email: 'info@heallk.com',
        website: 'www.heallk.com',
        description: 'Modern medical center providing comprehensive healthcare services with experienced doctors and state-of-the-art facilities.',
        specializations: ['General Medicine', 'Cardiology', 'Neurology'],
        facilities: ['Parking', 'Laboratory', 'X-Ray', 'ECG', 'Pharmacy'],
        workingHours: {
          monday: { open: '09:00', close: '17:00', isOpen: true },
          tuesday: { open: '09:00', close: '17:00', isOpen: true },
          wednesday: { open: '09:00', close: '17:00', isOpen: true },
          thursday: { open: '09:00', close: '17:00', isOpen: true },
          friday: { open: '09:00', close: '17:00', isOpen: true },
          saturday: { open: '09:00', close: '13:00', isOpen: true },
          sunday: { open: '09:00', close: '17:00', isOpen: false }
        },
        emergencyContact: '+94 77 123 4567',
        insuranceAccepted: ['Ceylinco Insurance', 'AIA Insurance', 'Union Assurance'],
        images: []
      };
      setClinicData(mockData);
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

  const handleSave = (e) => {
    e.preventDefault();
    // Here you would typically save to API
    console.log('Saving clinic data:', clinicData);
    setIsEditing(false);
    alert('Clinic information updated successfully!');
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
          {!isEditing ? (
            <button 
              className="btn btn-primary"
              onClick={() => setIsEditing(true)}
            >
              ✏️ Edit Information
            </button>
          ) : (
            <div className="edit-actions">
              <button 
                className="btn btn-secondary"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleSave}
              >
                💾 Save Changes
              </button>
            </div>
          )}
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
                      disabled={!isEditing}
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
                      disabled={!isEditing}
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
                    disabled={!isEditing}
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
                      disabled={!isEditing}
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
                      disabled={!isEditing}
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
                      disabled={!isEditing}
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
                      disabled={!isEditing}
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
                    disabled={!isEditing}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={clinicData.description}
                    onChange={handleInputChange}
                    disabled={!isEditing}
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
                          disabled={!isEditing}
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
                          disabled={!isEditing}
                        />
                        <span className="time-separator">to</span>
                        <input
                          type="time"
                          value={clinicData.workingHours[key].close}
                          onChange={(e) => handleWorkingHoursChange(key, 'close', e.target.value)}
                          disabled={!isEditing}
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
                      disabled={!isEditing}
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
                      disabled={!isEditing}
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
                      disabled={!isEditing}
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