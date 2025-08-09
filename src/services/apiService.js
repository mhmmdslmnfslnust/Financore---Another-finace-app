import axios from 'axios';
import { 
  mockAuthService, 
  mockTransactionService, 
  mockGoalService, 
  mockBudgetService 
} from './mockAuthService';
import { USE_MOCK_API } from '../config/apiConfig';

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

// Auth API Service with mock fallback
export const authService = {
  login: async (credentials) => {
    if (USE_MOCK_API) {
      try {
        const response = await mockAuthService.login(credentials.email, credentials.password);
        return { data: response };
      } catch (error) {
        throw new Error(error.message);
      }
    }
    
    // Ensure credentials is a proper object with email and password
    if (!credentials || typeof credentials !== 'object') {
      credentials = { email: '', password: '' };
    }
    
    return api.post('/auth/login', credentials);
  },
  
  register: async (userData) => {
    if (USE_MOCK_API) {
      try {
        const response = await mockAuthService.register(userData);
        return { data: response };
      } catch (error) {
        const mockError = new Error(error.message);
        mockError.response = { data: { error: error.message } };
        throw mockError;
      }
    }
    
    return api.post('/auth/register', userData);
  },
  
  getCurrentUser: async () => {
    if (USE_MOCK_API) {
      try {
        const token = localStorage.getItem('token');
        const response = await mockAuthService.getMe(token);
        return { data: response };
      } catch (error) {
        throw new Error(error.message);
      }
    }
    
    return api.get('/auth/me');
  }
};

// Transaction API Service with mock fallback
export const transactionService = {
  getAll: async () => {
    if (USE_MOCK_API) {
      try {
        const response = await mockTransactionService.getAll();
        return { data: response };
      } catch (error) {
        throw new Error(error.message);
      }
    }
    return api.get('/transactions');
  },
  
  getById: async (id) => {
    if (USE_MOCK_API) {
      try {
        const response = await mockTransactionService.getById(id);
        return { data: response };
      } catch (error) {
        throw new Error(error.message);
      }
    }
    return api.get(`/transactions/${id}`);
  },
  
  add: async (transaction) => {
    if (USE_MOCK_API) {
      try {
        const response = await mockTransactionService.add(transaction);
        return { data: response };
      } catch (error) {
        throw new Error(error.message);
      }
    }
    return api.post('/transactions', transaction);
  },
  
  update: async (id, transaction) => {
    if (USE_MOCK_API) {
      try {
        const response = await mockTransactionService.update(id, transaction);
        return { data: response };
      } catch (error) {
        throw new Error(error.message);
      }
    }
    return api.put(`/transactions/${id}`, transaction);
  },
  
  delete: async (id) => {
    if (USE_MOCK_API) {
      try {
        const response = await mockTransactionService.delete(id);
        return { data: response };
      } catch (error) {
        throw new Error(error.message);
      }
    }
    return api.delete(`/transactions/${id}`);
  }
};

// Goal API Service with mock fallback
export const goalService = {
  getAll: async () => {
    if (USE_MOCK_API) {
      try {
        const response = await mockGoalService.getAll();
        return { data: response };
      } catch (error) {
        throw new Error(error.message);
      }
    }
    return api.get('/goals');
  },
  
  getById: async (id) => {
    if (USE_MOCK_API) {
      try {
        const response = await mockGoalService.getById(id);
        return { data: response };
      } catch (error) {
        throw new Error(error.message);
      }
    }
    return api.get(`/goals/${id}`);
  },
  
  add: async (goal) => {
    if (USE_MOCK_API) {
      try {
        const response = await mockGoalService.add(goal);
        return { data: response };
      } catch (error) {
        throw new Error(error.message);
      }
    }
    return api.post('/goals', goal);
  },
  
  update: async (id, goal) => {
    if (USE_MOCK_API) {
      try {
        const response = await mockGoalService.update(id, goal);
        return { data: response };
      } catch (error) {
        throw new Error(error.message);
      }
    }
    return api.put(`/goals/${id}`, goal);
  },
  
  delete: async (id) => {
    if (USE_MOCK_API) {
      try {
        console.log('Deleting goal with mock service, ID:', id);
        const response = await mockGoalService.delete(id);
        return { data: response };
      } catch (error) {
        throw new Error(error.message);
      }
    }
    console.log('Sending delete request for goal ID:', id);
    return api.delete(`/goals/${id}`);
  },
  
  contribute: async (id, amount) => {
    if (USE_MOCK_API) {
      try {
        const response = await mockGoalService.contribute(id, amount);
        return { data: response };
      } catch (error) {
        throw new Error(error.message);
      }
    }
    return api.put(`/goals/${id}/contribute`, { amount });
  }
};

// Budget API Service with mock fallback
export const budgetService = {
  getAll: async () => {
    if (USE_MOCK_API) {
      try {
        const response = await mockBudgetService.getAll();
        return { data: response };
      } catch (error) {
        throw new Error(error.message);
      }
    }
    return api.get('/budgets');
  },
  
  getById: async (id) => {
    if (USE_MOCK_API) {
      // Mock implementation
      return { data: { success: true, data: { id, name: 'Sample Budget' } } };
    }
    return api.get(`/budgets/${id}`);
  },
  
  add: async (budget) => {
    if (USE_MOCK_API) {
      try {
        const response = await mockBudgetService.add(budget);
        return { data: response };
      } catch (error) {
        throw new Error(error.message);
      }
    }
    return api.post('/budgets', budget);
  },
  
  update: async (id, budget) => {
    if (USE_MOCK_API) {
      // Mock implementation
      return { data: { success: true, data: { id, ...budget } } };
    }
    return api.put(`/budgets/${id}`, budget);
  },
  
  delete: async (id) => {
    if (USE_MOCK_API) {
      // Mock implementation
      return { data: { success: true, message: 'Budget deleted' } };
    }
    return api.delete(`/budgets/${id}`);
  }
};

export default api;
