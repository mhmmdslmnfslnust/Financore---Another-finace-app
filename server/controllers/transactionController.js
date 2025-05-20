const Transaction = require('../models/Transaction');

// Get all transactions for logged in user
exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id }).sort({ date: -1 });
    
    return res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// Add transaction
exports.addTransaction = async (req, res) => {
  try {
    // Add user id to request body
    req.body.user = req.user.id;
    
    const transaction = await Transaction.create(req.body);
    
    return res.status(201).json({
      success: true,
      data: transaction
    });
  } catch (error) {
    console.error('Error adding transaction:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        error: messages
      });
    }
    
    return res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// Update transaction
exports.updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    
    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: 'Transaction not found'
      });
    }
    
    // Check if user owns the transaction
    if (transaction.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized'
      });
    }
    
    const updatedTransaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    return res.status(200).json({
      success: true,
      data: updatedTransaction
    });
  } catch (error) {
    console.error('Error updating transaction:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// Delete transaction
exports.deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    
    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: 'Transaction not found'
      });
    }
    
    // Check if user owns the transaction
    if (transaction.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized'
      });
    }
    
    await transaction.deleteOne();
    
    return res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};
