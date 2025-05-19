const express = require('express');
const { 
  getBudgets, 
  createBudget, 
  updateBudget, 
  deleteBudget 
} = require('../controllers/budgetController');
const { protect } = require('../middleware/auth');
const router = express.Router();

// All budget routes require authentication
router.use(protect);

// Get all budgets & Create new budget
router.route('/')
  .get(getBudgets)
  .post(createBudget);

// Update & Delete budget
router.route('/:id')
  .put(updateBudget)
  .delete(deleteBudget);

module.exports = router;
