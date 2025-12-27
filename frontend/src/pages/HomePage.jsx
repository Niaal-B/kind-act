import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout/Layout';
import MapView from '../components/Map/MapView';
import Sidebar from '../components/Sidebar/Sidebar';
import { actsAPI } from '../services/api';
import { CATEGORIES } from '../utils/constants';
import { TIME_FILTERS } from '../components/Filters/TimeFilter';
import './HomePage.css';

const HomePage = () => {
  const [acts, setActs] = useState([]);
  const [filteredActs, setFilteredActs] = useState([]);
  const [stats, setStats] = useState(null);
  const [regionData, setRegionData] = useState(null);
  const [activeCategory, setActiveCategory] = useState(CATEGORIES.ALL);
  const [activeTimeFilter, setActiveTimeFilter] = useState(TIME_FILTERS.ALL);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch acts and stats on mount
  useEffect(() => {
    fetchActs();
    fetchStats();
  }, []);

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
  }, [acts, activeCategory, activeTimeFilter]);

  const fetchActs = async () => {
    try {
      setLoading(true);
      const response = await actsAPI.getAll();
      // Handle paginated response (response.data.results) or direct array (response.data)
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
      const response = await actsAPI.getRegion({
        lat: coords.lat,
        lng: coords.lng,
      });
      setRegionData(response.data);
    } catch (err) {
      console.error('Error fetching region data:', err);
    }
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setRegionData(null); // Clear region data when filter changes
  };

  const handleTimeFilterChange = (timeFilter) => {
    setActiveTimeFilter(timeFilter);
    setRegionData(null); // Clear region data when filter changes
  };

  const handleSubmitAct = async (formData) => {
    try {
      await actsAPI.create(formData);
      // Refresh acts and stats
      await fetchActs();
      await fetchStats();
      setRegionData(null); // Clear region data
    } catch (err) {
      console.error('Error submitting act:', err);
      throw err; // Re-throw to let form handle error
    }
  };

  if (loading && acts.length === 0) {
    return (
      <Layout>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading acts of kindness...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout stats={stats}>
      <div className="home-page">
        <div className="map-section">
          <MapView
            acts={filteredActs}
            onMapClick={handleMapClick}
          />
        </div>
        <Sidebar
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
          activeTimeFilter={activeTimeFilter}
          onTimeFilterChange={handleTimeFilterChange}
          regionData={regionData}
          onSubmitAct={handleSubmitAct}
        />
      </div>
      {error && (
        <div className="error-banner">
          {error}
        </div>
      )}
    </Layout>
  );
};

export default HomePage;

