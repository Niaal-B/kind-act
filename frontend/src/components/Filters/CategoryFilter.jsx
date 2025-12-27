import React from 'react';
import { CATEGORIES, CATEGORY_LABELS, CATEGORY_ICONS } from '../../utils/constants';
import './CategoryFilter.css';

const CategoryFilter = ({ activeCategory, onCategoryChange }) => {
  const categories = [
    CATEGORIES.ALL,
    CATEGORIES.FOOD,
    CATEGORIES.CLOTHING,
    CATEGORIES.TIME,
    CATEGORIES.MONEY,
    CATEGORIES.OTHER,
  ];

  return (
    <div className="category-filter">
      <h3 className="filter-title">Filter by Category</h3>
      <div className="filter-buttons">
        {categories.map((category) => (
          <button
            key={category}
            className={`filter-btn ${activeCategory === category ? 'active' : ''}`}
            onClick={() => onCategoryChange(category)}
            aria-label={`Filter by ${CATEGORY_LABELS[category]}`}
          >
            <span className="filter-icon">{CATEGORY_ICONS[category]}</span>
            <span className="filter-label">{CATEGORY_LABELS[category]}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;

