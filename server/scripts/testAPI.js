const axios = require('axios');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Test data
const testGoal = {
  title: 'Test Goal',
  targetAmount: 1000,
  currentAmount: 0,
  category: 'Savings',
  deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // 90 days from now
};

// Test token (you'll need to replace this with a valid token)
const TOKEN = process.argv[2]; // Pass token as command line argument
if (!TOKEN) {
  console.error('Please provide a valid auth token as an argument');
  console.log('Usage: node testAPI.js YOUR_AUTH_TOKEN');
  process.exit(1);
}

// Configure axios
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${TOKEN}`
  }
});

// Test functions
async function testAuthEndpoint() {
  try {
    const response = await api.get('/auth/me');
    console.log('\n✅ Auth Endpoint Test Passed!');
    console.log('Current user:', response.data);
    return response.data.data.id; // Return user ID for other tests
  } catch (error) {
    console.error('\n❌ Auth Endpoint Test Failed!');
    console.error('Error:', error.response?.data || error.message);
    return null;
  }
}

async function testCreateGoal(userId) {
  try {
    const goalWithUser = { ...testGoal, user: userId };
    const response = await api.post('/goals', goalWithUser);
    console.log('\n✅ Create Goal Test Passed!');
    console.log('Created goal:', response.data);
    return response.data.data._id; // Return goal ID for other tests
  } catch (error) {
    console.error('\n❌ Create Goal Test Failed!');
    console.error('Error:', error.response?.data || error.message);
    return null;
  }
}

async function testGetGoals() {
  try {
    const response = await api.get('/goals');
    console.log('\n✅ Get Goals Test Passed!');
    console.log(`Retrieved ${response.data.count} goals`);
    return true;
  } catch (error) {
    console.error('\n❌ Get Goals Test Failed!');
    console.error('Error:', error.response?.data || error.message);
    return false;
  }
}

async function testDeleteGoal(goalId) {
  if (!goalId) {
    console.log('\n⚠️ Skipping Delete Goal Test (no goal ID)');
    return false;
  }
  
  try {
    const response = await api.delete(`/goals/${goalId}`);
    console.log('\n✅ Delete Goal Test Passed!');
    console.log('Response:', response.data);
    return true;
  } catch (error) {
    console.error('\n❌ Delete Goal Test Failed!');
    console.error('Error:', error.response?.data || error.message);
    return false;
  }
}

// Main test function
async function runTests() {
  console.log('🚀 Starting API Tests...');
  
  // Test authentication
  const userId = await testAuthEndpoint();
  if (!userId) {
    console.error('❌ Authentication failed, stopping tests');
    process.exit(1);
  }
  
  // Test goals API
  const goalId = await testCreateGoal(userId);
  await testGetGoals();
  
  // Clean up - delete test goal
  if (goalId) {
    await testDeleteGoal(goalId);
  }
  
  console.log('\n✨ Tests completed!');
}

// Run the tests
runTests().catch(error => {
  console.error('Test failed with error:', error);
  process.exit(1);
});
