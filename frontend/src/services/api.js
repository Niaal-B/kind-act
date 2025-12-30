import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Get JWT token from localStorage
const getAccessToken = () => {
  return localStorage.getItem('accessToken');
};

const getRefreshToken = () => {
  return localStorage.getItem('refreshToken');
};

const setTokens = (access, refresh) => {
  localStorage.setItem('accessToken', access);
  if (refresh) {
    localStorage.setItem('refreshToken', refresh);
  }
};

const clearTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and we haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = getRefreshToken();
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
            refresh: refreshToken,
          });

          const { access } = response.data;
          setTokens(access, refreshToken);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, clear tokens and redirect to login
        clearTokens();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Export token management functions
export { setTokens, clearTokens, getAccessToken, getRefreshToken };

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
