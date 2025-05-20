const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const { protect } = require('../middleware/auth');

// Get all transactions for logged in user
router.get('/', protect, async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id }).sort({ date: -1 });
    res.json({ success: true, data: transactions });
  } catch (err) {
    console.error('Error fetching transactions:', err.message);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Add new transaction
router.post('/', protect, async (req, res) => {
  const { amount, type, category, description, date } = req.body;

  // Simple validation
  if (!amount || !type || !category) {
    return res.status(400).json({ success: false, error: 'Please provide all required fields' });
  }

  try {
    // Create new transaction
    const transaction = new Transaction({
      amount,
      type,
      category,
      description,
      date: date || Date.now(),
      user: req.user.id
    });

    await transaction.save();
    res.status(201).json({ success: true, data: transaction });
  } catch (err) {
    console.error('Error creating transaction:', err.message);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Update transaction
router.put('/:id', protect, async (req, res) => {
  try {
    const { 
      amount, 
      category, 
      description, 
      date, 
      type 
    } = req.body;
    
    // Build transaction object with only fields that are provided
    const transactionFields = {};
    if (amount !== undefined) transactionFields.amount = amount;
    if (category) transactionFields.category = category;
    if (description) transactionFields.description = description;
    if (date) transactionFields.date = date;
    if (type) transactionFields.type = type;
    
    // Find transaction by ID and check if it exists
    let transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ success: false, error: 'Transaction not found' });
    }
    
    // Check if user owns this transaction
    if (transaction.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'Not authorized' });
    }
    
    // Update the transaction
    transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      { $set: transactionFields },
      { new: true }
    );
    
    res.json({ success: true, data: transaction });
  } catch (err) {
    console.error('Error updating transaction:', err.message);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Delete transaction
router.delete('/:id', protect, async (req, res) => {
  try {
    // Find transaction by ID
    const transaction = await Transaction.findById(req.params.id);
    
    // Check if transaction exists
    if (!transaction) {
      return res.status(404).json({ success: false, error: 'Transaction not found' });
    }
    
    // Verify user owns the transaction
    if (transaction.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'Not authorized' });
    }
    
    // Remove transaction
    await Transaction.findByIdAndDelete(req.params.id);
    
    res.json({ success: true, message: 'Transaction removed' });
  } catch (err) {
    console.error('Error deleting transaction:', err.message);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

module.exports = router;
