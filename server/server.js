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

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Body:', req.body);
  }
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

// Add a debug route that doesn't require auth
app.get('/api/debug', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is working',
    apiEndpoints: [
      '/api/auth/register',
      '/api/auth/login',
      '/api/auth/me',
      '/api/goals',
      '/api/transactions',
      '/api/budgets',
      '/api/debug/auth-test'
    ]
  });
});

// Add an auth test route
app.get('/api/debug/auth-test', async (req, res) => {
  const token = req.headers.authorization?.split(' ')?.[1] || 'No token provided';
  
  try {
    if (token === 'No token provided') {
      return res.status(401).json({
        success: false,
        error: 'No token provided',
        headers: req.headers
      });
    }
    
    // Try to verify the token
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find the user
    const User = require('./models/User');
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User not found',
        tokenInfo: decoded
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Authentication successful',
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'Invalid token',
      errorMessage: error.message,
      tokenPreview: token.substring(0, 20) + '...'
    });
  }
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
