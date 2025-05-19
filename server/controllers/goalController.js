const Goal = require('../models/Goal');

// Get all goals for the authenticated user
exports.getGoals = async (req, res) => {
  try {
    console.log('Getting goals for user:', req.user);
    
    // Find only goals that belong to the current user
    const goals = await Goal.find({ user: req.user.id }).sort({ createdAt: -1 });
    console.log(`Found ${goals.length} goals for user ${req.user.id}`);
    
    res.status(200).json({
      success: true,
      count: goals.length,
      data: goals
    });
  } catch (error) {
    console.error('Error getting goals:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Create a new goal
exports.createGoal = async (req, res) => {
  try {
    console.log('Creating goal for user:', req.user);
    console.log('Goal data received:', req.body);
    
    // Add user id to the request body to associate the goal with the user
    req.body.user = req.user.id;
    
    console.log('Modified goal data with user ID:', req.body);
    
    // Validate required fields
    const { title, targetAmount, category } = req.body;
    if (!title || !targetAmount || !category) {
      console.error('Validation error: Missing required fields');
      return res.status(400).json({
        success: false,
        error: 'Please provide title, targetAmount, and category'
      });
    }
    
    // Create the goal in the database
    const goal = await Goal.create(req.body);
    console.log('Goal created successfully:', goal);
    
    res.status(201).json({
      success: true,
      data: goal
    });
  } catch (error) {
    console.error('Error creating goal:', error);
    
    // Check for specific error types
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        error: messages
      });
    }
    
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Update an existing goal
exports.updateGoal = async (req, res) => {
  // ...existing code...
};

// Delete a goal
exports.deleteGoal = async (req, res) => {
  // ...existing code...
};
