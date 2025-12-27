import React from 'react';
import './Header.css';

const Header = ({ stats }) => {
  return (
    <header className="app-header">
      <div className="header-content">
        <div className="header-title">
          <h1>🎅 Santa's Community Impact Map</h1>
          <p>Visualizing acts of kindness and community impact across the globe</p>
        </div>
        
        {stats && (
          <div className="stats-bar">
            <div className="stat-item">
              <span className="stat-icon">📊</span>
              <div className="stat-content">
                <div className="stat-value">{stats.total_acts?.toLocaleString() || 0}</div>
                <div className="stat-label">Total Acts</div>
              </div>
            </div>
            
            <div className="stat-item">
              <span className="stat-icon">🌍</span>
              <div className="stat-content">
                <div className="stat-value">{stats.active_regions || 0}</div>
                <div className="stat-label">Active Regions</div>
              </div>
            </div>
            
            <div className="stat-item">
              <span className="stat-icon">⭐</span>
              <div className="stat-content">
                <div className="stat-value">
                  {stats.top_region?.city || 'N/A'}
                </div>
                <div className="stat-label">
                  Top Region {stats.top_region?.count ? `(${stats.top_region.count} acts)` : ''}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

