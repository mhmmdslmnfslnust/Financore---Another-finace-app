const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB Connected Successfully!');
    
    try {
      // Find users
      const users = await mongoose.connection.db.collection('users').find({}).toArray();
      console.log('\nUsers in database:');
      
      users.forEach(user => {
        console.log(`\nID: ${user._id}`);
        console.log(`Username: ${user.username}`);
        console.log(`Email: ${user.email}`);
        console.log(`Created: ${user.createdAt}`);
      });
      
      console.log('\nTotal users:', users.length);
    } catch (error) {
      console.error('Error listing users:', error);
    }
    
    process.exit(0);
  })
  .catch(err => {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
  });
