// API Configuration
// Set this to false when your backend server is running and connected to MongoDB
export const USE_MOCK_API = true;

// API URLs
export const API_CONFIG = {
  BASE_URL: 'http://localhost:5000/api',
  TIMEOUT: 10000,
  USE_MOCK: USE_MOCK_API
};

// Mock API Status Message
export const getMockApiMessage = () => {
  if (USE_MOCK_API) {
    return {
      status: 'Using Mock API',
      message: 'Currently using mock data for development. To use real backend, set USE_MOCK_API to false in apiConfig.js',
      color: 'orange'
    };
  } else {
    return {
      status: 'Using Real API',
      message: 'Connected to backend server. Ensure your server is running on port 5000.',
      color: 'green'
    };
  }
};
