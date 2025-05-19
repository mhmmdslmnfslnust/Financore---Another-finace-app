const express = require('express');
const jwt = require('jsonwebtoken'); // Add this import
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Register and login routes
router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);

// Add a simple test endpoint
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

// Add test token generation endpoint
router.get('/debug-token/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // Generate a test token
    const token = jwt.sign(
      { id: userId },
      process.env.JWT_SECRET || 'debugsecret',
      { expiresIn: '1h' }
    );
    
    res.status(200).json({
      success: true,
      message: 'Debug token generated',
      token,
      testEndpoint: '/auth/validate-token'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Add token validation endpoint
router.get('/validate-token', protect, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Token is valid',
    user: req.user
  });
});

// Add debug endpoint to check auth state
router.get('/debug', protect, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Authentication working correctly',
    user: req.user
  });
});

module.exports = router;
