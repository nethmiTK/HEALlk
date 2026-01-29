import React from 'react';
import { motion } from 'framer-motion';
import './CategoryFilter.css';

const CATEGORIES = [
  { id: 1, name: 'Herbal Medicine', icon: '🌿' },
  { id: 2, name: 'Supplement', icon: '💊' },
  { id: 3, name: 'Oil', icon: '💧' },
  { id: 4, name: 'Powder', icon: '✨' },
  { id: 5, name: 'Capsule', icon: '⭕' },
  { id: 6, name: 'Tablet', icon: '⚪' },
];

const CategoryFilter = ({ selectedCategory, onCategoryChange, searchTerm, onSearchChange }) => {
  return (
    <div className="category-filter">
      <div className="filter-header">
        <h3 className="filter-title">Find Your Perfect Product</h3>
      </div>
      
      {/* Search Input */}
      <div className="search-input-wrapper">
        <input
          type="text"
          placeholder="🔍 Search products by name or ingredients..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="search-input"
        />
      </div>
      
      <div className="filter-options">
        {/* Category options */}
        {CATEGORIES.map((category) => (
          <motion.button
            key={category.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onCategoryChange(category.name)}
            className={`filter-btn category-btn ${selectedCategory === category.name ? 'active' : ''}`}
          >
            <span className="filter-icon">{category.icon}</span>
            <span className="filter-label">{category.name}</span>
          </motion.button>
        ))}
      </div>

      {selectedCategory !== 'All' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="active-filter-tag"
        >
          <span>Filtering by: <strong>{selectedCategory}</strong></span>
          <button 
            onClick={() => onCategoryChange('All')}
            className="clear-filter-btn"
          >
            ✕
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default CategoryFilter;
