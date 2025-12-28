import React from 'react';
import { CATEGORIES, CATEGORY_LABELS, CATEGORY_ICONS } from '../../utils/constants';
import { Sparkles, Utensils, Shirt, Clock, Banknote, Gift } from 'lucide-react';
import './CategoryFilter.css';

const ICON_MAP = {
  Sparkles,
  Utensils,
  Shirt,
  Clock,
  Banknote,
  Gift,
};

const CategoryFilter = ({ activeCategory, onCategoryChange }) => {
  const categories = [
    CATEGORIES.ALL,
    CATEGORIES.FOOD,
    CATEGORIES.CLOTHING,
    CATEGORIES.TIME,
    CATEGORIES.MONEY,
    CATEGORIES.OTHER,
  ];

  const getIcon = (iconName) => {
    const IconComponent = ICON_MAP[iconName] || Sparkles;
    return <IconComponent size={16} />;
  };

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
            <span className="filter-icon">
              {getIcon(CATEGORY_ICONS[category])}
            </span>
            <span className="filter-label">{CATEGORY_LABELS[category]}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;

