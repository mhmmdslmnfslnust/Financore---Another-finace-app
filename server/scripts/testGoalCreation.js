const axios = require('axios');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Your valid token
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MmI5MTY2NTk0ZGUwMmE5YzcwZGIzMiIsImlhdCI6MTc0NzY5MDI0M30.JNVjQySt6dmq0VdFRuFgfYPOWJPaUCsZY5o9zTxnSTA";

// Test goal data
const testGoal = {
  title: "Test Goal via Script",
  targetAmount: 5000,
  currentAmount: 0,
  category: "Savings",
  deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // 90 days from now
};

// Function to test goal creation
async function testGoalCreation() {
  try {
    console.log('Testing goal creation API...');
    console.log('Sending goal data:', testGoal);
    
    const response = await axios.post('http://localhost:5000/api/goals', testGoal, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('\n✅ Goal creation successful!');
    console.log('Created goal:', response.data);
    
    console.log('\nNow run this to check if it was saved to MongoDB:');
    console.log('node server/scripts/debugMongo.js');
  } catch (error) {
    console.log('\n❌ Goal creation failed!');
    console.log('Error:', error.response ? error.response.data : error.message);
    
    // Show more details if available
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Headers:', error.response.headers);
    }
  }
}

// Run the test
testGoalCreation();
