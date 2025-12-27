import React, { useState } from 'react';
import CategoryFilter from '../Filters/CategoryFilter';
import TimeFilter, { TIME_FILTERS } from '../Filters/TimeFilter';
import SearchBar from '../Filters/SearchBar';
import RegionInfo from './RegionInfo';
import AnalyticsPanel from './AnalyticsPanel';
import ExportButton from './ExportButton';
import SubmissionForm from '../Forms/SubmissionForm';
import { CATEGORIES } from '../../utils/constants';
import './Sidebar.css';

const Sidebar = ({ activeCategory, onCategoryChange, activeTimeFilter, onTimeFilterChange, regionData, onSubmitAct, stats, acts, showAnalytics = false, onSearch, onSearchClear }) => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="sidebar">
      {!showForm ? (
        <>
          <SearchBar onSearch={onSearch} onClear={onSearchClear} />
          
          <TimeFilter
            activeFilter={activeTimeFilter}
            onFilterChange={onTimeFilterChange}
          />
          
          <CategoryFilter
            activeCategory={activeCategory}
            onCategoryChange={onCategoryChange}
          />

          {showAnalytics && stats && acts && (
            <>
              <AnalyticsPanel stats={stats} acts={acts} />
              <ExportButton acts={acts} stats={stats} />
            </>
          )}

          <RegionInfo regionData={regionData} />

          <button
            className="submit-btn"
            onClick={() => setShowForm(true)}
          >
            + Add Your Act of Kindness
          </button>
        </>
      ) : (
        <SubmissionForm
          onSubmit={async (data) => {
            await onSubmitAct(data);
            setShowForm(false);
          }}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default Sidebar;

