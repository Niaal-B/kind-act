import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MapView from '../components/Map/MapView';
import NavigationSidebar from '../components/Navigation/NavigationSidebar';
import FilterPanel from '../components/Filters/FilterPanel';
import FilterToggle from '../components/Dashboard/FilterToggle';
import AnalyticsPanel from '../components/Sidebar/AnalyticsPanel';
import ExportButton from '../components/Sidebar/ExportButton';
import ActDetails from '../components/Map/ActDetails';
import { actsAPI } from '../services/api';
import api from '../services/api';
import { CATEGORIES } from '../utils/constants';
import { TIME_FILTERS } from '../components/Filters/TimeFilter';
import { LayoutDashboard, ArrowLeft } from 'lucide-react';
import './SantaDashboard.css';

const SantaDashboard = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeView, setActiveView] = useState('map'); // 'map' or 'stats'
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);

  const [acts, setActs] = useState([]);
  const [filteredActs, setFilteredActs] = useState([]);
  const [stats, setStats] = useState(null);
  const [activeCategory, setActiveCategory] = useState(CATEGORIES.ALL);
  const [activeTimeFilter, setActiveTimeFilter] = useState(TIME_FILTERS.ALL);
  const [searchTerm, setSearchTerm] = useState('');
  const [mapCenter, setMapCenter] = useState([20, 0]);
  const [mapZoom, setMapZoom] = useState(2);
  const [nearbyActs, setNearbyActs] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Filter acts when category or time filter changes
  useEffect(() => {
    if (!Array.isArray(acts)) {
      setFilteredActs([]);
      return;
    }

    let filtered = [...acts];

    // Apply category filter
    if (activeCategory !== CATEGORIES.ALL) {
      filtered = filtered.filter(act => act.category === activeCategory);
    }

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(act => {
        const cityMatch = act.city && act.city.toLowerCase().includes(searchLower);
        const countryMatch = act.country && act.country.toLowerCase().includes(searchLower);
        const descMatch = act.description && act.description.toLowerCase().includes(searchLower);
        return cityMatch || countryMatch || descMatch;
      });
    }

    // Apply time filter
    if (activeTimeFilter !== TIME_FILTERS.ALL) {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);
      const monthAgo = new Date(today);
      monthAgo.setMonth(monthAgo.getMonth() - 1);

      filtered = filtered.filter(act => {
        const actDate = new Date(act.created_at);
        switch (activeTimeFilter) {
          case TIME_FILTERS.TODAY:
            return actDate >= today;
          case TIME_FILTERS.THIS_WEEK:
            return actDate >= weekAgo;
          case TIME_FILTERS.THIS_MONTH:
            return actDate >= monthAgo;
          default:
            return true;
        }
      });
    }

    setFilteredActs(filtered);

    // If search term and results exist, center map on first result
    if (searchTerm && filtered.length > 0 && activeView === 'map') {
      const firstResult = filtered[0];
      setMapCenter([parseFloat(firstResult.latitude), parseFloat(firstResult.longitude)]);
      setMapZoom(8);
    }
  }, [acts, activeCategory, activeTimeFilter, searchTerm, activeView]);

  // Check if already authenticated (simple session check)
  useEffect(() => {
    const authStatus = localStorage.getItem('santa_authenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
      fetchData();
    }
  }, []);

  const fetchData = () => {
    fetchActs();
    fetchStats();
  };

  const fetchActs = async () => {
    try {
      const response = await actsAPI.getAll();
      const actsData = Array.isArray(response.data)
        ? response.data
        : (response.data.results || []);
      setActs(actsData);
      setFilteredActs(actsData);
    } catch (err) {
      console.error('Error fetching acts:', err);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await actsAPI.getStats();
      setStats(response.data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/admin/check-password/', { password });

      if (response.data.success) {
        setIsAuthenticated(true);
        localStorage.setItem('santa_authenticated', 'true');
        fetchData();
      } else {
        setError('Invalid password. Please try again.');
      }
    } catch (err) {
      setError('Authentication failed. Please try again.');
      console.error('Auth error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('santa_authenticated');
    setPassword('');
  };

  const handleMapClick = async (coords) => {
    try {
      // First try to fetch nearby acts
      const nearbyResponse = await actsAPI.nearbyActs({
        lat: coords.lat,
        lng: coords.lng,
        radius: 0.05, // ~5km radius (increased for better results)
      });
      
      if (nearbyResponse.data.acts && nearbyResponse.data.acts.length > 0) {
        setNearbyActs(nearbyResponse.data.acts);
        setSelectedLocation(coords);
      } else {
        // If no nearby acts, get region data and use recent_acts for Instagram display
        const response = await actsAPI.getRegion({
          lat: coords.lat,
          lng: coords.lng,
        });
        
        // Use recent_acts from region data for Instagram-style display
        if (response.data.recent_acts && response.data.recent_acts.length > 0) {
          setNearbyActs(response.data.recent_acts);
          setSelectedLocation(coords);
        } else {
          // No acts at all, clear everything
          setNearbyActs([]);
          setSelectedLocation(null);
        }
      }
    } catch (err) {
      console.error('Error fetching nearby acts:', err);
      // On error, try region endpoint as fallback
      try {
        const response = await actsAPI.getRegion({
          lat: coords.lat,
          lng: coords.lng,
        });
        if (response.data.recent_acts && response.data.recent_acts.length > 0) {
          setNearbyActs(response.data.recent_acts);
          setSelectedLocation(coords);
        }
      } catch (regionErr) {
        console.error('Error fetching region data:', regionErr);
      }
    }
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setNearbyActs([]);
    setSelectedLocation(null);
  };

  const handleTimeFilterChange = (timeFilter) => {
    setActiveTimeFilter(timeFilter);
    setNearbyActs([]);
    setSelectedLocation(null);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setNearbyActs([]);
    setSelectedLocation(null);
  };

  const handleSearchClear = () => {
    setSearchTerm('');
    setMapCenter([20, 0]);
    setMapZoom(2);
    setNearbyActs([]);
    setSelectedLocation(null);
  };

  const handleCloseActDetails = () => {
    setNearbyActs([]);
    setSelectedLocation(null);
  };

  const getFilterCount = () => {
    let count = 0;
    if (activeCategory !== CATEGORIES.ALL) count++;
    if (activeTimeFilter !== TIME_FILTERS.ALL) count++;
    if (searchTerm) count++;
    return count;
  };

  // Password form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="password-container">
        <div className="password-box">
          <div className="password-header">
            <h1 className="flex items-center justify-center gap-2">
              <LayoutDashboard size={32} /> Santa's Dashboard
            </h1>
            <p>Enter password to access advanced analytics</p>
          </div>
          <form onSubmit={handlePasswordSubmit} className="password-form">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="password-input"
              required
              autoFocus
            />
            {error && <div className="password-error">{error}</div>}
            <button type="submit" className="password-submit" disabled={loading}>
              {loading ? 'Checking...' : 'Access Dashboard'}
            </button>
          </form>
          <button onClick={() => navigate('/')} className="back-home flex items-center justify-center gap-2">
            <ArrowLeft size={16} /> Back to Public View
          </button>
        </div>
      </div>
    );
  }

  // Dashboard view if authenticated
  return (
    <div className="santa-dashboard-container">
      <NavigationSidebar
        activeView={activeView}
        onViewChange={setActiveView}
        onLogout={handleLogout}
      />
      
      <div className="dashboard-main-content">
        {activeView === 'map' && (
          <>
            <FilterToggle
              onClick={() => setFilterPanelOpen(true)}
              filterCount={getFilterCount()}
            />
            <div className="map-view-container">
              <MapView
                acts={filteredActs}
                onMapClick={handleMapClick}
                center={mapCenter}
                zoom={mapZoom}
              />
              {nearbyActs.length > 0 && (
                <ActDetails
                  acts={nearbyActs}
                  location={selectedLocation}
                  onClose={handleCloseActDetails}
                />
              )}
            </div>
          </>
        )}

        {activeView === 'stats' && (
          <div className="stats-view-container">
            {stats && (
              <div className="stats-overview">
                <div className="stat-card">
                  <div className="stat-value">{stats.total_acts || 0}</div>
                  <div className="stat-label">Total Acts</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{stats.total_cities || 0}</div>
                  <div className="stat-label">Cities</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{stats.total_countries || 0}</div>
                  <div className="stat-label">Countries</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{stats.total_appreciations || 0}</div>
                  <div className="stat-label">Total Appreciations</div>
                </div>
              </div>
            )}

            <div className="analytics-section">
              <AnalyticsPanel stats={stats} acts={acts} className="standalone" />
            </div>

            <div className="export-section-wrapper">
              <ExportButton acts={acts} stats={stats} />
            </div>
          </div>
        )}

        <FilterPanel
          isOpen={filterPanelOpen}
          onClose={() => setFilterPanelOpen(false)}
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
          activeTimeFilter={activeTimeFilter}
          onTimeFilterChange={handleTimeFilterChange}
          onSearch={handleSearch}
          onSearchClear={handleSearchClear}
        />
      </div>
    </div>
  );
};

export default SantaDashboard;
