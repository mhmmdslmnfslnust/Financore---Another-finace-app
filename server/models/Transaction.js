const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: [true, 'Please add an amount']
  },
  type: {
    type: String,
    required: [true, 'Please specify transaction type'],
    enum: ['income', 'expense']
  },
  category: {
    type: String,
    required: [true, 'Please add a category']
  },
  description: {
    type: String,
    default: ''
  },
  date: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Transaction', transactionSchema);
