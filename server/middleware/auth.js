const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes
exports.protect = async (req, res, next) => {
  try {
    let token;
    
    // Check authorization header format
    console.log('Auth Header:', req.headers.authorization);
    
    // Extract token from Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
      console.log('Token extracted:', token ? 'Token present' : 'No token');
    }
    
    // Check if token exists
    if (!token) {
      console.log('No token provided in request');
      return res.status(401).json({
        success: false,
        error: 'No authentication token, access denied'
      });
    }
    
    try {
      // Verify token with secret
      console.log('JWT Secret exists:', !!process.env.JWT_SECRET);
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Token decoded successfully:', decoded);
      
      // Find user with the ID from token
      const user = await User.findById(decoded.id);
      console.log('User found:', user ? 'Yes' : 'No');
      
      if (!user) {
        console.log('User not found for ID:', decoded.id);
        return res.status(401).json({
          success: false,
          error: 'User not found'
        });
      }
      
      // Set user in request object - ensure consistent property name
      req.user = {
        id: user._id, 
        username: user.username,
        email: user.email
      };
      
      console.log('User authorized:', req.user.username);
      next();
    } catch (error) {
      console.error('Token verification failed:', error.message);
      return res.status(401).json({
        success: false,
        error: 'Invalid authentication token'
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    return res.status(500).json({
      success: false,
      error: 'Server authentication error'
    });
  }
};
