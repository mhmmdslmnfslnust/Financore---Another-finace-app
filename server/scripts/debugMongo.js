const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Show the MongoDB URI being used (with password masked)
const connectionURI = process.env.MONGO_URI || 'No URI found';
console.log('MongoDB URI:', connectionURI.replace(/:([^:@]+)@/, ':****@'));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB Connected Successfully!');
    
    // Test MongoDB connection by listing collections
    try {
      const collections = await mongoose.connection.db.listCollections().toArray();
      console.log('\nCollections in database:');
      collections.forEach(collection => {
        console.log(` - ${collection.name}`);
      });
      
      // If users collection exists, count documents
      if (collections.some(col => col.name === 'users')) {
        const userCount = await mongoose.connection.db.collection('users').countDocuments();
        console.log(`\nUser collection has ${userCount} documents`);
        
        // Show user details to verify authentication
        const users = await mongoose.connection.db.collection('users').find({}).toArray();
        users.forEach(user => {
          console.log(`\nUser ID: ${user._id}`);
          console.log(`Username: ${user.username}`);
          console.log(`Email: ${user.email}`);
        });
      }
      
      // If goals collection exists, count documents
      if (collections.some(col => col.name === 'goals')) {
        const goalCount = await mongoose.connection.db.collection('goals').countDocuments();
        console.log(`\nGoal collection has ${goalCount} documents`);
        
        // Show all goals for detailed analysis
        if (goalCount > 0) {
          const goals = await mongoose.connection.db.collection('goals').find({}).toArray();
          console.log('\nAll goals in collection:');
          goals.forEach(goal => {
            console.log(`\nGoal ID: ${goal._id}`);
            console.log(`Title: ${goal.title}`);
            console.log(`User ID: ${goal.user}`);
            console.log(`Target Amount: ${goal.targetAmount}`);
            console.log(`Created: ${goal.createdAt}`);
          });
        } else {
          console.log('No goals found. Check if the user is correctly adding goals.');
        }
      } else {
        console.log('\nGoals collection does not exist yet!');
      }
      
      // Also show detailed transaction info
      if (collections.some(col => col.name === 'transactions')) {
        const transCount = await mongoose.connection.db.collection('transactions').countDocuments();
        console.log(`\nTransaction collection has ${transCount} documents`);
        
        if (transCount > 0) {
          const transactions = await mongoose.connection.db.collection('transactions')
            .find({}).limit(5).toArray();
          console.log('\nRecent transactions:');
          transactions.forEach(trans => {
            console.log(`\nTransaction ID: ${trans._id}`);
            console.log(`User ID: ${trans.user}`);
            console.log(`Amount: ${trans.amount}`);
            console.log(`Type: ${trans.type}`);
            console.log(`Date: ${trans.date}`);
          });
        }
      }
    } catch (error) {
      console.error('Error checking collections:', error);
    }
    
    console.log('\nDatabase check complete!');
    process.exit(0);
  })
  .catch(err => {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
  });
