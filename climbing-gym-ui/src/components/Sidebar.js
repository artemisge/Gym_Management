import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css'; // Ensure this file contains your styles

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h1 className="sidebar-logo">Gym Manager</h1>
      <nav className="sidebar-nav" aria-label="Sidebar Navigation">
        <ul>
          <li>
            <NavLink 
              to="/" 
              exact 
              activeClassName="active" 
              className="sidebar-link"
            >
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/users" 
              activeClassName="active" 
              className="sidebar-link"
            >
              Manage Users
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/packages" 
              activeClassName="active" 
              className="sidebar-link"
            >
              Manage Packages
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/payments" 
              activeClassName="active" 
              className="sidebar-link"
            >
              Payments
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
