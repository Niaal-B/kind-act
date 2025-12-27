import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SantaDashboard from './pages/SantaDashboard';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/santa-dashboard" element={<SantaDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
