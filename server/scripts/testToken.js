const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB Connected Successfully!');
    
    try {
      const users = await User.find().limit(1);
      if (users.length === 0) {
        console.error('No users found');
        process.exit(1);
      }
      
      const user = users[0];
      console.log(`Found user: ${user.username} (${user._id})`);
      
      // Generate a token for this user
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      
      console.log('\n==================================');
      console.log('COPY THIS TOKEN FOR TESTING:');
      console.log('\n' + token);
      console.log('\n==================================');
      
      console.log('\nTest command:');
      console.log(`curl -H "Authorization: Bearer ${token}" http://localhost:5000/api/debug/auth-test`);
      console.log('\nOr in browser console:');
      console.log(`
fetch('http://localhost:5000/api/debug/auth-test', {
  headers: {
    'Authorization': 'Bearer ${token}'
  }
}).then(r => r.json()).then(console.log)
      `);
    } catch (error) {
      console.error('Error:', error);
    }
    
    process.exit(0);
  })
  .catch(err => {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
  });
