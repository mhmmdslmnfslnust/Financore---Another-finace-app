const fs = require('fs');
const path = require('path');

// Path to User model
const userModelPath = path.join(__dirname, '../models/User.js');

// Read the User model file
try {
  const modelContent = fs.readFileSync(userModelPath, 'utf8');
  console.log('User Model Content:');
  console.log('----------------------------------------');
  console.log(modelContent);
  console.log('----------------------------------------');
  console.log('Checking for critical methods...');
  
  // Check for getSignedJwtToken method
  if (modelContent.includes('getSignedJwtToken')) {
    console.log('✓ getSignedJwtToken method found in User model');
  } else {
    console.log('✗ getSignedJwtToken method NOT found in User model');
  }
  
  // Check for comparePassword method
  if (modelContent.includes('comparePassword')) {
    console.log('✓ comparePassword method found in User model');
  } else {
    console.log('✗ comparePassword method NOT found in User model');
  }
  
} catch (error) {
  console.error('Error reading User model:', error.message);
}
