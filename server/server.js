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

// Configure CORS - Add this near the top of your Express setup
app.use(cors({
  origin: '*', // For testing - allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Ensure body parsing middleware is properly set up
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Add request debugging - log all incoming requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Add detailed request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  
  // Log request body for POST/PUT but hide passwords
  if (['POST', 'PUT'].includes(req.method) && req.body) {
    const sanitizedBody = { ...req.body };
    if (sanitizedBody.password) sanitizedBody.password = '[HIDDEN]';
    console.log('Request body:', sanitizedBody);
  }
  
  // Track response
  const originalSend = res.send;
  res.send = function(body) {
    const responseTime = Date.now() - start;
    console.log(`Response ${res.statusCode} sent in ${responseTime}ms`);
    
    // Try to log response body safely
    try {
      const parsedBody = JSON.parse(body);
      const sanitizedResponse = { ...parsedBody };
      if (sanitizedResponse.token) sanitizedResponse.token = `${sanitizedResponse.token.substring(0, 15)}...`;
      console.log('Response body:', sanitizedResponse);
    } catch (e) {
      // Skip body logging if not JSON
    }
    
    return originalSend.call(this, body);
  };
  
  next();
});

// Configure MongoDB options with increased timeouts
const mongooseOptions = {
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 30000,
  family: 4  // Force IPv4 (can help with some connection issues)
};

// Connect to MongoDB with retry logic
function connectWithRetry(retryCount = 5, delay = 5000) {
  console.log(`MongoDB connection attempt ${6 - retryCount}`);
  
  mongoose.connect(process.env.MONGO_URI, mongooseOptions)
    .then(() => {
      console.log('MongoDB Connected Successfully!');
    })
    .catch(err => {
      console.error('MongoDB Connection Error:', err);
      
      if (retryCount > 0) {
        console.log(`Retrying connection in ${delay/1000} seconds...`);
        setTimeout(() => connectWithRetry(retryCount - 1, delay), delay);
      } else {
        console.error('Failed to connect to MongoDB after several attempts');
      }
    });
}

// Start connection process with retry
connectWithRetry();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/test', testRoutes); // Add test routes

// Add a simple debug endpoint
app.get('/api/debug', (req, res) => {
  res.json({
    success: true,
    message: 'API server is working',
    timestamp: new Date().toISOString()
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

// Add an error handler for uncaught exceptions
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    error: 'Server error'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
