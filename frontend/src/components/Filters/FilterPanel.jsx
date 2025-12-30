import React, { useState } from 'react';
import { X, Filter } from 'lucide-react';
import CategoryFilter from './CategoryFilter';
import TimeFilter from './TimeFilter';
import SearchBar from './SearchBar';
import './FilterPanel.css';

const FilterPanel = ({
  isOpen,
  onClose,
  activeCategory,
  onCategoryChange,
  activeTimeFilter,
  onTimeFilterChange,
  onSearch,
  onSearchClear,
}) => {
  if (!isOpen) return null;

  return (
    <div className="filter-panel-overlay" onClick={onClose}>
      <div className="filter-panel" onClick={(e) => e.stopPropagation()}>
        <div className="filter-panel-header">
          <div className="filter-header-title">
            <Filter size={20} />
            <h3>Filters</h3>
          </div>
          <button className="filter-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        <div className="filter-panel-content">
          <SearchBar onSearch={onSearch} onClear={onSearchClear} />
          
          <TimeFilter
            activeFilter={activeTimeFilter}
            onFilterChange={onTimeFilterChange}
          />
          
          <CategoryFilter
            activeCategory={activeCategory}
            onCategoryChange={onCategoryChange}
          />
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;

