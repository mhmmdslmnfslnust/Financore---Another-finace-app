const Goal = require('../models/Goal');

// Get all goals for the authenticated user
exports.getGoals = async (req, res) => {
  try {
    console.log('Getting goals for user ID:', req.user.id);
    
    // Find goals with the current user's ID
    const goals = await Goal.find({ user: req.user.id }).sort({ createdAt: -1 });
    
    console.log(`Found ${goals.length} goals for user ${req.user.id}`);
    
    res.status(200).json({
      success: true,
      count: goals.length,
      data: goals
    });
  } catch (error) {
    console.error('Error in getGoals controller:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// Create a new goal
exports.createGoal = async (req, res) => {
  try {
    console.log('Create goal request from user:', req.user.id);
    console.log('Goal data received:', req.body);
    
    // Add user id to goal data
    req.body.user = req.user.id;
    
    // Create goal in database
    const goal = await Goal.create(req.body);
    
    console.log('Goal created successfully with ID:', goal._id);
    
    res.status(201).json({
      success: true,
      data: goal
    });
  } catch (error) {
    console.error('Error in createGoal controller:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      
      return res.status(400).json({
        success: false,
        error: messages
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// Update an existing goal
exports.updateGoal = async (req, res) => {
  try {
    let goal = await Goal.findById(req.params.id);
    
    if (!goal) {
      return res.status(404).json({
        success: false,
        error: 'Goal not found'
      });
    }
    
    // Ensure user owns this goal
    if (goal.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to update this goal'
      });
    }
    
    goal = await Goal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: goal
    });
  } catch (error) {
    console.error('Error updating goal:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// Delete a goal
exports.deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);
    
    if (!goal) {
      return res.status(404).json({
        success: false,
        error: 'Goal not found'
      });
    }
    
    // Ensure user owns this goal
    if (goal.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to delete this goal'
      });
    }
    
    await goal.deleteOne();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Error deleting goal:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};
