/**
 * State pattern for managing financial states
 */
export class FinancialState {
  constructor(name, description) {
    this.name = name;
    this.description = description;
  }

  getName() {
    return this.name;
  }

  getDescription() {
    return this.description;
  }

  getDashboardComponents() {
    throw new Error("Method getDashboardComponents() must be implemented");
  }

  getRecommendations(user, transactions) {
    throw new Error("Method getRecommendations() must be implemented");
  }
}

export class BudgetingState extends FinancialState {
  constructor() {
    super(
      "Budgeting Mode", 
      "Focus on tracking and managing your expenses to stay within your budget."
    );
  }

  getDashboardComponents() {
    return [
      "BudgetOverview",
      "ExpenseTracker",
      "CategorySpending",
      "SpendingTrends"
    ];
  }

  getRecommendations(user, transactions) {
    // Simple recommendations based on transaction data
    const recommendations = [];
    
    // Extract income and expenses
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    // Group expenses by category
    const expensesByCategory = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        if (!acc[t.category]) {
          acc[t.category] = 0;
        }
        acc[t.category] += t.amount;
        return acc;
      }, {});
    
    // Calculate percentages
    const expensePercentages = {};
    Object.keys(expensesByCategory).forEach(category => {
      expensePercentages[category] = (expensesByCategory[category] / expenses) * 100;
    });
    
    // Generate recommendations
    if (expenses > income * 0.9) {
      recommendations.push("Your expenses are over 90% of your income. Consider reducing spending.");
    }
    
    // Find high spending categories
    const highSpendingCategories = Object.entries(expensePercentages)
      .filter(([_, percentage]) => percentage > 30)
      .map(([category]) => category);
    
    if (highSpendingCategories.length > 0) {
      recommendations.push(`You're spending a large portion of your budget on ${highSpendingCategories.join(', ')}. Consider setting limits for these categories.`);
    }
    
    // Always provide at least one recommendation
    if (recommendations.length === 0) {
      recommendations.push("Try using the 50/30/20 budget rule: 50% for needs, 30% for wants, and 20% for savings.");
    }
    
    return recommendations;
  }
}

export class SavingsState extends FinancialState {
  constructor() {
    super(
      "Savings Mode", 
      "Prioritize saving money and tracking progress toward your savings goals."
    );
  }

  getDashboardComponents() {
    return [
      "SavingsGoals",
      "SavingsProgress",
      "SavingsTips",
      "MonthlyContributions"
    ];
  }

  getRecommendations(user, transactions) {
    const recommendations = [];
    
    // Extract income
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    // Extract savings
    const savings = transactions
      .filter(t => t.category === 'Savings' || t.description.toLowerCase().includes('saving'))
      .reduce((sum, t) => sum + t.amount, 0);
    
    const savingsRate = savings / income;
    
    // Generate recommendations
    if (savingsRate < 0.1) {
      recommendations.push("You're saving less than 10% of your income. Try to increase your savings rate.");
    }
    
    recommendations.push("Consider automating your savings by setting up automatic transfers on payday.");
    recommendations.push("Build an emergency fund covering 3-6 months of expenses before focusing on other savings goals.");
    
    return recommendations;
  }
}

export class InvestmentState extends FinancialState {
  constructor() {
    super(
      "Investment Mode", 
      "Focus on managing and optimizing your investment portfolio."
    );
  }

  getDashboardComponents() {
    return [
      "PortfolioOverview",
      "AssetAllocation",
      "InvestmentPerformance",
      "InvestmentOpportunities"
    ];
  }

  getRecommendations(user, transactions) {
    const recommendations = [];
    
    // These would normally be based on real data analysis
    recommendations.push("Consider diversifying your investment portfolio to reduce risk.");
    recommendations.push("Regular contributions to your investments, even small ones, can lead to significant growth over time.");
    recommendations.push("Review your asset allocation quarterly and rebalance if necessary.");
    
    return recommendations;
  }
}
