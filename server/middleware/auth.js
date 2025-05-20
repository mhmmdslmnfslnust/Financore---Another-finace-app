const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes
exports.protect = async (req, res, next) => {
  let token;

  // Check if authorization header exists and starts with Bearer
  if (
    req.headers.authorization && 
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Extract token from header
    token = req.headers.authorization.split(' ')[1];
  }

  // Check if token exists
  if (!token) {
    console.error('No auth token found in request');
    return res.status(401).json({ 
      success: false, 
      error: 'Not authorized to access this route'
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token verified:', decoded);

    // Add user to request object
    req.user = await User.findById(decoded.id);
    
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        error: 'User not found with this token' 
      });
    }
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ 
      success: false, 
      error: 'Not authorized to access this route',
      details: error.message
    });
  }
};
