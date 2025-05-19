import React, { createContext, useState, useEffect } from 'react';
import { mockAuthService } from '../services/mockAuthService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Set auth token for API calls
  const setAuthToken = (token) => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  };

  // Register user
  const register = async (userData) => {
    try {
      setError(null);
      setLoading(true);
      
      // Use mock service instead of API request
      const data = await mockAuthService.register(userData);
      
      const { token, user } = data;
      setAuthToken(token);
      setToken(token);
      setCurrentUser(user);
      setLoading(false);
      
      return user;
    } catch (err) {
      setError(err.message || 'Registration failed');
      setLoading(false);
      throw err;
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      
      // Use mock service instead of API request
      const data = await mockAuthService.login(email, password);
      
      const { token, user } = data;
      setAuthToken(token);
      setToken(token);
      setCurrentUser(user);
      setLoading(false);
      
      return user;
    } catch (err) {
      setError(err.message || 'Login failed');
      setLoading(false);
      throw err;
    }
  };

  // Logout user
  const logout = () => {
    setAuthToken(null);
    setToken(null);
    setCurrentUser(null);
  };

  // Check if user is authenticated
  const checkUserAuthentication = async () => {
    if (token) {
      try {
        // Use mock service instead of API request
        const data = await mockAuthService.getMe(token);
        setCurrentUser(data.data);
      } catch (err) {
        // Token might be invalid, remove it
        setAuthToken(null);
        setToken(null);
        setCurrentUser(null);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    checkUserAuthentication();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        error,
        register,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
