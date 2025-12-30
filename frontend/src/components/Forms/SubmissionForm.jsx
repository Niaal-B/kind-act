import React, { useState } from 'react';
import { CATEGORIES, CATEGORY_LABELS, CATEGORY_ICONS } from '../../utils/constants';
import './SubmissionForm.css';

const SubmissionForm = ({ onSubmit, onClose, hideHeader = false }) => {
  const [formData, setFormData] = useState({
    description: '',
    category: CATEGORIES.FOOD,
    latitude: '',
    longitude: '',
    city: '',
    country: '',
    submitted_by: '',
    is_anonymous: true,
    evidence_url: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [locationError, setLocationError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleGetLocation = () => {
    setLocationError(null);
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      return;
    }

    setIsSubmitting(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData(prev => ({
          ...prev,
          latitude: position.coords.latitude.toFixed(6),
          longitude: position.coords.longitude.toFixed(6),
        }));
        setLocationError(null);
        setIsSubmitting(false);
        // Optionally reverse geocode to get city name
      },
      (error) => {
        setLocationError('Unable to retrieve your location. Please enter manually.');
        setIsSubmitting(false);
      }
    );
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.latitude || !formData.longitude) {
      newErrors.location = 'Location is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const submitData = {
        ...formData,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
      };
      
      await onSubmit(submitData);
      
      // Reset form
      setFormData({
        description: '',
        category: CATEGORIES.FOOD,
        latitude: '',
        longitude: '',
        city: '',
        country: '',
        submitted_by: '',
        is_anonymous: true,
        evidence_url: '',
      });
      
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error('Submission error:', error);
      setErrors({ submit: 'Failed to submit. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = [
    CATEGORIES.FOOD,
    CATEGORIES.CLOTHING,
    CATEGORIES.TIME,
    CATEGORIES.MONEY,
    CATEGORIES.OTHER,
  ];

  return (
    <div className="submission-form-container">
      <form onSubmit={handleSubmit} className="submission-form">
        {!hideHeader && (
          <div className="form-header">
            <h2>Add Your Act of Kindness</h2>
            {onClose && (
              <button type="button" onClick={onClose} className="close-btn" aria-label="Close">
                ×
              </button>
            )}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="description">
            Description <span className="required">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            placeholder="Describe your act of kindness..."
            className={errors.description ? 'error' : ''}
            required
          />
          {errors.description && (
            <span className="error-message">{errors.description}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="category">
            Category <span className="required">*</span>
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {CATEGORY_ICONS[cat]} {CATEGORY_LABELS[cat]}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Location <span className="required">*</span></label>
          <div className="location-buttons">
            <button
              type="button"
              onClick={handleGetLocation}
              className="btn-location"
              disabled={isSubmitting}
            >
              📍 Use My Location
            </button>
          </div>
          {locationError && (
            <span className="error-message">{locationError}</span>
          )}
          <div className="location-inputs">
            <input
              type="number"
              name="latitude"
              value={formData.latitude}
              onChange={handleChange}
              placeholder="Latitude"
              step="any"
              className={errors.location ? 'error' : ''}
              required
            />
            <input
              type="number"
              name="longitude"
              value={formData.longitude}
              onChange={handleChange}
              placeholder="Longitude"
              step="any"
              className={errors.location ? 'error' : ''}
              required
            />
          </div>
          {errors.location && (
            <span className="error-message">{errors.location}</span>
          )}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="city">City (optional)</label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="e.g., Mumbai"
            />
          </div>
          <div className="form-group">
            <label htmlFor="country">Country (optional)</label>
            <input
              type="text"
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              placeholder="e.g., India"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="submitted_by">Your Name (optional)</label>
          <input
            type="text"
            id="submitted_by"
            name="submitted_by"
            value={formData.submitted_by}
            onChange={handleChange}
            placeholder="Leave empty for anonymous"
            disabled={formData.is_anonymous}
          />
        </div>

        <div className="form-group checkbox-group">
          <label htmlFor="is_anonymous" className="checkbox-label">
            <input
              type="checkbox"
              id="is_anonymous"
              name="is_anonymous"
              checked={formData.is_anonymous}
              onChange={handleChange}
            />
            <span>Submit anonymously</span>
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="evidence_url">Evidence URL (optional)</label>
          <input
            type="url"
            id="evidence_url"
            name="evidence_url"
            value={formData.evidence_url}
            onChange={handleChange}
            placeholder="https://example.com/photo.jpg"
          />
        </div>

        {errors.submit && (
          <div className="error-message submit-error">{errors.submit}</div>
        )}

        <button
          type="submit"
          className="btn-submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : '✨ Submit Act of Kindness'}
        </button>
      </form>
    </div>
  );
};

export default SubmissionForm;

