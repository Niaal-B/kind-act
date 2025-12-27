import React from 'react';
import { formatDate } from '../../utils/helpers';
import { CATEGORY_LABELS, CATEGORY_ICONS } from '../../utils/constants';
import './RegionInfo.css';

const RegionInfo = ({ regionData }) => {
  if (!regionData) {
    return (
      <div className="region-info">
        <p className="region-info-empty">Click on the map to see region details</p>
      </div>
    );
  }

  return (
    <div className="region-info visible">
      <h3 className="region-name">{regionData.city || 'Unknown Region'}</h3>
      
      <div className="info-item">
        <strong>Total Acts:</strong>
        <span>{regionData.total_acts || 0}</span>
      </div>
      
      <div className="info-item">
        <strong>This Week:</strong>
        <span>{regionData.acts_this_week || 0}</span>
      </div>

      {regionData.category_breakdown && Object.keys(regionData.category_breakdown).length > 0 && (
        <div className="category-breakdown">
          <h4>Category Breakdown</h4>
          <div className="breakdown-list">
            {Object.entries(regionData.category_breakdown).map(([category, count]) => (
              <div key={category} className="breakdown-item">
                <span className="breakdown-icon">{CATEGORY_ICONS[category]}</span>
                <span className="breakdown-label">{CATEGORY_LABELS[category]}</span>
                <span className="breakdown-count">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {regionData.recent_acts && regionData.recent_acts.length > 0 && (
        <div className="recent-acts">
          <h4>Recent Acts</h4>
          <div className="acts-list">
            {regionData.recent_acts.slice(0, 5).map((act) => (
              <div key={act.id} className="act-item">
                <div className="act-description">{act.description}</div>
                <div className="act-meta">
                  <span className="act-category">{CATEGORY_LABELS[act.category]}</span>
                  <span className="act-date">{formatDate(act.created_at)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RegionInfo;

