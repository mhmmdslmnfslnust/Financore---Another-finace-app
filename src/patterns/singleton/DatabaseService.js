/**
 * Singleton pattern for database connection management
 */
class DatabaseService {
  constructor() {
    if (DatabaseService.instance) {
      return DatabaseService.instance;
    }
    
    this.data = {
      transactions: [],
      accounts: [],
      goals: [],
      budgetStrategy: null,
      currentState: null,
      user: {
        id: '1',
        name: 'Demo User',
        email: 'demo@example.com'
      }
    };
    
    // Initialize with some sample data
    this.initSampleData();
    
    // Store the instance
    DatabaseService.instance = this;
  }

  initSampleData() {
    // Sample transactions
    this.data.transactions = [
      { id: '1', date: '2023-06-01', description: 'Salary', amount: 3000, type: 'income', category: 'Salary' },
      { id: '2', date: '2023-06-02', description: 'Rent', amount: 1000, type: 'expense', category: 'Housing' },
      { id: '3', date: '2023-06-03', description: 'Groceries', amount: 200, type: 'expense', category: 'Food' },
      { id: '4', date: '2023-06-05', description: 'Restaurant', amount: 75, type: 'expense', category: 'Dining' },
      { id: '5', date: '2023-06-07', description: 'Movie', amount: 20, type: 'expense', category: 'Entertainment' },
      { id: '6', date: '2023-06-10', description: 'Freelance', amount: 500, type: 'income', category: 'Side Hustle' },
      { id: '7', date: '2023-06-15', description: 'Utilities', amount: 150, type: 'expense', category: 'Utilities' }
    ];

    // Sample accounts
    this.data.accounts = [
      { id: '1', name: 'Checking Account', type: 'checking', balance: 2500 },
      { id: '2', name: 'Savings Account', type: 'savings', balance: 5000 },
      { id: '3', name: 'Investment Portfolio', type: 'investment', balance: 10000 }
    ];

    // Sample goals
    this.data.goals = [
      { id: '1', name: 'Emergency Fund', targetAmount: 10000, currentAmount: 5000, deadline: '2023-12-31' },
      { id: '2', name: 'Vacation', targetAmount: 3000, currentAmount: 1000, deadline: '2023-08-31' }
    ];
  }

  // CRUD operations for transactions
  saveTransaction(transaction) {
    const existingIndex = this.data.transactions.findIndex(t => t.id === transaction.id);
    
    if (existingIndex >= 0) {
      this.data.transactions[existingIndex] = transaction;
    } else {
      this.data.transactions.push(transaction);
    }
    
    return transaction;
  }

  getTransactions() {
    return [...this.data.transactions];
  }

  deleteTransaction(id) {
    this.data.transactions = this.data.transactions.filter(t => t.id !== id);
  }

  // CRUD operations for accounts
  saveAccount(account) {
    const existingIndex = this.data.accounts.findIndex(a => a.id === account.id);
    
    if (existingIndex >= 0) {
      this.data.accounts[existingIndex] = account;
    } else {
      this.data.accounts.push(account);
    }
    
    return account;
  }

  getAccounts() {
    return [...this.data.accounts];
  }

  deleteAccount(id) {
    this.data.accounts = this.data.accounts.filter(a => a.id !== id);
  }

  // CRUD operations for goals
  saveGoal(goal) {
    const existingIndex = this.data.goals.findIndex(g => g.id === goal.id);
    
    if (existingIndex >= 0) {
      this.data.goals[existingIndex] = goal;
    } else {
      this.data.goals.push(goal);
    }
    
    return goal;
  }

  getGoals() {
    return [...this.data.goals];
  }

  deleteGoal(id) {
    this.data.goals = this.data.goals.filter(g => g.id !== id);
  }

  // Budget strategy management
  setBudgetStrategy(strategy) {
    this.data.budgetStrategy = strategy;
  }

  getBudgetStrategy() {
    return this.data.budgetStrategy;
  }

  // Financial state management
  setFinancialState(state) {
    this.data.currentState = state;
  }

  getFinancialState() {
    return this.data.currentState;
  }

  // User data
  getUser() {
    return { ...this.data.user };
  }
}

export default new DatabaseService();
