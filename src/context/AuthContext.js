import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../services/apiService';

// Create Auth Context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is authenticated on app load
  useEffect(() => {
    const checkUserLoggedIn = async () => {
      setLoading(true);
      try {
        // Check for token
        const token = localStorage.getItem('token');
        if (!token) {
          setCurrentUser(null);
          setLoading(false);
          return;
        }

        // Verify token with backend
        const response = await authService.getCurrentUser();
        if (response.data && response.data.data) {
          setCurrentUser(response.data.data);
        } else {
          localStorage.removeItem('token');
          setCurrentUser(null);
        }
      } catch (err) {
        console.error('Authentication check failed:', err);
        localStorage.removeItem('token'); // Clear invalid token
        setCurrentUser(null);
        setError('Authentication failed. Please login again.');
      } finally {
        setLoading(false);
      }
    };

    checkUserLoggedIn();
  }, []);

  // Login function
  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.login(credentials);
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        setCurrentUser(response.data.user);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Login failed:', err);
      setError(err.response?.data?.error || 'Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
  };

  // Provide auth context
  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        loading,
        error,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
