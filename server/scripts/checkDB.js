const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

console.log('MongoDB URI:', process.env.MONGO_URI ? 'Defined (hidden for security)' : 'NOT DEFINED');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Defined (hidden for security)' : 'NOT DEFINED');
console.log('JWT_EXPIRE:', process.env.JWT_EXPIRE || 'NOT DEFINED');

// Connect to MongoDB with all options
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000 // 5 seconds timeout
  })
  .then(() => {
    console.log('MongoDB Connected Successfully!');
    console.log('Connection state:', mongoose.connection.readyState);
    console.log('  0 = disconnected');
    console.log('  1 = connected');
    console.log('  2 = connecting');
    console.log('  3 = disconnecting');
    process.exit(0);
  })
  .catch(err => {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
  });
