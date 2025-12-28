import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Gift, BarChart2, Globe, Star, MapPin } from 'lucide-react';
import './Header.css';

const Header = ({ stats }) => {
  const location = useLocation();
  const isDashboard = location.pathname === '/santa-dashboard';

  return (
    <header className="app-header">
      <div className="header-content">
        <div className="header-title">
          <div className="title-row">
            <Gift className="header-icon" size={28} />
            <h1>Santa's Community Impact Map</h1>
          </div>
          <p>Visualizing acts of kindness and community impact across the globe</p>
        </div>
        {!isDashboard && (
          <Link to="/santa-dashboard" className="dashboard-link">
            <MapPin size={16} />
            Santa Dashboard
          </Link>
        )}

        {stats && (
          <div className="stats-bar">
            <div className="stat-item">
              <span className="stat-icon"><BarChart2 size={20} /></span>
              <div className="stat-content">
                <div className="stat-value">{stats.total_acts?.toLocaleString() || 0}</div>
                <div className="stat-label">Total Acts</div>
              </div>
            </div>

            <div className="stat-item">
              <span className="stat-icon"><Globe size={20} /></span>
              <div className="stat-content">
                <div className="stat-value">{stats.active_regions || 0}</div>
                <div className="stat-label">Active Regions</div>
              </div>
            </div>

            <div className="stat-item">
              <span className="stat-icon"><Star size={20} /></span>
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

