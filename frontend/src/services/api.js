import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Acts API
export const actsAPI = {
  // Get all acts with optional filters
  getAll: (params = {}) => api.get('/acts/', { params }),

  // Get single act by ID
  getById: (id) => api.get(`/acts/${id}/`),

  // Create new act
  create: (data) => api.post('/acts/', data),

  // Update act
  update: (id, data) => api.put(`/acts/${id}/`, data),

  // Delete act
  delete: (id) => api.delete(`/acts/${id}/`),

  // Get statistics
  getStats: () => api.get('/acts/stats/'),

  // Get region data
  getRegion: (params) => api.get('/acts/region/', { params }),
};

export default api;

