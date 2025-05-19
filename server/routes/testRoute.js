const express = require('express');
const { protect } = require('../middleware/auth');
const Goal = require('../models/Goal');
const router = express.Router();

// Verify authentication
router.get('/auth-check', protect, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Authentication working correctly',
    user: req.user
  });
});

// Test goal creation directly
router.post('/create-goal', protect, async (req, res) => {
  try {
    console.log('Test route: Creating goal for user:', req.user);
    
    // Create a test goal for this user
    const testGoal = {
      user: req.user.id,
      title: 'Test Goal via API',
      targetAmount: 1000,
      category: 'Testing',
      currentAmount: 0,
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
    };
    
    console.log('Creating test goal:', testGoal);
    
    // Save directly to MongoDB
    const goal = await Goal.create(testGoal);
    console.log('Test goal created:', goal);
    
    res.status(201).json({
      success: true,
      message: 'Test goal created successfully',
      data: goal
    });
  } catch (error) {
    console.error('Error in test goal creation:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
