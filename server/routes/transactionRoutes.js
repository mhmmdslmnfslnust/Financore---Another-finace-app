const express = require('express');
const { 
  getTransactions, 
  createTransaction, 
  updateTransaction, 
  deleteTransaction 
} = require('../controllers/transactionController');
const { protect } = require('../middleware/auth');
const router = express.Router();

// All transaction routes require authentication
router.use(protect);

// Get all transactions & Create new transaction
router.route('/')
  .get(getTransactions)
  .post(createTransaction);

// Update & Delete transaction
router.route('/:id')
  .put(updateTransaction)
  .delete(deleteTransaction);

module.exports = router;
