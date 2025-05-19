// Mock authentication service to simulate backend API

// Simple user storage (in-memory database)
let users = [];

// Simulate delay for API calls
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const mockAuthService = {
  // Register a new user
  async register(userData) {
    await delay(500); // Simulate network delay
    
    // Check if user already exists
    const existingUser = users.find(user => user.email === userData.email);
    if (existingUser) {
      throw new Error('User already exists with this email');
    }
    
    // Create new user
    const newUser = {
      id: Date.now().toString(),
      username: userData.username,
      email: userData.email,
      // In a real app, you would hash the password
      password: userData.password
    };
    
    // Save user to "database"
    users.push(newUser);
    
    // Generate token (simplified)
    const token = `mock_token_${newUser.id}`;
    
    // Return user data without password
    const { password, ...userWithoutPassword } = newUser;
    return {
      success: true,
      token,
      user: userWithoutPassword
    };
  },
  
  // Login user
  async login(email, password) {
    await delay(500); // Simulate network delay
    
    // Find user
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    
    // Generate token
    const token = `mock_token_${user.id}`;
    
    // Return user data without password
    const { password: pwd, ...userWithoutPassword } = user;
    return {
      success: true,
      token,
      user: userWithoutPassword
    };
  },
  
  // Get current user
  async getMe(token) {
    await delay(300);
    
    if (!token || !token.startsWith('mock_token_')) {
      throw new Error('Invalid token');
    }
    
    const userId = token.replace('mock_token_', '');
    const user = users.find(u => u.id === userId);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // Return user data without password
    const { password, ...userWithoutPassword } = user;
    return {
      success: true,
      data: userWithoutPassword
    };
  }
};
