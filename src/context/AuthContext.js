import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../services/apiService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Set auth token
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
      
      const response = await authService.register(userData);
      const { token, user } = response.data;
      
      setAuthToken(token);
      setToken(token);
      setCurrentUser(user);
      setLoading(false);
      
      return user;
    } catch (err) {
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
      
      const response = await authService.login(email, password);
      const { token, user } = response.data;
      
      setAuthToken(token);
      setToken(token);
      setCurrentUser(user);
      setLoading(false);
      
      return user;
    } catch (err) {
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
