import React from 'react';
import './TimeFilter.css';

const TIME_FILTERS = {
  ALL: 'all',
  TODAY: 'today',
  THIS_WEEK: 'this_week',
  THIS_MONTH: 'this_month',
};

const TimeFilter = ({ activeFilter, onFilterChange }) => {
  return (
    <div className="time-filter">
      <h3 className="filter-title">Time Period</h3>
      <div className="filter-buttons">
        <button
          className={`filter-btn ${activeFilter === TIME_FILTERS.ALL ? 'active' : ''}`}
          onClick={() => onFilterChange(TIME_FILTERS.ALL)}
        >
          All Time
        </button>
        <button
          className={`filter-btn ${activeFilter === TIME_FILTERS.TODAY ? 'active' : ''}`}
          onClick={() => onFilterChange(TIME_FILTERS.TODAY)}
        >
          Today
        </button>
        <button
          className={`filter-btn ${activeFilter === TIME_FILTERS.THIS_WEEK ? 'active' : ''}`}
          onClick={() => onFilterChange(TIME_FILTERS.THIS_WEEK)}
        >
          This Week
        </button>
        <button
          className={`filter-btn ${activeFilter === TIME_FILTERS.THIS_MONTH ? 'active' : ''}`}
          onClick={() => onFilterChange(TIME_FILTERS.THIS_MONTH)}
        >
          This Month
        </button>
      </div>
    </div>
  );
};

export default TimeFilter;
export { TIME_FILTERS };

