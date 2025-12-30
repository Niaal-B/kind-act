import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogIn, Gift } from 'lucide-react';
import './LoginPage.css';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(username, password);

    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <div className="login-page">
      <div className="login-card card">
        <div className="login-header">
          <Gift className="login-icon" />
          <h1>Welcome Back</h1>
          <p className="login-subtitle">Sign in to share your acts of kindness</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="login-content">
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoFocus
                placeholder="Enter your username"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                className="form-input"
              />
            </div>
          </div>
          <div className="login-footer">
            <button type="submit" className="btn-primary login-button" disabled={loading}>
              <LogIn className="button-icon" />
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
            <div className="login-links">
              <p>
                Don't have an account?{' '}
                <Link to="/register" className="link-primary">Sign up here</Link>
              </p>
              <Link to="/" className="link-secondary">
                ← Back to Map
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
