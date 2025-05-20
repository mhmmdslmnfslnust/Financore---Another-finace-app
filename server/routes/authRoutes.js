const express = require('express');
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Input validation middleware
const validateLoginInput = (req, res, next) => {
  const { email, password } = req.body;
  
  // Check if request body is an object
  if (typeof req.body !== 'object' || req.body === null) {
    return res.status(400).json({
      success: false,
      error: 'Invalid request format',
      details: 'Request body must be a JSON object with email and password fields',
      received: typeof req.body
    });
  }
  
  // Check if email and password are provided
  if (!email) {
    return res.status(400).json({
      success: false,
      error: 'Missing email field',
      details: 'Please provide an email address'
    });
  }
  
  if (!password) {
    return res.status(400).json({
      success: false,
      error: 'Missing password field',
      details: 'Please provide a password'
    });
  }
  
  next();
};

// Register and login routes
router.post('/register', validateLoginInput, register);
router.post('/login', validateLoginInput, login);
router.get('/me', protect, getMe);

// Debug endpoints
router.get('/test', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Auth routes working',
    env: {
      jwtSecret: !!process.env.JWT_SECRET,
      jwtExpire: process.env.JWT_EXPIRE || 'not set'
    }
  });
});

module.exports = router;
