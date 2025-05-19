const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const goalRoutes = require('./routes/goalRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const testRoutes = require('./routes/testRoute');

// Load environment variables - update path to make sure it finds the .env file
dotenv.config({ path: path.join(__dirname, '.env') });

// Verify env variables are loaded
console.log('MongoDB URI exists:', !!process.env.MONGO_URI);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Add request logging middleware before routes
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  console.log('Headers:', req.headers.authorization ? 
    { ...req.headers, authorization: 'Bearer [HIDDEN]' } : 
    req.headers);
  console.log('Body:', req.body);
  next();
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/test', testRoutes); // Add test routes

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
