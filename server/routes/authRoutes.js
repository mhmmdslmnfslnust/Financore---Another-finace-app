const express = require('express');
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Register and login routes
router.post('/register', register);
router.post('/login', login);
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
