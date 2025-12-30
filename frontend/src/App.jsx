import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AddActPageRoute from './pages/AddActPageRoute';
import MyTreePage from './pages/MyTreePage';
import SantaDashboard from './pages/SantaDashboard';
import SantaStats from './pages/SantaStats';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route 
            path="/add-act" 
            element={
              <ProtectedRoute>
                <AddActPageRoute />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/my-tree" 
            element={
              <ProtectedRoute>
                <MyTreePage />
              </ProtectedRoute>
            } 
          />
          <Route path="/santa-dashboard" element={<SantaDashboard />} />
          <Route path="/santa-stats" element={<SantaStats />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
