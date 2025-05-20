import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor for auth token and proper JSON formatting
api.interceptors.request.use(
  (config) => {
    // Add auth token to headers if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Ensure proper JSON formatting for POST/PUT requests
    if ((config.method === 'post' || config.method === 'put') && config.data) {
      // If data is a string (which would cause JSON parsing errors)
      if (typeof config.data === 'string') {
        console.warn('Converting string data to object:', config.data);
        // Convert to proper object
        try {
          // If it's already JSON-formatted, parse it
          config.data = JSON.parse(config.data);
        } catch (e) {
          // If not JSON, make it an object with a default property
          config.data = { data: config.data };
        }
      }
      
      // Log outgoing request for debugging
      console.log(`Request to ${config.url}:`, 
        config.data.password ? {...config.data, password: '***'} : config.data);
    }
    
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response) {
      // The request was made and the server responded with an error status
      console.error('Server error:', error.response.status, error.response.data);
      
      // Handle authentication errors
      if (error.response.status === 401) {
        console.log('Authentication error detected');
        if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
          // Clear token and redirect to login
          localStorage.removeItem('token');
        }
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request
      console.error('Request setup error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Auth API Service
export const authService = {
  login: (credentials) => {
    // Ensure credentials is a proper object with email and password
    if (!credentials || typeof credentials !== 'object') {
      credentials = { email: '', password: '' };
    }
    
    return api.post('/auth/login', credentials);
  },
  register: (userData) => api.post('/auth/register', userData),
  getCurrentUser: () => api.get('/auth/me')
};

// Transaction API Service
export const transactionService = {
  getAll: () => api.get('/transactions'),
  getById: (id) => api.get(`/transactions/${id}`),
  add: (transaction) => api.post('/transactions', transaction),
  update: (id, transaction) => api.put(`/transactions/${id}`, transaction),
  delete: (id) => api.delete(`/transactions/${id}`)
};

// Goal API Service
export const goalService = {
  getAll: () => api.get('/goals'),
  getById: (id) => api.get(`/goals/${id}`),
  add: (goal) => api.post('/goals', goal),
  update: (id, goal) => api.put(`/goals/${id}`, goal),
  delete: (id) => api.delete(`/goals/${id}`),
  contribute: (id, amount) => api.put(`/goals/${id}/contribute`, { amount })
};

// Budget API Service
export const budgetService = {
  getAll: () => api.get('/budgets'),
  getById: (id) => api.get(`/budgets/${id}`),
  add: (budget) => api.post('/budgets', budget),
  update: (id, budget) => api.put(`/budgets/${id}`, budget),
  delete: (id) => api.delete(`/budgets/${id}`)
};

export default api;
