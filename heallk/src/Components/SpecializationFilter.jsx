import React from 'react';
import { motion } from 'framer-motion';
import './SpecializationFilter.css';

const SPECIALIZATIONS = [
  { id: 1, name: 'Ayurvedic Physicians', icon: '🌿', color: 'from-green-600 to-emerald-600' },
  { id: 2, name: 'Panchakarma Specialists', icon: '💆', color: 'from-blue-600 to-cyan-600' },
  { id: 3, name: 'Wellness & Lifestyle Consultants', icon: '🧘', color: 'from-purple-600 to-pink-600' },
];

const SpecializationFilter = ({ selectedSpecialization, onSpecializationChange, searchTerm, onSearchChange }) => {
  return (
    <div className="specialization-filter">
      <h3 className="filter-title">Filter by Specialization</h3>
      
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

      {selectedSpecialization && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="active-filter-tag"
        >
          <span>Filtering by: <strong>{selectedSpecialization}</strong></span>
          <button 
            onClick={() => onSpecializationChange(null)}
            className="clear-filter-btn"
          >
            ✕
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default SpecializationFilter;
