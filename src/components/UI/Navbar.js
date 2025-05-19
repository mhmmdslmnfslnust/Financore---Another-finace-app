import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ toggleSidebar }) => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button className="menu-toggle" onClick={toggleSidebar}>
          <span className="menu-icon"></span>
        </button>
        <Link to="/" className="navbar-brand">FinanCore</Link>
      </div>
      <div className="navbar-right">
        <div className="user-info">
          <span>Demo User</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
