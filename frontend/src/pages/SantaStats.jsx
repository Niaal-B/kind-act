import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import AnalyticsPanel from '../components/Sidebar/AnalyticsPanel';
import ExportButton from '../components/Sidebar/ExportButton';
import { actsAPI } from '../services/api';
import api from '../services/api';
import { BarChart3, Map, ArrowLeft, ShieldCheck } from 'lucide-react';
import './SantaStats.css';

const SantaStats = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [acts, setActs] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  const fetchActs = async () => {
    try {
      const response = await actsAPI.getAll();
      const actsData = Array.isArray(response.data)
        ? response.data
        : (response.data.results || []);
      setActs(actsData);
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

  const fetchData = async () => {
    setLoadingData(true);
    try {
      await Promise.all([fetchActs(), fetchStats()]);
    } finally {
      setLoadingData(false);
    }
  };

  // Check if already authenticated
  useEffect(() => {
    const authStatus = localStorage.getItem('santa_authenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  // Password form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="password-container">
        <div className="password-box">
          <div className="password-header">
            <h1 className="flex items-center justify-center gap-2">
              <BarChart3 size={32} /> Santa's Statistics
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
              {loading ? 'Checking...' : 'Access Statistics'}
            </button>
          </form>
          <button onClick={() => navigate('/')} className="back-home flex items-center justify-center gap-2">
            <ArrowLeft size={16} /> Back to Public View
          </button>
        </div>
      </div>
    );
  }

  // Statistics view if authenticated
  return (
    <Layout stats={stats}>
      <div className="santa-stats">
        <div className="stats-header">
          <div className="header-left">
            <h2 className="flex items-center gap-2">
              <ShieldCheck size={24} /> Statistics & Analytics
            </h2>
            <p className="stats-subtitle">Comprehensive insights into community acts of kindness</p>
          </div>
          <div className="header-actions">
            <button 
              onClick={() => navigate('/santa-dashboard')} 
              className="nav-btn map-btn"
              title="View Map"
            >
              <Map size={18} /> View Map
            </button>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>

        {loadingData ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading statistics...</p>
          </div>
        ) : (
          <div className="stats-content">
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
      </div>
    </Layout>
  );
};

export default SantaStats;

