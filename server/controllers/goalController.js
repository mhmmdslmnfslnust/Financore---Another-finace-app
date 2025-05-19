const Goal = require('../models/Goal');

// Get all goals for the authenticated user
exports.getGoals = async (req, res) => {
  try {
    // Find only goals that belong to the current user
    const goals = await Goal.find({ user: req.user.id }).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: goals.length,
      data: goals
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Create a new goal
exports.createGoal = async (req, res) => {
  try {
    // Add user id to the request body to associate the goal with the user
    req.body.user = req.user.id;
    
    const goal = await Goal.create(req.body);
    
    res.status(201).json({
      success: true,
      data: goal
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
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
    res.status(400).json({
      success: false,
      error: error.message
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
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
