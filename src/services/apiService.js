import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor to include auth token with every request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
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
