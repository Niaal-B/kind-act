import React from 'react';
import { Map, Plus, Gift, LogIn, LogOut, User, TreePine, MessageCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import './PublicNavigationSidebar.css';

const PublicNavigationSidebar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navItems = [
    { path: '/', icon: Map, label: 'Map' },
    ...(isAuthenticated ? [{ path: '/my-tree', icon: TreePine, label: 'My Tree' }] : []),
    ...(isAuthenticated ? [{ path: '/chat', icon: MessageCircle, label: 'Chat with Santa' }] : []),
    ...(isAuthenticated 
      ? [{ path: '/add-act', icon: Plus, label: 'Add Act' }]
      : [{ path: '/login', icon: LogIn, label: 'Login to Add Act', isAction: true }]
    ),
  ];

  return (
    <div className="public-nav-sidebar">
      <div className="nav-header">
        <Gift className="nav-logo-icon" />
        <span className="nav-logo-text">Santa's Platform</span>
      </div>
      
      <nav className="nav-menu">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <button
              key={item.path}
              className={`nav-item ${active ? 'nav-item-active' : ''} ${item.isAction ? 'nav-item-action' : ''}`}
              onClick={() => navigate(item.path)}
            >
              <Icon className="nav-item-icon" />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="nav-footer">
        {isAuthenticated ? (
          <>
            <div className="nav-user-info">
              <User className="nav-user-icon" />
              <span className="nav-username">{user?.username || 'User'}</span>
            </div>
            <button 
              className="nav-item nav-item-logout"
              onClick={handleLogout}
            >
              <LogOut className="nav-item-icon" />
              Logout
            </button>
          </>
        ) : (
          <button 
            className="nav-item"
            onClick={() => navigate('/login')}
          >
            <LogIn className="nav-item-icon" />
            Login
          </button>
        )}
      </div>
    </div>
  );
};

export default PublicNavigationSidebar;
