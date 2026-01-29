import React from 'react';
import { motion } from 'framer-motion';
import './SpecializationFilter.css';

const SPECIALIZATIONS = [
  { id: 1, name: 'Ayurvedic Physicians', icon: '🌿', color: 'from-green-600 to-emerald-600' },
  { id: 2, name: 'Panchakarma Specialists', icon: '💆', color: 'from-blue-600 to-cyan-600' },
  { id: 3, name: 'Wellness & Lifestyle Consultants', icon: '🧘', color: 'from-purple-600 to-pink-600' },
];

const SRI_LANKA_DISTRICTS = [
  'Ampara', 'Anuradhapura', 'Badulla', 'Batticaloa', 'Colombo', 'Galle',
  'Gampaha', 'Jaffna', 'Kalutara', 'Kandy', 'Kegalle', 'Kilinochchi',
  'Kurunegala', 'Madurai', 'Mannar', 'Matara', 'Maturai', 'Monaragala',
  'Mullaitivu', 'Nuwara Eliya', 'Polonnaruwa', 'Puttalam', 'Ratnapura',
  'Ruwanella', 'Trincomalee', 'Vavuniya'
];

const SpecializationFilter = ({ 
  selectedSpecialization, 
  onSpecializationChange, 
  selectedDistrict,
  onDistrictChange,
  searchTerm, 
  onSearchChange 
}) => {
  return (
    <div className="specialization-filter">
      <h3 className="filter-title">Filter Doctors</h3>
      
      {/* Search Input */}
      <div className="search-input-wrapper">
        <input
          type="text"
          placeholder="Search doctors by name..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="search-input"
        />
      </div>
      
      <div className="filter-options">
        {/* Specialization options */}
        <div className="filter-section">
          <h4 className="filter-section-title">By Specialization</h4>
          <div className="filter-buttons-group">
            {SPECIALIZATIONS.map((spec) => (
              <motion.button
                key={spec.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onSpecializationChange(spec.name)}
                className={`filter-btn spec-btn ${selectedSpecialization === spec.name ? 'active' : ''}`}
              >
                <span className="filter-icon">{spec.icon}</span>
                <span className="filter-label">{spec.name}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* District Filter */}
        <div className="filter-section">
          <h4 className="filter-section-title">By District</h4>
          <select
            value={selectedDistrict || ''}
            onChange={(e) => onDistrictChange(e.target.value || null)}
            className="district-filter-select"
          >
            <option value="">All Districts</option>
            {SRI_LANKA_DISTRICTS.map((district) => (
              <option key={district} value={district}>
                📍 {district}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Filters Display */}
      <div className="active-filters">
        {selectedSpecialization && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="filter-tag spec-tag"
          >
            <span>📚 {selectedSpecialization}</span>
            <button 
              onClick={() => onSpecializationChange(null)}
              className="clear-filter-btn"
            >
              ✕
            </button>
          </motion.div>
        )}
        
        {selectedDistrict && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="filter-tag district-tag"
          >
            <span>📍 {selectedDistrict}</span>
            <button 
              onClick={() => onDistrictChange(null)}
              className="clear-filter-btn"
            >
              ✕
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SpecializationFilter;
