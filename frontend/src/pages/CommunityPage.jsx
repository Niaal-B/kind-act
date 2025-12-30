import React, { useState, useEffect } from 'react';
import { Heart, MapPin, Calendar, User, Loader } from 'lucide-react';
import PublicNavigationSidebar from '../components/Navigation/PublicNavigationSidebar';
import { actsAPI } from '../services/api';
import './CommunityPage.css';

const CommunityPage = () => {
  const [acts, setActs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCommunityActs();
  }, []);

  const loadCommunityActs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await actsAPI.getCommunity();
      setActs(response.data.results || response.data || []);
    } catch (err) {
      console.error('Error loading community acts:', err);
      setError('Failed to load community acts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  };

  const getCategoryEmoji = (category) => {
    const emojis = {
      food: '🍔',
      clothing: '👕',
      time: '⏰',
      money: '💰',
      other: '❤️',
    };
    return emojis[category] || '❤️';
  };

  if (loading) {
    return (
      <div className="community-page">
        <PublicNavigationSidebar />
        <div className="community-content">
          <div className="loading-container">
            <Loader className="loading-spinner" />
            <p>Loading community acts...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="community-page">
        <PublicNavigationSidebar />
        <div className="community-content">
          <div className="error-message">
            <p>{error}</p>
            <button onClick={loadCommunityActs} className="retry-button">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="community-page">
      <PublicNavigationSidebar />
      <div className="community-content">
        <div className="community-header">
          <h1>Community Feed</h1>
          <p>Spread kindness, share joy 🌟</p>
        </div>

        {acts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📸</div>
            <h2>No acts to show yet</h2>
            <p>Be the first to share an act of kindness with an image!</p>
          </div>
        ) : (
          <div className="community-feed">
            {acts.map((act) => (
              <div key={act.id} className="community-card">
                <div className="card-header">
                  <div className="user-info">
                    <div className="user-avatar">
                      <User size={32} />
                    </div>
                    <div className="user-details">
                      <div className="username">{act.username}</div>
                      <div className="location">
                        <MapPin size={12} />
                        {act.city || 'Unknown Location'}
                      </div>
                    </div>
                  </div>
                  <div className="category-badge">
                    {getCategoryEmoji(act.category)} {act.category_display}
                  </div>
                </div>

                <div className="card-image-container">
                  <img
                    src={act.evidence_url}
                    alt={act.description}
                    className="card-image"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="image-error" style={{ display: 'none' }}>
                    <p>Image unavailable</p>
                  </div>
                </div>

                <div className="card-content">
                  <div className="card-actions">
                    <button className="action-button">
                      <Heart size={20} />
                      <span>{act.appreciation_count || 0}</span>
                    </button>
                  </div>

                  <div className="card-description">
                    <strong>{act.username}</strong> {act.description}
                  </div>

                  <div className="card-footer">
                    <div className="card-meta">
                      <Calendar size={14} />
                      <span>{formatDate(act.created_at)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityPage;

