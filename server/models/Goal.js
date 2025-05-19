const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please provide a goal title'],
    trim: true
  },
  targetAmount: {
    type: Number,
    required: [true, 'Please provide a target amount']
  },
  currentAmount: {
    type: Number,
    default: 0
  },
  category: {
    type: String,
    required: [true, 'Please provide a category']
  },
  deadline: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Goal', goalSchema);
