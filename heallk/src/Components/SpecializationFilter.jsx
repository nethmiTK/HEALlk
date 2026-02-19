import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './SpecializationFilter.css';

const SPECIALIZATIONS = [
  { id: 1, name: 'Ayurvedic Physicians', icon: '🌿', bg: '#e8f5e9', active: '#2e7d32' },
  { id: 2, name: 'Panchakarma Specialists', icon: '💆', bg: '#e3f2fd', active: '#1565c0' },
  { id: 3, name: 'Wellness & Lifestyle Consultants', icon: '🧘', bg: '#f3e5f5', active: '#6a1b9a' },
];

const SRI_LANKA_DISTRICTS = [
  'Ampara', 'Anuradhapura', 'Badulla', 'Batticaloa', 'Colombo', 'Galle',
  'Gampaha', 'Jaffna', 'Kalutara', 'Kandy', 'Kegalle', 'Kilinochchi',
  'Kurunegala', 'Mannar', 'Matara', 'Monaragala', 'Mullaitivu',
  'Nuwara Eliya', 'Polonnaruwa', 'Puttalam', 'Ratnapura', 'Trincomalee', 'Vavuniya',
];

const SpecializationFilter = ({
  selectedSpecialization,
  onSpecializationChange,
  selectedDistrict,
  onDistrictChange,
  searchTerm,
  onSearchChange,
  totalResults,
}) => {
  const [searchFocused, setSearchFocused] = useState(false);

  const hasActiveFilters = selectedSpecialization || selectedDistrict || searchTerm?.trim();

  const clearAll = () => {
    onSpecializationChange(null);
    onDistrictChange(null);
    onSearchChange('');
  };

  return (
    <div className="sf-wrapper">
      {/* ── Top bar: title + result count + clear all ── */}
      <div className="sf-topbar">
        <div className="sf-topbar-left">
          <span className="sf-funnel-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
          </span>
          <span className="sf-title">Find Doctors</span>
        </div>
        <div className="sf-topbar-right">
          {totalResults !== undefined && (
            <span className="sf-result-count">{totalResults} result{totalResults !== 1 ? 's' : ''}</span>
          )}
          <AnimatePresence>
            {hasActiveFilters && (
              <motion.button
                key="clear-all"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={clearAll}
                className="sf-clear-all"
              >
                Clear all
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Search ── */}
      <div className={`sf-search-wrap ${searchFocused ? 'focused' : ''}`}>
        <span className="sf-search-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </span>
        <input
          type="text"
          placeholder="Search by doctor name…"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          className="sf-search-input"
        />
        <AnimatePresence>
          {searchTerm && (
            <motion.button
              key="clear-search"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              onClick={() => onSearchChange('')}
              className="sf-search-clear"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* ── Divider ── */}
      <div className="sf-divider" />

      {/* ── Specialization chips ── */}
      <div className="sf-section">
        <p className="sf-section-label">Specialization</p>
        <div className="sf-chip-row">
          {/* All chip */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => onSpecializationChange(null)}
            className={`sf-chip sf-chip-all ${!selectedSpecialization ? 'sf-chip-all-active' : ''}`}
          >
            All
          </motion.button>

          {SPECIALIZATIONS.map((spec) => {
            const isActive = selectedSpecialization === spec.name;
            return (
              <motion.button
                key={spec.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => onSpecializationChange(isActive ? null : spec.name)}
                className={`sf-chip sf-chip-spec ${isActive ? 'sf-chip-spec-active' : ''}`}
                style={isActive ? { background: spec.active, borderColor: spec.active } : {}}
              >
                <span className="sf-chip-icon">{spec.icon}</span>
                {spec.name}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* ── District dropdown ── */}
      <div className="sf-section">
        <p className="sf-section-label">District</p>
        <div className="sf-select-wrap">
          <span className="sf-select-icon">📍</span>
          <select
            value={selectedDistrict || ''}
            onChange={(e) => onDistrictChange(e.target.value || null)}
            className="sf-select"
          >
            <option value="">All Districts</option>
            {SRI_LANKA_DISTRICTS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          <span className="sf-select-arrow">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </span>
        </div>
      </div>

      {/* ── Active filter tags ── */}
      <AnimatePresence>
        {hasActiveFilters && (
          <motion.div
            key="active-tags"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="sf-active-tags"
          >
            <div className="sf-divider" style={{ marginBottom: '12px' }} />
            <p className="sf-section-label" style={{ marginBottom: '8px' }}>Active filters</p>
            <div className="sf-tag-row">
              {selectedSpecialization && (
                <motion.span
                  key="tag-spec"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  className="sf-tag sf-tag-green"
                >
                  {SPECIALIZATIONS.find(s => s.name === selectedSpecialization)?.icon} {selectedSpecialization}
                  <button onClick={() => onSpecializationChange(null)} className="sf-tag-x">✕</button>
                </motion.span>
              )}
              {selectedDistrict && (
                <motion.span
                  key="tag-dist"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  className="sf-tag sf-tag-blue"
                >
                  📍 {selectedDistrict}
                  <button onClick={() => onDistrictChange(null)} className="sf-tag-x">✕</button>
                </motion.span>
              )}
              {searchTerm?.trim() && (
                <motion.span
                  key="tag-search"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  className="sf-tag sf-tag-purple"
                >
                  🔍 "{searchTerm.trim()}"
                  <button onClick={() => onSearchChange('')} className="sf-tag-x">✕</button>
                </motion.span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SpecializationFilter;
