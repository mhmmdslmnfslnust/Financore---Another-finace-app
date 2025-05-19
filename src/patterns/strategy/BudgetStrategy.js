/**
 * Strategy pattern - interface for different budgeting strategies
 */
export class BudgetStrategy {
  constructor(name, description) {
    this.name = name;
    this.description = description;
  }

  calculateBudget(income, expenses) {
    throw new Error("calculateBudget method must be implemented by concrete strategies");
  }

  getName() {
    return this.name;
  }

  getDescription() {
    return this.description;
  }
}

export class ZeroBasedBudgetStrategy extends BudgetStrategy {
  constructor() {
    super(
      "Zero-Based Budgeting", 
      "Allocate every dollar of your income to specific expenses, savings, or investments to reach a zero balance."
    );
  }

  calculateBudget(income, expenses) {
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const remaining = income - totalExpenses;
    
    const categories = this.categorizeExpenses(expenses);
    
    return {
      income,
      totalExpenses,
      remaining,
      categories,
      recommendations: this.generateRecommendations(income, totalExpenses, categories)
    };
  }

  categorizeExpenses(expenses) {
    const categories = {};
    
    expenses.forEach(expense => {
      if (!categories[expense.category]) {
        categories[expense.category] = 0;
      }
      categories[expense.category] += expense.amount;
    });
    
    return categories;
  }

  generateRecommendations(income, totalExpenses, categories) {
    const recommendations = [];
    
    if (totalExpenses > income) {
      recommendations.push("Your expenses exceed your income. Look for categories to reduce spending.");
      
      // Find the top 2 spending categories
      const sortedCategories = Object.entries(categories)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 2);
      
      sortedCategories.forEach(([category, amount]) => {
        recommendations.push(`Consider reducing spending in ${category} (currently $${amount.toFixed(2)}).`);
      });
    } else if (income - totalExpenses > 0.2 * income) {
      recommendations.push(`You have ${((income - totalExpenses) / income * 100).toFixed(1)}% of your income unallocated. Consider increasing savings or investments.`);
    }
    
    return recommendations;
  }
}

export class FiftyThirtyTwentyStrategy extends BudgetStrategy {
  constructor() {
    super(
      "50/30/20 Rule", 
      "Allocate 50% of your income to needs, 30% to wants, and 20% to savings and debt repayment."
    );
    
    this.NEEDS_CATEGORIES = ["Housing", "Utilities", "Groceries", "Transportation", "Insurance", "Healthcare"];
    this.SAVINGS_CATEGORIES = ["Savings", "Investments", "Debt Repayment"];
    // Everything else is considered "wants"
  }

  calculateBudget(income, expenses) {
    const idealNeeds = income * 0.5;
    const idealWants = income * 0.3;
    const idealSavings = income * 0.2;
    
    const categorizedExpenses = this.categorizeExpenses(expenses);
    const actualNeeds = categorizedExpenses.needs;
    const actualWants = categorizedExpenses.wants;
    const actualSavings = categorizedExpenses.savings;
    
    return {
      income,
      categories: {
        needs: {
          actual: actualNeeds,
          ideal: idealNeeds,
          difference: idealNeeds - actualNeeds
        },
        wants: {
          actual: actualWants,
          ideal: idealWants,
          difference: idealWants - actualWants
        },
        savings: {
          actual: actualSavings,
          ideal: idealSavings,
          difference: idealSavings - actualSavings
        }
      },
      recommendations: this.generateRecommendations(idealNeeds, idealWants, idealSavings, actualNeeds, actualWants, actualSavings)
    };
  }

  categorizeExpenses(expenses) {
    let needs = 0;
    let wants = 0;
    let savings = 0;
    
    expenses.forEach(expense => {
      if (this.NEEDS_CATEGORIES.includes(expense.category)) {
        needs += expense.amount;
      } else if (this.SAVINGS_CATEGORIES.includes(expense.category)) {
        savings += expense.amount;
      } else {
        wants += expense.amount;
      }
    });
    
    return { needs, wants, savings };
  }

  generateRecommendations(idealNeeds, idealWants, idealSavings, actualNeeds, actualWants, actualSavings) {
    const recommendations = [];
    
    if (actualNeeds > idealNeeds) {
      recommendations.push(`You're spending ${((actualNeeds - idealNeeds) / idealNeeds * 100).toFixed(1)}% too much on needs. Look for ways to reduce essential expenses.`);
    }
    
    if (actualWants > idealWants) {
      recommendations.push(`You're spending ${((actualWants - idealWants) / idealWants * 100).toFixed(1)}% too much on wants. Consider cutting back on non-essential purchases.`);
    }
    
    if (actualSavings < idealSavings) {
      recommendations.push(`You're saving ${((idealSavings - actualSavings) / idealSavings * 100).toFixed(1)}% less than recommended. Try to increase your savings rate.`);
    }
    
    return recommendations;
  }
}
