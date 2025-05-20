const axios = require('axios');

// Simple test function to check basic connectivity
async function testConnection() {
  try {
    console.log('Testing connection to API server...');
    const response = await axios.get('http://localhost:5000/api/debug');
    console.log('Connection successful!');
    console.log('Response:', response.data);
    return true;
  } catch (error) {
    console.error('Connection failed!');
    
    if (error.code === 'ECONNREFUSED') {
      console.error('Server is not running or not accessible at localhost:5000');
      console.error('Make sure your server is started with: node server/server.js');
    } else {
      console.error('Error details:', error.message);
    }
    
    return false;
  }
}

testConnection();
