const express = require('express');
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);

// Add debug endpoint to check auth state
router.get('/debug', protect, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Authentication working correctly',
    user: req.user
  });
});

module.exports = router;
