import React from 'react';
import { Outlet } from 'react-router-dom';
import NavMenu from '../NavMenu/NavMenu';
import './Layout.css';

const Layout = () => {
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userId'); 
    window.location.href = '/';
  };

  return (
    <div className="container">
      <div className="sidebar">
        <NavMenu handleLogout={handleLogout} />
      </div>
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
