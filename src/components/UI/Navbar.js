import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = ({ toggleSidebar }) => {
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button className="menu-toggle" onClick={toggleSidebar}>
          <span className="menu-icon"></span>
        </button>
        <Link to="/" className="navbar-brand">FinanCore</Link>
      </div>
      <div className="navbar-right">
        {currentUser ? (
          <div className="user-info-container">
            <span className="user-info">{currentUser.username || "User"}</span>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        ) : (
          <button onClick={handleLogin} className="login-btn">Sign In</button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
