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
      }
      
      // If goals collection exists, count documents
      if (collections.some(col => col.name === 'goals')) {
        const goalCount = await mongoose.connection.db.collection('goals').countDocuments();
        console.log(`Goal collection has ${goalCount} documents`);
        
        // Show a sample goal if available
        if (goalCount > 0) {
          const sampleGoal = await mongoose.connection.db.collection('goals').findOne();
          console.log('\nSample goal document:');
          console.log(JSON.stringify(sampleGoal, null, 2));
        }
      } else {
        console.log('\nGoals collection does not exist yet!');
      }
      
      // If transactions collection exists, count documents
      if (collections.some(col => col.name === 'transactions')) {
        const transCount = await mongoose.connection.db.collection('transactions').countDocuments();
        console.log(`Transaction collection has ${transCount} documents`);
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
