import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

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
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  // Register user
  const register = async (userData) => {
    try {
      setError(null);
      setLoading(true);
      const res = await axios.post('/api/auth/register', userData);
      
      const { token, user } = res.data;
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
      const res = await axios.post('/api/auth/login', { email, password });
      
      const { token, user } = res.data;
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
      setAuthToken(token);
      try {
        const res = await axios.get('/api/auth/me');
        setCurrentUser(res.data.data);
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
