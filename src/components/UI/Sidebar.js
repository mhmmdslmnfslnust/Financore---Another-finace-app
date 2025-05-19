import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ isOpen }) => {
  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-menu">
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>
          Dashboard
        </NavLink>
        <NavLink to="/transactions" className={({ isActive }) => isActive ? 'active' : ''}>
          Transactions
        </NavLink>
        <NavLink to="/goals" className={({ isActive }) => isActive ? 'active' : ''}>
          Financial Goals
        </NavLink>
        <NavLink to="/recommendations" className={({ isActive }) => isActive ? 'active' : ''}>
          Recommendations
        </NavLink>
        <NavLink to="/reports" className={({ isActive }) => isActive ? 'active' : ''}>
          Reports
        </NavLink>
      </div>
      <div className="sidebar-footer">
        <div className="app-version">FinanCore v1.0.0</div>
      </div>
    </div>
  );
};

export default Sidebar;
