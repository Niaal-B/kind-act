import React from 'react';
import { Map, BarChart3, LogOut, ShieldCheck } from 'lucide-react';
import './NavigationSidebar.css';

const NavigationSidebar = ({ activeView, onViewChange, onLogout }) => {
  return (
    <div className="navigation-sidebar">
      <div className="nav-header">
        <div className="nav-logo">
          <ShieldCheck size={24} />
          <span>Santa Dashboard</span>
        </div>
      </div>
      
      <nav className="nav-menu">
        <button
          className={`nav-item ${activeView === 'map' ? 'active' : ''}`}
          onClick={() => onViewChange('map')}
        >
          <Map size={20} />
          <span>Map View</span>
        </button>
        
        <button
          className={`nav-item ${activeView === 'stats' ? 'active' : ''}`}
          onClick={() => onViewChange('stats')}
        >
          <BarChart3 size={20} />
          <span>Statistics</span>
        </button>
      </nav>
      
      <div className="nav-footer">
        <button className="nav-item logout" onClick={onLogout}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default NavigationSidebar;

