const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB Connected Successfully!');
    
    try {
      const testUser = {
        username: 'mongoosetest' + Date.now().toString().slice(-4),
        email: `mongotest${Date.now().toString().slice(-4)}@example.com`,
        password: 'password123'
      };
      
      console.log('Attempting to create user directly with Mongoose:', testUser);
      
      // First, create a user instance
      const userInstance = new User(testUser);
      console.log('User instance created:', userInstance);
      
      // Try to save the user
      const savedUser = await userInstance.save();
      console.log('User saved successfully!');
      console.log('Saved user details:', {
        id: savedUser._id,
        username: savedUser.username,
        email: savedUser.email,
        passwordEncrypted: !!savedUser.password
      });
      
      // Clean up - remove the test user
      await User.deleteOne({ _id: savedUser._id });
      console.log('Test user deleted');
      
    } catch (error) {
      console.error('Error in User creation test:');
      console.error(error);
      
      if (error.name === 'ValidationError') {
        console.error('Validation errors:');
        Object.values(error.errors).forEach(err => {
          console.error(`- ${err.path}: ${err.message}`);
        });
      }
      
      if (error.code === 11000) {
        console.error('Duplicate key error:', error.keyValue);
      }
    }
    
    process.exit(0);
  })
  .catch(err => {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
  });
