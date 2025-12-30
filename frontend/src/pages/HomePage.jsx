import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout/Layout';
import PublicNavigationSidebar from '../components/Navigation/PublicNavigationSidebar';
import MapView from '../components/Map/MapView';
import FilterPanel from '../components/Filters/FilterPanel';
import FilterToggle from '../components/Dashboard/FilterToggle';
import ActDetails from '../components/Map/ActDetails';
import { actsAPI } from '../services/api';
import { CATEGORIES } from '../utils/constants';
import { TIME_FILTERS } from '../components/Filters/TimeFilter';
import './HomePage.css';

const HomePage = () => {
  const [acts, setActs] = useState([]);
  const [filteredActs, setFilteredActs] = useState([]);
  const [stats, setStats] = useState(null);
  const [activeCategory, setActiveCategory] = useState(CATEGORIES.ALL);
  const [activeTimeFilter, setActiveTimeFilter] = useState(TIME_FILTERS.ALL);
  const [searchTerm, setSearchTerm] = useState('');
  const [mapCenter, setMapCenter] = useState([20, 0]);
  const [mapZoom, setMapZoom] = useState(2);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [nearbyActs, setNearbyActs] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);

  useEffect(() => {
    fetchActs();
    fetchStats();
  }, []);

  useEffect(() => {
    if (!Array.isArray(acts)) {
      setFilteredActs([]);
      return;
    }
    
    let filtered = [...acts];
    
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(act => {
        const cityMatch = act.city && act.city.toLowerCase().includes(searchLower);
        const countryMatch = act.country && act.country.toLowerCase().includes(searchLower);
        const descMatch = act.description && act.description.toLowerCase().includes(searchLower);
        return cityMatch || countryMatch || descMatch;
      });
    }
    
    if (activeCategory !== CATEGORIES.ALL) {
      filtered = filtered.filter(act => act.category === activeCategory);
    }
    
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
    
    if (searchTerm && filtered.length > 0) {
      const firstResult = filtered[0];
      setMapCenter([parseFloat(firstResult.latitude), parseFloat(firstResult.longitude)]);
      setMapZoom(8);
    }
  }, [acts, activeCategory, activeTimeFilter, searchTerm]);

  const fetchActs = async () => {
    try {
      setLoading(true);
      const response = await actsAPI.getAll();
      const actsData = Array.isArray(response.data) 
        ? response.data 
        : (response.data.results || []);
      setActs(actsData);
      setFilteredActs(actsData);
      setError(null);
    } catch (err) {
      console.error('Error fetching acts:', err);
      setError('Failed to load acts. Please refresh the page.');
      setActs([]);
      setFilteredActs([]);
    } finally {
      setLoading(false);
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

  const handleMapClick = async (coords) => {
    try {
      const nearbyResponse = await actsAPI.nearbyActs({
        lat: coords.lat,
        lng: coords.lng,
        radius: 0.05,
      });
      
      if (nearbyResponse.data.acts && nearbyResponse.data.acts.length > 0) {
        setNearbyActs(nearbyResponse.data.acts);
        setSelectedLocation(coords);
      } else {
        const response = await actsAPI.getRegion({
          lat: coords.lat,
          lng: coords.lng,
        });
        
        if (response.data.recent_acts && response.data.recent_acts.length > 0) {
          setNearbyActs(response.data.recent_acts);
          setSelectedLocation(coords);
        } else {
          setNearbyActs([]);
          setSelectedLocation(null);
        }
      }
    } catch (err) {
      console.error('Error fetching nearby acts:', err);
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

  if (loading && acts.length === 0) {
    return (
      <div className="home-page">
        <PublicNavigationSidebar />
        <div className="home-content">
          <Layout stats={stats}>
            <div className="loading-wrapper">
              <div className="loading-spinner" />
              <p className="loading-text">Loading acts of kindness...</p>
            </div>
          </Layout>
        </div>
      </div>
    );
  }

  return (
    <div className="home-page">
      <PublicNavigationSidebar />
      
      <div className="home-content">
        <Layout stats={stats}>
          <div className="map-container">
            <FilterToggle
              onClick={() => setFilterPanelOpen(true)}
              filterCount={getFilterCount()}
            />
            <div className="map-wrapper">
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
          {error && (
            <div className="error-banner">
              {error}
            </div>
          )}
        </Layout>
      </div>
    </div>
  );
};

export default HomePage;
