const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Goal = require('../models/Goal');
const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');
const User = require('../models/User');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected for migration'))
  .catch(err => {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
  });

const migrateData = async () => {
  try {
    // Get default user ID to associate data with
    // You would need to decide which user should own which data
    const defaultUser = await User.findOne({ email: 'default@example.com' });
    
    if (!defaultUser) {
      console.error('Default user not found');
      process.exit(1);
    }
    
    // Migrate goals without user field
    const goalsCount = await Goal.updateMany(
      { user: { $exists: false } },
      { $set: { user: defaultUser._id } }
    );
    
    // Migrate transactions without user field
    const transactionsCount = await Transaction.updateMany(
      { user: { $exists: false } },
      { $set: { user: defaultUser._id } }
    );
    
    // Migrate budgets without user field
    const budgetsCount = await Budget.updateMany(
      { user: { $exists: false } },
      { $set: { user: defaultUser._id } }
    );
    
    console.log(`Migration complete! Updated: ${goalsCount.modifiedCount} goals, ${transactionsCount.modifiedCount} transactions, ${budgetsCount.modifiedCount} budgets`);
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

migrateData();
