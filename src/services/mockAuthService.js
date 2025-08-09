// Mock authentication service to simulate backend API

// Simple in-memory database
let users = [];
let transactions = [
  {
    id: '1',
    amount: 500,
    category: 'Income',
    description: 'Salary',
    date: new Date().toISOString().split('T')[0],
    type: 'income'
  },
  {
    id: '2',
    amount: 50,
    category: 'Food',
    description: 'Grocery shopping',
    date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    type: 'expense'
  },
  {
    id: '3',
    amount: 20,
    category: 'Transport',
    description: 'Bus fare',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    type: 'expense'
  }
];

let goals = [
  {
    id: '1',
    title: 'Emergency Fund',
    targetAmount: 1000,
    currentAmount: 250,
    deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    category: 'Savings'
  },
  {
    id: '2',
    title: 'Vacation',
    targetAmount: 2000,
    currentAmount: 300,
    deadline: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    category: 'Travel'
  }
];

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

// Mock transaction service
export const mockTransactionService = {
  async getAll() {
    await delay(300);
    return {
      success: true,
      data: transactions
    };
  },
  
  async getById(id) {
    await delay(200);
    const transaction = transactions.find(t => t.id === id);
    if (!transaction) {
      throw new Error('Transaction not found');
    }
    return {
      success: true,
      data: transaction
    };
  },
  
  async add(transaction) {
    await delay(400);
    const newTransaction = {
      id: Date.now().toString(),
      ...transaction,
      date: transaction.date || new Date().toISOString().split('T')[0]
    };
    transactions.push(newTransaction);
    return {
      success: true,
      data: newTransaction
    };
  },
  
  async update(id, updatedTransaction) {
    await delay(400);
    const index = transactions.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error('Transaction not found');
    }
    transactions[index] = { ...transactions[index], ...updatedTransaction };
    return {
      success: true,
      data: transactions[index]
    };
  },
  
  async delete(id) {
    await delay(300);
    const index = transactions.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error('Transaction not found');
    }
    transactions.splice(index, 1);
    return {
      success: true,
      message: 'Transaction deleted successfully'
    };
  }
};

// Mock goal service
export const mockGoalService = {
  async getAll() {
    await delay(300);
    return {
      success: true,
      data: goals
    };
  },
  
  async getById(id) {
    await delay(200);
    const goal = goals.find(g => g.id === id);
    if (!goal) {
      throw new Error('Goal not found');
    }
    return {
      success: true,
      data: goal
    };
  },
  
  async add(goal) {
    await delay(400);
    const newGoal = {
      id: Date.now().toString(),
      ...goal,
      currentAmount: goal.currentAmount || 0
    };
    goals.push(newGoal);
    return {
      success: true,
      data: newGoal
    };
  },
  
  async update(id, updatedGoal) {
    await delay(400);
    const index = goals.findIndex(g => g.id === id);
    if (index === -1) {
      throw new Error('Goal not found');
    }
    goals[index] = { ...goals[index], ...updatedGoal };
    return {
      success: true,
      data: goals[index]
    };
  },
  
  async delete(id) {
    await delay(300);
    const index = goals.findIndex(g => g.id === id);
    if (index === -1) {
      throw new Error('Goal not found');
    }
    goals.splice(index, 1);
    return {
      success: true,
      message: 'Goal deleted successfully'
    };
  },
  
  async contribute(id, amount) {
    await delay(300);
    const index = goals.findIndex(g => g.id === id);
    if (index === -1) {
      throw new Error('Goal not found');
    }
    goals[index].currentAmount += amount;
    return {
      success: true,
      data: goals[index]
    };
  }
};

// Mock budget service
export const mockBudgetService = {
  async getAll() {
    await delay(300);
    return {
      success: true,
      data: []
    };
  },
  
  async add(budget) {
    await delay(400);
    return {
      success: true,
      data: { id: Date.now().toString(), ...budget }
    };
  }
};
