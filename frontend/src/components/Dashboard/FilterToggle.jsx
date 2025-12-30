import React from 'react';
import { Filter } from 'lucide-react';
import './FilterToggle.css';

const FilterToggle = ({ onClick, filterCount = 0 }) => {
  return (
    <button className="filter-toggle-btn" onClick={onClick}>
      <Filter size={20} />
      <span>Filters</span>
      {filterCount > 0 && <span className="filter-badge">{filterCount}</span>}
    </button>
  );
};

export default FilterToggle;

