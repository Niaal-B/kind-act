import React, { useState } from 'react';
import { X, MapPin, Calendar, Heart, ExternalLink, ChevronLeft, ChevronRight, User } from 'lucide-react';
import { formatDate } from '../../utils/helpers';
import { CATEGORY_LABELS, CATEGORY_ICONS } from '../../utils/constants';
import { Sparkles, Utensils, Shirt, Clock, Banknote, Gift } from 'lucide-react';
import './ActDetails.css';

const ICON_MAP = {
  Sparkles,
  Utensils,
  Shirt,
  Clock,
  Banknote,
  Gift,
};

const ActDetails = ({ acts, location, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const getIcon = (iconName) => {
    const IconComponent = ICON_MAP[iconName] || Sparkles;
    return <IconComponent size={18} />;
  };

  if (!acts || acts.length === 0) {
    return null;
  }

  const currentAct = acts[currentIndex];

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : acts.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < acts.length - 1 ? prev + 1 : 0));
  };

  const isImageUrl = (url) => {
    if (!url) return false;
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'];
    const lowerUrl = url.toLowerCase();
    return imageExtensions.some(ext => lowerUrl.includes(ext)) || 
           lowerUrl.includes('imgur') || 
           lowerUrl.includes('image') ||
           lowerUrl.includes('photo');
  };

  const getUsername = () => {
    if (currentAct.submitted_by && !currentAct.is_anonymous) {
      return currentAct.submitted_by;
    }
    return 'Anonymous';
  };

  const getDisplayName = () => {
    if (currentAct.submitted_by && !currentAct.is_anonymous) {
      return currentAct.submitted_by;
    }
    return 'Anonymous User';
  };

  return (
    <div className="act-details-overlay" onClick={onClose}>
      <div className="act-details-container" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn-overlay" onClick={onClose}>
          <X size={24} />
        </button>

        {acts.length > 1 && (
          <>
            <button className="nav-btn prev-btn" onClick={handlePrevious}>
              <ChevronLeft size={24} />
            </button>
            <button className="nav-btn next-btn" onClick={handleNext}>
              <ChevronRight size={24} />
            </button>
            <div className="act-counter">
              {currentIndex + 1} / {acts.length}
            </div>
          </>
        )}

        <div className="act-card-instagram">
          {/* Header - Username and Category */}
          <div className="act-card-header">
            <div className="act-user-info">
              <div className="act-avatar">
                <User size={20} />
              </div>
              <div className="act-user-details">
                <div className="act-username">{getDisplayName()}</div>
                <div className="act-category-label">
                  {getIcon(CATEGORY_ICONS[currentAct.category])}
                  <span>{CATEGORY_LABELS[currentAct.category]}</span>
                </div>
              </div>
            </div>
            {currentAct.appreciation_count > 0 && (
              <div className="act-appreciation-header">
                <Heart size={18} fill="currentColor" />
                <span>{currentAct.appreciation_count}</span>
              </div>
            )}
          </div>

          {/* Image Section - Instagram Style */}
          {currentAct.evidence_url && isImageUrl(currentAct.evidence_url) ? (
            <div className="act-image-container">
              <img 
                src={currentAct.evidence_url} 
                alt="Evidence of act of kindness"
                className="act-image"
                onError={(e) => {
                  e.target.style.display = 'none';
                  const errorDiv = e.target.parentElement.querySelector('.act-image-error');
                  if (errorDiv) errorDiv.style.display = 'flex';
                }}
              />
              <a 
                href={currentAct.evidence_url}
                target="_blank"
                rel="noopener noreferrer"
                className="act-image-error"
                style={{ display: 'none' }}
              >
                <ExternalLink size={32} />
                <span>Click to view evidence</span>
              </a>
            </div>
          ) : (
            // Placeholder if no image
            <div className="act-image-placeholder">
              <Gift size={64} />
              <span>No image available</span>
            </div>
          )}

          {/* Actions/Stats Bar */}
          <div className="act-actions-bar">
            <div className="act-appreciation-count">
              <Heart size={20} fill="currentColor" />
              <span>{currentAct.appreciation_count || 0} {currentAct.appreciation_count === 1 ? 'appreciation' : 'appreciations'}</span>
            </div>
          </div>

          {/* Caption Section - Instagram Style */}
          <div className="act-card-body">
            {/* Username + Caption */}
            <div className="act-caption">
              <span className="act-caption-username">{getUsername()}</span>
              <span className="act-caption-text">{currentAct.description}</span>
            </div>

            {/* Location and Date */}
            <div className="act-meta-info">
              {(currentAct.city || currentAct.country) && (
                <div className="act-location-info">
                  <MapPin size={14} />
                  <span>
                    {currentAct.city && currentAct.country 
                      ? `${currentAct.city}, ${currentAct.country}`
                      : currentAct.city || currentAct.country}
                  </span>
                </div>
              )}
              
              <div className="act-date-info">
                <Calendar size={14} />
                <span>{formatDate(currentAct.created_at)}</span>
              </div>
            </div>

            {/* Evidence Link (if not an image) */}
            {currentAct.evidence_url && !isImageUrl(currentAct.evidence_url) && (
              <a 
                href={currentAct.evidence_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="act-evidence-link"
              >
                <ExternalLink size={16} />
                View Evidence
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActDetails;
