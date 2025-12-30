import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for session authentication
});

// Get CSRF token and set it for all requests
let csrfToken = null;

const getCsrfToken = async () => {
  if (!csrfToken) {
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/csrf-token/`, {
        withCredentials: true,
      });
      csrfToken = response.data.csrfToken;
    } catch (error) {
      console.error('Error fetching CSRF token:', error);
    }
  }
  return csrfToken;
};

// Request interceptor to add CSRF token
api.interceptors.request.use(
  async (config) => {
    // Only add CSRF token for state-changing methods
    if (['post', 'put', 'patch', 'delete'].includes(config.method?.toLowerCase())) {
      const token = await getCsrfToken();
      if (token) {
        config.headers['X-CSRFToken'] = token;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to refresh CSRF token on 403
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 403 && error.response?.data?.detail?.includes('CSRF')) {
      // Refresh CSRF token and retry
      csrfToken = null;
      const token = await getCsrfToken();
      if (token && error.config) {
        error.config.headers['X-CSRFToken'] = token;
        return api.request(error.config);
      }
    }
    return Promise.reject(error);
  }
);

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

  // Get nearby acts
  nearbyActs: (params) => api.get('/acts/nearby_acts/', { params }),
};

// Auth API
export const authAPI = {
  // Register new user
  register: (data) => api.post('/auth/register/', data),

  // Login user
  login: (data) => api.post('/auth/login/', data),

  // Logout user
  logout: (data) => api.post('/auth/logout/', data),

  // Get current user
  getCurrentUser: () => api.get('/auth/current-user/'),
};

// Tree API
export const treeAPI = {
  // Get user's complete tree
  getMyTree: () => api.get('/tree/decorations/my_tree/'),

  // Get tree progress
  getProgress: () => api.get('/tree/decorations/progress/'),

  // Create decoration manually
  createDecoration: (data) => api.post('/tree/decorations/', data),

  // Update decoration
  updateDecoration: (id, data) => api.put(`/tree/decorations/${id}/`, data),

  // Delete decoration
  deleteDecoration: (id) => api.delete(`/tree/decorations/${id}/`),

  // Auto-decorate (triggered on act creation)
  autoDecorate: (actId) => api.post('/tree/decorations/auto_decorate/', { act_id: actId }),
};

// Chat API
export const chatAPI = {
  getHistory: () => api.get('/chat/history/'),
  sendMessage: (message) => api.post('/chat/send/', { message }),
};

export default api;

