const express = require('express');
const router = express.Router();
const Goal = require('../models/Goal');
const { protect } = require('../middleware/auth'); // Fix the import to get the protect middleware function

// @route   GET /api/goals
// @desc    Get all goals for logged in user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user.id });
    res.json({ success: true, data: goals });
  } catch (err) {
    console.error('Error fetching goals:', err.message);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// @route   POST /api/goals
// @desc    Create a new goal
// @access  Private
router.post('/', protect, async (req, res) => {
  const { name, targetAmount, deadline, category, description } = req.body;

  // Simple validation
  if (!name || !targetAmount) {
    return res.status(400).json({ success: false, error: 'Please provide all required fields' });
  }

  try {
    // Create new goal
    const goal = new Goal({
      name,
      targetAmount,
      deadline,
      category,
      description,
      user: req.user.id
    });

    await goal.save();
    res.status(201).json({ success: true, data: goal });
  } catch (err) {
    console.error('Error creating goal:', err.message);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// @route   PUT /api/goals/:id
// @desc    Update a goal
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const { 
      name, 
      targetAmount, 
      currentAmount, 
      deadline, 
      category,
      description
    } = req.body;
    
    // Build goal object with only fields that are provided
    const goalFields = {};
    if (name) goalFields.name = name;
    if (targetAmount !== undefined) goalFields.targetAmount = targetAmount;
    if (currentAmount !== undefined) goalFields.currentAmount = currentAmount;
    if (deadline) goalFields.deadline = deadline;
    if (category) goalFields.category = category;
    if (description) goalFields.description = description;
    
    // Find goal by ID and check if it exists
    let goal = await Goal.findById(req.params.id);
    if (!goal) {
      return res.status(404).json({ success: false, error: 'Goal not found' });
    }
    
    // Check if user owns this goal
    if (goal.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'Not authorized' });
    }
    
    // Update the goal
    goal = await Goal.findByIdAndUpdate(
      req.params.id,
      { $set: goalFields },
      { new: true }
    );
    
    res.json({ success: true, data: goal });
  } catch (err) {
    console.error('Error updating goal:', err.message);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// @route   PUT /api/goals/:id/contribute
// @desc    Contribute to a goal
// @access  Private
router.put('/:id/contribute', protect, async (req, res) => {
  try {
    const { amount } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Please provide a valid contribution amount' 
      });
    }
    
    // Find goal by ID
    let goal = await Goal.findById(req.params.id);
    if (!goal) {
      return res.status(404).json({ success: false, error: 'Goal not found' });
    }
    
    // Check if user owns this goal
    if (goal.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'Not authorized' });
    }
    
    // Add contribution to current amount
    goal.currentAmount += amount;
    
    // Add contribution to history
    goal.contributionHistory = goal.contributionHistory || [];
    goal.contributionHistory.push({
      amount,
      date: new Date()
    });
    
    await goal.save();
    
    res.json({ success: true, data: goal });
  } catch (err) {
    console.error('Error contributing to goal:', err.message);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// @route   DELETE /api/goals/:id
// @desc    Delete a goal
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    // Find goal by ID
    const goal = await Goal.findById(req.params.id);
    
    // Check if goal exists
    if (!goal) {
      return res.status(404).json({ success: false, error: 'Goal not found' });
    }
    
    // Verify user owns the goal
    if (goal.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'Not authorized' });
    }
    
    // Remove goal
    await Goal.findByIdAndDelete(req.params.id);
    
    res.json({ success: true, message: 'Goal removed' });
  } catch (err) {
    console.error('Error deleting goal:', err.message);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

module.exports = router;
