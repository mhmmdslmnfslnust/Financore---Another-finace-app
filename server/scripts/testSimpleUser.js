const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const SimpleUser = require('../models/SimpleUser');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB Connected Successfully!');
    
    try {
      const testUser = {
        username: 'simpletest' + Date.now().toString().slice(-4),
        email: `simpletest${Date.now().toString().slice(-4)}@example.com`,
        password: 'password123'
      };
      
      console.log('Creating simple user:', testUser);
      const simpleUser = await SimpleUser.create(testUser);
      
      console.log('Simple user created successfully!');
      console.log(simpleUser);
      
      // Clean up
      await SimpleUser.deleteOne({ _id: simpleUser._id });
      console.log('Simple user deleted');
      
    } catch (error) {
      console.error('Error creating simple user:', error);
    }
    
    process.exit(0);
  })
  .catch(err => {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
  });
