import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../services/apiService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Set auth token for API calls
  const setAuthToken = (token) => {
    if (token) {
      // Store token in localStorage
      localStorage.setItem('token', token);
      
      // Log token storage for debugging
      console.log('Token stored in localStorage:', token.substring(0, 20) + '...');
    } else {
      // Remove token from localStorage
      localStorage.removeItem('token');
      console.log('Token removed from localStorage');
    }
  };

  // Register user
  const register = async (userData) => {
    try {
      setError(null);
      setLoading(true);
      
      console.log('Attempting to register:', userData.email);
      
      const response = await authService.register(userData);
      const { token, user } = response.data;
      
      setAuthToken(token);
      setToken(token);
      setCurrentUser(user);
      setLoading(false);
      
      console.log('Registration successful for:', user.username);
      return user;
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.error || 'Registration failed');
      setLoading(false);
      throw err;
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      
      console.log('Attempting login for:', email);
      
      // Use authService instead of apiRequest
      const response = await authService.login(email, password);
      const { token, user } = response.data;
      
      // Make sure token exists
      if (!token) {
        console.error('No token returned from login');
        throw new Error('Login failed - no token received');
      }
      
      // Store token
      setAuthToken(token);
      setToken(token);
      setCurrentUser(user);
      setLoading(false);
      
      console.log('Login successful for:', user.username);
      return user;
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.error || 'Login failed');
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
        const response = await authService.getMe();
        setCurrentUser(response.data.data);
      } catch (err) {
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
