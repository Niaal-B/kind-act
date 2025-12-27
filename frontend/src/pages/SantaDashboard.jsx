import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import MapView from '../components/Map/MapView';
import Sidebar from '../components/Sidebar/Sidebar';
import { actsAPI } from '../services/api';
import api from '../services/api';
import { CATEGORIES } from '../utils/constants';
import { TIME_FILTERS } from '../components/Filters/TimeFilter';
import './SantaDashboard.css';

const SantaDashboard = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [acts, setActs] = useState([]);
  const [filteredActs, setFilteredActs] = useState([]);
  const [stats, setStats] = useState(null);
  const [regionData, setRegionData] = useState(null);
  const [activeCategory, setActiveCategory] = useState(CATEGORIES.ALL);
  const [activeTimeFilter, setActiveTimeFilter] = useState(TIME_FILTERS.ALL);

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
    setRegionData(null);
  };

  const handleTimeFilterChange = (timeFilter) => {
    setActiveTimeFilter(timeFilter);
    setRegionData(null);
  };

  const handleSubmitAct = async (formData) => {
    try {
      await actsAPI.create(formData);
      await fetchActs();
      await fetchStats();
      setRegionData(null);
    } catch (err) {
      console.error('Error submitting act:', err);
      throw err;
    }
  };

  // Password form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="password-container">
        <div className="password-box">
          <div className="password-header">
            <h1>🎅 Santa's Dashboard</h1>
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
          <button onClick={() => navigate('/')} className="back-home">
            ← Back to Public View
          </button>
        </div>
      </div>
    );
  }

  // Dashboard view if authenticated
  return (
    <Layout stats={stats}>
      <div className="santa-dashboard">
        <div className="dashboard-header">
          <h2>🎅 Santa's Command Center</h2>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
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
      </div>
    </Layout>
  );
};

export default SantaDashboard;

