import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor to add token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Log outgoing requests for debugging
    console.log('API Request:', {
      url: config.url,
      method: config.method,
      headers: config.headers,
      data: config.data
    });
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for better error handling
apiClient.interceptors.response.use(
  (response) => {
    // Log successful responses for debugging
    console.log('API Response:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    // Log error responses for debugging
    console.error('API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    
    // Handle authentication errors
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export const authService = {
  register: (userData) => apiClient.post('/auth/register', userData),
  login: (email, password) => apiClient.post('/auth/login', { email, password }),
  getMe: () => apiClient.get('/auth/me')
};

export const transactionService = {
  getAll: () => apiClient.get('/transactions'),
  add: (transaction) => apiClient.post('/transactions', transaction),
  update: (id, transaction) => apiClient.put(`/transactions/${id}`, transaction),
  delete: (id) => apiClient.delete(`/transactions/${id}`)
};

export const goalService = {
  getAll: () => apiClient.get('/goals'),
  add: (goal) => apiClient.post('/goals', goal),
  update: (id, goal) => apiClient.put(`/goals/${id}`, goal),
  delete: (id) => apiClient.delete(`/goals/${id}`)
};

export const budgetService = {
  getAll: () => apiClient.get('/budgets'),
  add: (budget) => apiClient.post('/budgets', budget),
  update: (id, budget) => apiClient.put(`/budgets/${id}`, budget),
  delete: (id) => apiClient.delete(`/budgets/${id}`)
};
