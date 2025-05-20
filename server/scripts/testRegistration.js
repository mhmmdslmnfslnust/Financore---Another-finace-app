const axios = require('axios');

// Test user data
const testUser = {
  username: 'testuser' + Date.now().toString().slice(-4), // Generate unique username
  email: `test${Date.now().toString().slice(-4)}@example.com`, // Generate unique email
  password: 'password123'
};

async function testRegistration() {
  try {
    console.log('Testing registration with data:', testUser);
    
    const response = await axios.post('http://localhost:5000/api/auth/register', testUser, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('\n✅ Registration successful!');
    console.log('Response status:', response.status);
    console.log('Response data:', response.data);
    return true;
  } catch (error) {
    console.error('\n❌ Registration failed!');
    
    if (error.response) {
      // The request was made and the server responded with an error status
      console.error('Status:', error.response.status);
      console.error('Response:', error.response.data);
      console.error('Headers:', error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received. Is the server running?');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error setting up request:', error.message);
    }
    
    return false;
  }
}

testRegistration();
