import TransactionService from './TransactionService';
import GoalService from './GoalService';

export default class RecommendationService {
  constructor() {
    this.transactionService = new TransactionService();
    this.goalService = new GoalService();
  }

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
    
    // Check for frequent small transactions that add up
    const smallTransactions = transactions.filter(t => 
      t.type === 'expense' && t.amount < 20 && t.amount > 0
    );
    
    if (smallTransactions.length > 5) {
      const totalSmall = smallTransactions.reduce((sum, t) => sum + t.amount, 0);
      recommendations.push({
        type: 'tip',
        message: `You have ${smallTransactions.length} small transactions totaling $${totalSmall.toFixed(2)}. Small purchases can add up quickly.`
      });
    }
    
    return recommendations;
  }

  getSavingsRecommendations() {
    const totalIncome = this.transactionService.getTotalIncome();
    const goals = this.goalService.getAllGoals();
    
    const recommendations = [];
    
    // Check if user has any savings goals
    if (goals.length === 0) {
      recommendations.push({
        type: 'suggestion',
        message: 'Consider setting up savings goals for emergencies, big purchases, or retirement.'
      });
    } else {
      // For each goal, calculate and recommend monthly contributions
      goals.forEach(goal => {
        if (goal.currentAmount < goal.targetAmount) {
          const remaining = goal.targetAmount - goal.currentAmount;
          let message = `For your "${goal.name}" goal, you still need $${remaining.toFixed(2)}.`;
          
          if (goal.deadline) {
            const monthlyContribution = this.goalService.calculateRequiredMonthlyContribution(goal.id);
            if (monthlyContribution) {
              message += ` Consider saving $${monthlyContribution.toFixed(2)} monthly to reach this goal on time.`;
            }
          }
          
          recommendations.push({
            type: 'goal',
            message
          });
        }
      });
    }
    
    // Recommend saving a percentage of income if income is substantial
    if (totalIncome > 1000) {
      const recommendedSavings = totalIncome * 0.2;
      recommendations.push({
        type: 'tip',
        message: `Based on your income, try to save at least $${recommendedSavings.toFixed(2)} (20%) each month.`
      });
    }
    
    return recommendations;
  }

  getInvestmentRecommendations() {
    const totalIncome = this.transactionService.getTotalIncome();
    const netIncome = this.transactionService.getNetIncome();
    
    const recommendations = [];
    
    // Basic investment recommendations
    if (netIncome > 0) {
      recommendations.push({
        type: 'suggestion',
        message: `You have a positive net income of $${netIncome.toFixed(2)}. Consider investing some of this surplus.`
      });
      
      if (netIncome > totalIncome * 0.2) {
        recommendations.push({
          type: 'tip',
          message: 'With your high savings rate, you could benefit from tax-advantaged investment accounts like a 401(k) or IRA.'
        });
      }
    }
    
    // Generic investment advice
    recommendations.push({
      type: 'education',
      message: 'Remember the importance of diversification. Consider a mix of stocks, bonds, and other assets based on your risk tolerance.'
    });
    
    return recommendations;
  }

  getAllRecommendations() {
    return {
      spending: this.getSpendingRecommendations(),
      savings: this.getSavingsRecommendations(),
      investment: this.getInvestmentRecommendations()
    };
  }
}
