const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
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
      // 1. Find a test user
      const users = await User.find().limit(1);
      
      if (users.length === 0) {
        console.log('No users found in database. Please register a user first.');
        process.exit(1);
      }
      
      const testUser = users[0];
      console.log('\n🧪 Test User:');
      console.log(`ID: ${testUser._id}`);
      console.log(`Username: ${testUser.username}`);
      console.log(`Email: ${testUser.email}`);
      
      // 2. Test token generation using User model method (if it exists)
      console.log('\n🔑 Testing token generation from User model:');
      try {
        if (typeof testUser.getSignedJwtToken === 'function') {
          const userToken = testUser.getSignedJwtToken();
          console.log('Token generated from user model:', userToken ? 'Success' : 'Failed');
          if (userToken) {
            console.log('Token preview:', userToken.substring(0, 20) + '...');
            
            // Try to verify this token
            try {
              const decoded = jwt.verify(userToken, process.env.JWT_SECRET);
              console.log('✓ Token verification successful');
              console.log('Decoded payload:', decoded);
            } catch (verifyErr) {
              console.log('✗ Token verification failed:', verifyErr.message);
            }
          }
        } else {
          console.log('✗ getSignedJwtToken method not found on User model');
        }
      } catch (tokenErr) {
        console.log('✗ Error generating token from User model:', tokenErr.message);
      }
      
      // 3. Test direct token generation with jwt.sign
      console.log('\n🔐 Testing direct token generation with jwt.sign:');
      try {
        console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
        console.log('JWT_SECRET length:', process.env.JWT_SECRET ? process.env.JWT_SECRET.length : 0);
        
        const directToken = jwt.sign(
          { id: testUser._id },
          process.env.JWT_SECRET,
          { expiresIn: '1h' }
        );
        
        console.log('Direct token generated:', directToken ? 'Success' : 'Failed');
        console.log('Token preview:', directToken.substring(0, 20) + '...');
        
        // Try to verify this token
        try {
          const decoded = jwt.verify(directToken, process.env.JWT_SECRET);
          console.log('✓ Direct token verification successful');
          console.log('Decoded payload:', decoded);
        } catch (verifyErr) {
          console.log('✗ Direct token verification failed:', verifyErr.message);
        }
      } catch (directErr) {
        console.log('✗ Error generating direct token:', directErr.message);
      }
      
      // 4. Test manual authentication flow
      console.log('\n🔎 Testing authentication flow:');
      try {
        // Generate a token
        const authToken = jwt.sign({ id: testUser._id }, process.env.JWT_SECRET);
        
        // Mock req and res objects
        const req = {
          headers: {
            authorization: `Bearer ${authToken}`
          }
        };
        
        const res = {
          status: (code) => ({
            json: (data) => {
              console.log('Response:', { code, data });
            }
          })
        };
        
        // Mock next function
        const next = () => {
          console.log('✓ Next function called - authentication successful');
        };
        
        // Import the protect middleware
        const { protect } = require('../middleware/auth');
        
        // Execute the middleware
        console.log('Executing protect middleware...');
        await protect(req, res, next);
        
        // Check if user was set in req object
        if (req.user) {
          console.log('User set in request:', req.user);
        }
      } catch (authErr) {
        console.log('✗ Error testing auth flow:', authErr.message);
      }
      
    } catch (error) {
      console.error('Script Error:', error);
    }
    
    process.exit(0);
  })
  .catch(err => {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
  });
