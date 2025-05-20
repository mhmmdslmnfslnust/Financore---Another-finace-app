const express = require('express');
const { 
  getTransactions, 
  addTransaction,
  updateTransaction,
  deleteTransaction
} = require('../controllers/transactionController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(protect);

// Get all transactions & Add new transaction
router.route('/')
  .get(getTransactions)
  .post(addTransaction);

// Update & Delete transaction
router.route('/:id')
  .put(updateTransaction)
  .delete(deleteTransaction);

module.exports = router;
