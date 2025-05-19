# FinanCore: Personal Finance Management System
## Lab Project Report

## Table of Contents
1. [Introduction](#introduction)
2. [System Design](#system-design)
   - [Architecture Overview](#architecture-overview)
   - [Class Diagram](#class-diagram)
   - [SOLID Principles Application](#solid-principles-application)
   - [Design Patterns Summary](#design-patterns-summary)
3. [Code Implementation](#code-implementation)
   - [Core Features](#core-features)
   - [Design Pattern Implementation](#design-pattern-implementation)
4. [Demo](#demo)
   - [Transaction Categorization](#transaction-categorization)
   - [Goal Tracking](#goal-tracking)
   - [Financial Reports](#financial-reports)
   - [AI Recommendations](#ai-recommendations)
5. [Bonus Implementation](#bonus-implementation)
   - [State Pattern for Financial Modes](#state-pattern-for-financial-modes)
6. [Evaluation](#evaluation)
   - [SOLID Principles & Design Patterns](#solid-principles--design-patterns)
   - [Modularity & Extensibility](#modularity--extensibility)
   - [Functionality](#functionality)
   - [UI/UX Design](#uiux-design)
7. [Conclusion](#conclusion)

## Introduction

FinanCore is a comprehensive personal finance management system designed to help users track their income, expenses, investments, and savings goals. The system provides features for transaction categorization, goal tracking, financial reporting, and AI-powered recommendations to assist users in making better financial decisions.

This report details the architecture, design principles, implementation, and functionality of the FinanCore system.

## System Design

### Architecture Overview

The FinanCore application follows a component-based architecture built with React, organized into several modules with distinct responsibilities:

1. **User Management**: Handles user profiles and authentication
2. **Transaction Management**: Tracks and categorizes financial transactions
3. **Account Management**: Manages different financial accounts
4. **Goal Tracking**: Helps users set and monitor financial goals
5. **Budget Management**: Implements different budgeting strategies
6. **Recommendation Engine**: Provides AI-powered financial advice
7. **Reporting System**: Generates financial reports and visualizations

### Class Diagram

The following class diagram illustrates the key components of the system and their relationships:

+------------------+ +------------------+ +------------------+ | App |---->| Navbar | | Sidebar | +------------------+ +------------------+ +------------------+ | | +-----------------+ +--------------->| Dashboard | | +-----------------+ | | | v | +-----------------+ +------------------+ | | ModeSelector |---->| FinancialState | | +-----------------+ +------------------+ | | | | | +------------------+ +------------------+ +------------------+ | | BudgetingState | | SavingsState | | InvestmentState | | +------------------+ +------------------+ +------------------+ | | +-----------------+ +------------------+ +------------------+ +--------------->| Transactions |---->| TransactionList |---->| TransactionForm | | +-----------------+ +------------------+ +------------------+ | | | v | +-----------------+ | | TransactionSvc | | +-----------------+ | | +-----------------+ +------------------+ +------------------+ +--------------->| Goals |---->| GoalList |---->| GoalForm | | +-----------------+ +------------------+ +------------------+ | | | v | +-----------------+ | | GoalService | | +-----------------+ | | +-----------------+
+--------------->| Recommendations | | +-----------------+ | | | v | +-----------------+ +------------------+ +------------------+ | | RecommendSvc |---->| BudgetStrategy |<----| ZeroBasedBudget | | +-----------------+ +------------------+ +------------------+ | ^ | | | +------------------+ | | 50/30/20 Rule | | +------------------+ | | +-----------------+ +--------------->| Reports | | +-----------------+ | v +------------------+ +------------------+ +------------------+ | DatabaseService |<----| FinancialComp |<----| Account | | (Singleton) | | (Composite) | +------------------+ +------------------+ +------------------+ ^ ^ | | +------------------+ +----------------| AccountGroup | +------------------+


### SOLID Principles Application

The FinanCore system was designed with SOLID principles at its core:

#### Single Responsibility Principle (SRP)
Each class and component in our system has a single, well-defined responsibility:
- `TransactionService`: Handles only transaction-related operations
- `GoalService`: Manages financial goals exclusively
- `RecommendationService`: Focuses solely on generating recommendations
- React components are separated by feature (Dashboard, Transactions, Goals, etc.)

This separation ensures that classes are focused, maintainable, and changes to one feature don't affect others.

#### Open/Closed Principle (OCP)
The system is designed to be extended without modifying existing code:
- New transaction categories can be added by extending the categories array
- Additional budgeting strategies can be implemented by extending the `BudgetStrategy` class
- New recommendation algorithms can be added through implementation of the recommendation interfaces
- The financial state system can accommodate new states without changing existing code

#### Liskov Substitution Principle (LSP)
Subtypes can be substituted for their base types throughout the system:
- Any concrete `BudgetStrategy` (ZeroBasedBudgetStrategy, FiftyThirtyTwentyStrategy) can be used where the base class is expected
- `FinancialState` subtypes (BudgetingState, SavingsState, InvestmentState) are interchangeable where the base type is used
- Account hierarchy follows LSP, with all account types implementable where the base Account is expected

#### Interface Segregation Principle (ISP)
Interfaces are client-specific rather than general-purpose:
- Recommendation interfaces are separated by recommendation type (spending, savings, investment)
- Financial component interfaces have specific methods related only to their functionality
- UI components receive only the props they need rather than large, all-encompassing data objects

#### Dependency Inversion Principle (DIP)
High-level modules don't depend on low-level modules; both depend on abstractions:
- Components depend on service abstractions rather than concrete implementations
- The recommendation engine relies on abstract strategy interfaces
- Database access is abstracted through the DatabaseService interface

### Design Patterns Summary

The system implements several design patterns to address specific architectural challenges:

#### 1. Singleton Pattern
**Application:** Database connection management
- Ensures a single instance of the `DatabaseService` throughout the application
- Provides global access to the database while preventing multiple instances
- Centralizes data access and persistence

```javascript
class DatabaseService {
  constructor() {
    if (DatabaseService.instance) {
      return DatabaseService.instance;
    }
    
    this.data = {...};
    DatabaseService.instance = this;
  }
}

export default new DatabaseService();
```
#### 2. Strategy Pattern
Application: Handling different budgeting approaches

`BudgetStrategy` interface defines the contract for all budgeting strategies
Concrete implementations include:
`ZeroBasedBudgetStrategy`: Allocates every dollar to specific expenses
`FiftyThirtyTwentyStrategy`: Divides income into 50% needs, 30% wants, 20% savings
Allows runtime switching between different budgeting approaches

```javascript
export class BudgetStrategy {
  calculateBudget(income, expenses) {
    throw new Error("Method must be implemented");
  }
}

export class ZeroBasedBudgetStrategy extends BudgetStrategy {
  calculateBudget(income, expenses) {
    // Implementation for zero-based budgeting
  }
}
```
#### 3. Composite Pattern
Application: Managing financial account hierarchy

- `FinancialComponent` serves as the common interface
- `Account` is a leaf in the composite structure
- `AccountGroup` can contain individual accounts or nested account groups
- Allows treating individual objects and compositions uniformly

```javascript
export class FinancialComponent {
  getBalance() { /* Abstract method */ }
}

export class Account extends FinancialComponent {
  getBalance() { return this.balance; }
}

export class AccountGroup extends FinancialComponent {
  getBalance() {
    return this.accounts.reduce((sum, account) => 
      sum + account.getBalance(), 0);
  }
}
```

#### 4. State Pattern
**Application:** Managing different financial modes
- `FinancialState` defines the interface for all states
- Concrete states include:
 - `BudgetingState`: Focuses on expense tracking and budget adherence
 - `SavingsState`: Prioritizes savings and related recommendations
 - `InvestmentState`: Offers investment insights and reporting
- Allows the application to alter its behavior when the financial state changes

```javascript
export class FinancialState {
  getDashboardComponents() { /* Abstract method */ }
  getRecommendations() { /* Abstract method */ }
}

export class BudgetingState extends FinancialState {
  // Budgeting-specific implementations
}
```

## Code Implementation
### Core Features
The FinanCore system includes the following core features:

#### 1. Transaction Management
Add, edit, and delete financial transactions
Automatic categorization of transactions based on description
Filtering and searching transactions
Calculation of financial metrics (income, expenses, balance)
#### 2. Goal Tracking
Create and manage financial savings goals
Track progress towards goals with visual indicators
Make contributions to goals
Calculate required monthly contributions to reach goals by deadline
#### 3. AI-Powered Recommendations
Spending analysis and optimization suggestions
Savings recommendations based on income and goals
Investment allocation advice
Mode-specific recommendations based on current financial state
#### 4. Financial Reporting
Pie charts showing spending by category
Bar charts comparing income vs. expenses
Line charts tracking financial trends over time
Interactive reports with filtering options

### Design Pattern Implementation
Each design pattern was implemented to solve specific challenges in the system:

#### Singleton Pattern Implementation
The DatabaseService is implemented as a singleton to ensure data consistency throughout the application:

```javascript
// DatabaseService.js
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
      user: { id: '1', name: 'Demo User' }
    };
    
    this.initSampleData();
    DatabaseService.instance = this;
  }
  
  // CRUD operations for transactions, accounts, goals
  getTransactions() { return [...this.data.transactions]; }
  saveTransaction(transaction) { /* Implementation */ }
  // More methods...
}

export default new DatabaseService();
```     
#### Strategy Pattern Implementation
The Strategy pattern is used to implement different budgeting approaches:
```javascript
// BudgetStrategy.js
export class BudgetStrategy {
  constructor(name, description) {
    this.name = name;
    this.description = description;
  }

  calculateBudget(income, expenses) {
    throw new Error("Must be implemented by concrete strategies");
  }
}

export class ZeroBasedBudgetStrategy extends BudgetStrategy {
  constructor() {
    super("Zero-Based Budgeting", 
      "Allocate every dollar to specific expenses, savings, or investments");
  }

  calculateBudget(income, expenses) {
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const remaining = income - totalExpenses;
    // Calculate categories and recommendations
    return {
      income, totalExpenses, remaining,
      categories: this.categorizeExpenses(expenses),
      recommendations: this.generateRecommendations(income, totalExpenses)
    };
  }
}

export class FiftyThirtyTwentyStrategy extends BudgetStrategy {
  constructor() {
    super("50/30/20 Rule", 
      "Allocate 50% to needs, 30% to wants, and 20% to savings");
  }

  calculateBudget(income, expenses) {
    // Implementation specific to 50/30/20 rule
  }
}
```

#### Composite Pattern Implementation
The Composite pattern structures the account management system:
```javascript
// FinancialComponent.js
export class FinancialComponent {
  constructor(name) {
    this.name = name;
  }

  getBalance() {
    throw new Error("Method getBalance() must be implemented");
  }
}

export class Account extends FinancialComponent {
  constructor(id, name, type, balance = 0) {
    super(name);
    this.id = id;
    this.type = type;
    this.balance = balance;
    this.transactions = [];
  }

  getBalance() {
    return this.balance;
  }
  
  addTransaction(amount, description, date, category) {
    this.balance += amount;
    // Create and store transaction
  }
}

export class AccountGroup extends FinancialComponent {
  constructor(name) {
    super(name);
    this.accounts = [];
  }

  add(account) {
    this.accounts.push(account);
  }

  getBalance() {
    return this.accounts.reduce((total, account) => {
      return total + account.getBalance();
    }, 0);
  }
}
```

#### State Pattern Implementation (Bonus)
The State pattern manages different financial modes:
```javascript
// FinancialState.js
export class FinancialState {
  constructor(name, description) {
    this.name = name;
    this.description = description;
  }

  getName() { return this.name; }
  getDescription() { return this.description; }
  
  getDashboardComponents() {
    throw new Error("Method getDashboardComponents() must be implemented");
  }
  
  getRecommendations(user, transactions) {
    throw new Error("Method getRecommendations() must be implemented");
  }
}

export class BudgetingState extends FinancialState {
  constructor() {
    super("Budgeting Mode", 
      "Focus on tracking and managing your expenses to stay within your budget.");
  }

  getDashboardComponents() {
    return ["BudgetOverview", "ExpenseTracker", "CategorySpending", "SpendingTrends"];
  }

  getRecommendations(user, transactions) {
    // Budgeting-specific recommendations
  }
}

// Similar implementations for SavingsState and InvestmentState
```

## Demo

### Transaction Categorization

The system automatically categorizes transactions based on their descriptions:

1. **Transaction Input:**
   Users enter transaction details including description, amount, date, and type.

2. **Automatic Categorization:**
   The system analyzes the transaction description and assigns a category:

```javascript
// Example of automatic categorization
predictCategory(description, type) {
  description = description.toLowerCase();
  
  const categoryKeywords = {
    'salary': 'Salary',
    'paycheck': 'Salary',
    'rent': 'Housing',
    'mortgage': 'Housing',
    'grocery': 'Food',
    'restaurant': 'Dining',
    'uber': 'Transportation',
    'netflix': 'Entertainment',
    // More keywords...
  };
  
  for (const [keyword, category] of Object.entries(categoryKeywords)) {
    if (description.includes(keyword)) {
      return category;
    }
  }
  
  return type === 'income' ? 'Other Income' : 'Miscellaneous';
}
```

3. **Category Summary:**
   The system generates summaries by category for reporting and analysis.

### Goal Tracking

Users can create and monitor progress toward financial goals:

1. **Goal Creation:**
   Users define goals with a name, target amount, current amount, and optional deadline.

2. **Progress Tracking:**
   The system calculates and visualizes progress:
   - Percentage complete
   - Remaining amount
   - Visual progress bar
   - Time left until deadline

3. **Goal Contributions:**
   Users can make contributions to goals, updating the current amount and recalculating progress.

4. **Monthly Contribution Calculation:**
   For goals with deadlines, the system calculates required monthly contributions:

```javascript
calculateRequiredMonthlyContribution(id) {
  const goal = this.getGoalById(id);
  if (!goal || !goal.deadline) return null;

  const today = new Date();
  const deadline = new Date(goal.deadline);
  
  const monthsRemaining = (deadline.getFullYear() - today.getFullYear()) * 12 + 
                          (deadline.getMonth() - today.getMonth());
  
  if (monthsRemaining <= 0) return goal.targetAmount - goal.currentAmount;
  
  return (goal.targetAmount - goal.currentAmount) / monthsRemaining;
}
```

### Financial Reports

The system generates interactive visual reports to help users understand their finances:

1. **Spending by Category:**
   Pie chart showing expenses broken down by category.

2. **Income vs. Expenses:**
   Bar chart comparing total income and expenses.

3. **Monthly Trends:**
   Line chart tracking financial data over time, including:
   - Monthly income
   - Monthly expenses
   - Savings rate

### AI Recommendations

The system provides AI-driven recommendations based on financial behaviors:

1. **Spending Recommendations:**
   - Identifies categories with excessive spending
   - Suggests areas for potential reduction
   - Alerts when expenses approach or exceed income

```javascript
getSpendingRecommendations() {
  const transactions = this.transactionService.getAllTransactions();
  const categorySummary = this.transactionService.getCategorySummary();
  const totalExpenses = this.transactionService.getTotalExpenses();
  const totalIncome = this.transactionService.getTotalIncome();
  
  const recommendations = [];
  
  // Check if spending exceeds income
  if (totalExpenses > totalIncome) {
    recommendations.push({
      type: 'warning',
      message: `Your expenses ($${totalExpenses.toFixed(2)}) exceed your income ($${totalIncome.toFixed(2)}). Consider reducing expenses.`
    });
  }
  
  // Identify high spending categories
  const expenseCategories = Object.entries(categorySummary)
    .filter(([_, data]) => data.type === 'expense')
    .sort((a, b) => b[1].total - a[1].total);
  
  if (expenseCategories.length > 0) {
    const [topCategory, topData] = expenseCategories[0];
    const percentageOfTotal = (topData.total / totalExpenses) * 100;
    
    if (percentageOfTotal > 30) {
      recommendations.push({
        type: 'info',
        message: `Your highest spending category is ${topCategory} at $${topData.total.toFixed(2)} (${percentageOfTotal.toFixed(1)}% of total). Consider setting a budget for this category.`
      });
    }
  }
  
  return recommendations;
}
```

2. **Savings Recommendations:**
   - Suggests optimal savings amounts based on income
   - Recommends monthly contributions to meet goals
   - Provides emergency fund guidance

3. **Investment Recommendations:**
   - Offers basic investment allocation advice
   - Suggests tax-advantaged investment accounts
   - Recommends portfolio diversification strategies

## Bonus Implementation

### State Pattern for Financial Modes

The State pattern allows the application to alter its behavior when the user's financial state changes:

1. **Financial States:**
   Three financial states are implemented:
   - **Budgeting State**: Focuses on expense tracking and budget management
   - **Savings State**: Emphasizes savings goals and contribution strategies
   - **Investment State**: Provides investment insights and portfolio management

2. **State Transitions:**
   Users can switch between states via the ModeSelector component:

```javascript
<ModeSelector 
  currentState={financialState} 
  onStateChange={(newState) => {
    DatabaseService.setFinancialState(newState);
    setFinancialState(newState);
  }} 
/>
```

3. **State-Specific Behavior:**
   Each state provides different dashboard components and recommendations:

```javascript
// BudgetingState
getDashboardComponents() {
  return [
    "BudgetOverview",
    "ExpenseTracker",
    "CategorySpending",
    "SpendingTrends"
  ];
}

// SavingsState
getDashboardComponents() {
  return [
    "SavingsGoals",
    "SavingsProgress",
    "SavingsTips",
    "MonthlyContributions"
  ];
}

// InvestmentState
getDashboardComponents() {
  return [
    "PortfolioOverview",
    "AssetAllocation",
    "InvestmentPerformance",
    "InvestmentOpportunities"
  ];
}
```

4. **State-Specific Recommendations:**
   Each state generates different types of financial advice:

```javascript
// BudgetingState recommendations
getRecommendations(user, transactions) {
  // Budget-focused recommendations
  return [
    "Your expenses are over 90% of your income. Consider reducing spending.",
    "Try using the 50/30/20 budget rule for better financial balance."
  ];
}

// SavingsState recommendations
getRecommendations(user, transactions) {
  // Savings-focused recommendations
  return [
    "Consider automating your savings by setting up automatic transfers on payday.",
    "Build an emergency fund covering 3-6 months of expenses before focusing on other goals."
  ];
}
```

## Evaluation

### SOLID Principles & Design Patterns

The system successfully applies all SOLID principles:
- **SRP**: Classes and components have single, well-defined responsibilities
- **OCP**: Extension points exist for adding new features without modifying existing code
- **LSP**: Inheritance hierarchies respect substitutability
- **ISP**: Interfaces are client-specific and focused
- **DIP**: High-level modules depend on abstractions, not concrete implementations

Design patterns are effectively applied to solve specific challenges:
- **Singleton Pattern**: Maintains a single global database instance
- **Strategy Pattern**: Provides flexibility in budgeting approaches
- **Composite Pattern**: Simplifies account management hierarchy
- **State Pattern**: Manages different financial modes and behaviors

### Modularity & Extensibility

The system demonstrates high modularity:
- Clear separation of concerns between components
- Service layer abstracts business logic from UI components
- Self-contained modules that can be extended independently

Extensibility is achieved through:
- Abstract classes and interfaces for extension points
- Design patterns that allow for new variations
- Component-based architecture for reuse and composition

### Functionality

The core features work as expected:
- **Transaction Categorization**: Automatically categorizes transactions based on description
- **Goal Tracking**: Allows creating, monitoring, and contributing to financial goals
- **Financial Reports**: Generates visual representations of financial data
- **AI Recommendations**: Provides relevant financial advice based on user behavior

### UI/UX Design

The user interface effectively presents financial data:
- Clean, organized dashboard with key financial metrics
- Visual progress indicators for goals
- Interactive charts for financial analysis
- Color-coded recommendations based on importance and type
- Intuitive navigation and data filtering

## Conclusion

The FinanCore Personal Finance Management System successfully implements a comprehensive solution for financial management, providing users with tools to track transactions, set goals, analyze finances, and receive personalized recommendations.

Through the application of SOLID principles and design patterns, the system achieves high modularity, extensibility, and maintainability. The implementation of the State pattern as a bonus feature enhances the system's ability to adapt to different financial focuses.

The system demonstrates how proper software design and architecture can create a flexible foundation for building complex applications that can evolve with changing requirements and user needs.
