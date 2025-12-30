import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is authenticated on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await authAPI.getCurrentUser();
      setUser(response.data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      const response = await authAPI.login({ username, password });
      setUser(response.data.user);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Login error:', error);
      if (error.response) {
        const errorMessage = error.response.data?.error || 
                           error.response.data?.message || 
                           error.response.data?.detail ||
                           `Server error: ${error.response.status}`;
        return {
          success: false,
          error: errorMessage,
        };
      } else if (error.request) {
        return {
          success: false,
          error: 'Cannot connect to server. Please check your internet connection and try again.',
        };
      } else {
        return {
          success: false,
          error: error.message || 'Login failed. Please try again.',
        };
      }
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      setUser(response.data.user);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Registration error:', error);
      // Provide more detailed error messages
      if (error.response) {
        // Server responded with error status
        const errorMessage = error.response.data?.error || 
                           error.response.data?.message || 
                           error.response.data?.detail ||
                           `Server error: ${error.response.status}`;
        return {
          success: false,
          error: errorMessage,
        };
      } else if (error.request) {
        // Request was made but no response received
        return {
          success: false,
          error: 'Cannot connect to server. Please check your internet connection and try again.',
        };
      } else {
        // Something else happened
        return {
          success: false,
          error: error.message || 'Failed to create account. Please try again.',
        };
      }
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
      setUser(null);
      return { success: true };
    } catch (error) {
      // Even if logout fails, clear user state
      setUser(null);
      return { success: true };
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

