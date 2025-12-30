import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Gift, BarChart2, Globe, Star, MapPin } from 'lucide-react';
import './Header.css';

const Header = ({ stats }) => {
  const location = useLocation();
  const isDashboard = location.pathname === '/santa-dashboard';

  return (
    <header className="layout-header">
      <div className="header-container">
        <div className="header-content">
          <div className="header-left">
            <Gift className="header-icon" />
            <div className="header-text">
              <h1 className="header-title">Santa's Community Impact Map</h1>
              <p className="header-subtitle">
                Visualizing acts of kindness across the globe
              </p>
            </div>
          </div>
          
          {!isDashboard && (
            <Link 
              to="/santa-dashboard" 
              className="header-link"
            >
              <MapPin className="header-link-icon" />
              Santa Dashboard
            </Link>
          )}

          {stats && (
            <div className="header-stats">
              <div className="stat-item">
                <BarChart2 className="stat-icon" />
                <div className="stat-content">
                  <div className="stat-value">{stats.total_acts?.toLocaleString() || 0}</div>
                  <div className="stat-label">Total Acts</div>
                </div>
              </div>

              <div className="stat-item">
                <Globe className="stat-icon" />
                <div className="stat-content">
                  <div className="stat-value">{stats.active_regions || 0}</div>
                  <div className="stat-label">Regions</div>
                </div>
              </div>

              <div className="stat-item">
                <Star className="stat-icon" />
                <div className="stat-content">
                  <div className="stat-value">{stats.top_region?.city || 'N/A'}</div>
                  <div className="stat-label">
                    Top Region {stats.top_region?.count ? `(${stats.top_region.count})` : ''}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
