const express = require('express');
const { 
  getGoals, 
  createGoal, 
  updateGoal, 
  deleteGoal 
} = require('../controllers/goalController');
const { protect } = require('../middleware/auth');
const router = express.Router();

// All goal routes require authentication
router.use(protect);

// Get all goals & Create new goal
router.route('/')
  .get(getGoals)
  .post(createGoal);

// Update & Delete goal
router.route('/:id')
  .put(updateGoal)
  .delete(deleteGoal);

module.exports = router;
