import React from 'react';
import Header from './Header';
import './Layout.css';

const Layout = ({ children, stats }) => {
  return (
    <div className="app-layout">
      <Header stats={stats} />
      <main className="app-main">
        {children}
      </main>
    </div>
  );
};

export default Layout;

