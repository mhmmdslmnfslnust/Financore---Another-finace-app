const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Models (we don't want to delete users)
const Goal = require('../models/Goal');
const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected for cleanup'))
  .catch(err => {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
  });

const cleanDatabase = async () => {
  try {
    // Delete all existing data except users
    await Goal.deleteMany({});
    await Transaction.deleteMany({});
    await Budget.deleteMany({});
    
    console.log('Database cleaned successfully! All goals, transactions, and budgets have been removed.');
    process.exit(0);
  } catch (error) {
    console.error('Database cleanup failed:', error);
    process.exit(1);
  }
};

// Confirm before running
console.log('WARNING: This will delete all goals, transactions, and budgets from the database.');
console.log('Press Ctrl+C to cancel or wait 5 seconds to continue...');

setTimeout(() => {
  cleanDatabase();
}, 5000);
