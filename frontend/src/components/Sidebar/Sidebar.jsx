import React, { useState } from 'react';
import CategoryFilter from '../Filters/CategoryFilter';
import RegionInfo from './RegionInfo';
import SubmissionForm from '../Forms/SubmissionForm';
import { CATEGORIES } from '../../utils/constants';
import './Sidebar.css';

const Sidebar = ({ activeCategory, onCategoryChange, regionData, onSubmitAct }) => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="sidebar">
      {!showForm ? (
        <>
          <CategoryFilter
            activeCategory={activeCategory}
            onCategoryChange={onCategoryChange}
          />

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

