const axios = require('axios');

// Test user for registration
const testUser = {
  username: 'apitest' + Date.now(),
  email: `apitest${Date.now()}@test.com`,
  password: 'password123'
};

// Base URL for API
const API_URL = 'http://localhost:5000/api';

async function runTests() {
  let token;
  let userId;
  
  console.log('🔍 Starting API Flow Verification');
  console.log('--------------------------------');
  
  // 1. Test registration
  try {
    console.log(`1️⃣ Registering test user: ${testUser.username}`);
    const registerResponse = await axios.post(`${API_URL}/auth/register`, testUser);
    
    if (registerResponse.data.success) {
      console.log('✅ Registration successful!');
      token = registerResponse.data.token;
      userId = registerResponse.data.user.id;
      console.log(`   User ID: ${userId}`);
      console.log(`   Token: ${token.substring(0, 15)}...`);
    } else {
      console.log('❌ Registration failed!');
    }
  } catch (error) {
    console.error('❌ Registration error:', error.response?.data || error.message);
    
    // Try login instead if registration fails
    console.log('   Attempting login with same credentials...');
  }
  
  // 2. Test login (if registration failed or to verify login works)
  if (!token) {
    try {
      console.log(`2️⃣ Logging in as: ${testUser.email}`);
      const loginResponse = await axios.post(`${API_URL}/auth/login`, {
        email: testUser.email,
        password: testUser.password
      });
      
      if (loginResponse.data.success) {
        console.log('✅ Login successful!');
        token = loginResponse.data.token;
        userId = loginResponse.data.user.id;
        console.log(`   User ID: ${userId}`);
      } else {
        console.log('❌ Login failed!');
      }
    } catch (error) {
      console.error('❌ Login error:', error.response?.data || error.message);
    }
  }
  
  // Exit if we couldn't get a token
  if (!token) {
    console.error('❌ Unable to authenticate. Stopping tests.');
    return;
  }
  
  // 3. Test authenticated endpoint
  try {
    console.log('3️⃣ Testing authenticated endpoint: /api/auth/me');
    const meResponse = await axios.get(`${API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    console.log('✅ Auth check successful!');
    console.log('   User data:', meResponse.data);
  } catch (error) {
    console.error('❌ Auth check error:', error.response?.data || error.message);
  }
  
  // 4. Test goal creation
  try {
    console.log('4️⃣ Creating a test goal');
    const goalData = {
      title: 'Test Goal',
      category: 'Testing',
      targetAmount: 1000,
      currentAmount: 0,
      deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
    };
    
    const goalResponse = await axios.post(`${API_URL}/goals`, goalData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    if (goalResponse.data.success) {
      console.log('✅ Goal creation successful!');
      console.log('   Goal data:', goalResponse.data.data);
    } else {
      console.log('❌ Goal creation failed!');
    }
  } catch (error) {
    console.error('❌ Goal creation error:', error.response?.data || error.message);
  }
  
  console.log('--------------------------------');
  console.log('🏁 API Flow Verification Complete');
}

// Run the tests
runTests().catch(error => {
  console.error('Unhandled error:', error);
});
