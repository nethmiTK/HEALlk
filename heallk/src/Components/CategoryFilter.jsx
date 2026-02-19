import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './CategoryFilter.css';

const CATEGORIES = [
  { id: 1, name: 'All', icon: '🏪', color: '#374151' },
  { id: 2, name: 'Herbal Medicine', icon: '🌿', color: '#15803d' },
  { id: 3, name: 'Supplement', icon: '💊', color: '#0369a1' },
  { id: 4, name: 'Oil', icon: '💧', color: '#b45309' },
  { id: 5, name: 'Powder', icon: '✨', color: '#7c3aed' },
  { id: 6, name: 'Capsule', icon: '⭕', color: '#be185d' },
  { id: 7, name: 'Tablet', icon: '⚪', color: '#0f766e' },
];

const CategoryFilter = ({
  selectedCategory,
  onCategoryChange,
  searchTerm,
  onSearchChange,
  totalCount,
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <div className="cf-bar">
      {/* ── Left: search ── */}
      <div className={`cf-search ${focused ? 'cf-search--focused' : ''}`}>
        <svg className="cf-search__icon" width="16" height="16" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2.2"
          strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          placeholder="Search products…"
          value={searchTerm}
          onChange={e => onSearchChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="cf-search__input"
        />
        <AnimatePresence>
          {searchTerm && (
            <motion.button
              key="x"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              onClick={() => onSearchChange('')}
              className="cf-search__clear"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* ── Divider (visible on wide screens) ── */}
      <div className="cf-vdivider" />

      {/* ── Category pills ── */}
      <div className="cf-pills">
        {CATEGORIES.map(cat => {
          const active = selectedCategory === cat.name;
          return (
            <motion.button
              key={cat.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => onCategoryChange(cat.name)}
              className={`cf-pill ${active ? 'cf-pill--active' : ''}`}
              style={active ? { background: cat.color, borderColor: cat.color } : {}}
              title={cat.name}
            >
              <span className="cf-pill__icon">{cat.icon}</span>
              <span className="cf-pill__label">{cat.name}</span>
            </motion.button>
          );
        })}
      </div>

      {/* ── Right: count badge ── */}
      {totalCount !== undefined && (
        <div className="cf-count">
          <span>{totalCount}</span>
          <span className="cf-count__label">{totalCount === 1 ? 'item' : 'items'}</span>
        </div>
      )}
    </div>
  );
};

export default CategoryFilter;
