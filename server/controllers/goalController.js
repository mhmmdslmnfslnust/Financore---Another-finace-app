const Goal = require('../models/Goal');

// Get all goals for the authenticated user
exports.getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user.id });
    
    res.status(200).json({
      success: true,
      count: goals.length,
      data: goals
    });
  } catch (error) {
    console.error('Error getting goals:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// Create new goal
exports.createGoal = async (req, res) => {
  try {
    // Add user id to goal
    req.body.user = req.user.id;
    
    const goal = await Goal.create(req.body);
    
    res.status(201).json({
      success: true,
      data: goal
    });
  } catch (error) {
    console.error('Error creating goal:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
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

// Update goal
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
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
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

// Delete goal
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

// Contribute to goal - Special endpoint for goal contributions
exports.contributeToGoal = async (req, res) => {
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
        error: 'Not authorized to contribute to this goal'
      });
    }
    
    // Get contribution amount from request
    const { amount } = req.body;
    
    if (!amount || isNaN(parseFloat(amount))) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid contribution amount'
      });
    }
    
    // Update goal with new contribution
    const contributionAmount = parseFloat(amount);
    const currentAmount = parseFloat(goal.currentAmount || 0);
    
    goal = await Goal.findByIdAndUpdate(req.params.id, 
      { currentAmount: currentAmount + contributionAmount },
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      data: goal,
      message: `Successfully contributed $${contributionAmount} to ${goal.title}`
    });
  } catch (error) {
    console.error('Error contributing to goal:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};
