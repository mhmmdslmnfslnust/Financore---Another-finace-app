import React, { useState, useEffect } from 'react';
import { transactionService, goalService, budgetService } from '../../services/apiService';
import './Recommendations.css';

const Recommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch real user data to generate recommendations
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch all necessary data
        const [transResponse, goalResponse, budgetResponse] = await Promise.all([
          transactionService.getAll(),
          goalService.getAll(),
          budgetService.getAll()
        ]);
        
        const transactions = transResponse.data.data || [];
        const goals = goalResponse.data.data || [];
        const budgets = budgetResponse.data.data || [];
        
        // Generate personalized recommendations
        const generatedRecs = generateRecommendations(transactions, goals, budgets);
        setRecommendations(generatedRecs);
        
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching data for recommendations:', err);
        setError('Failed to generate recommendations. Please try again.');
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Generate personalized recommendations based on user data
  const generateRecommendations = (transactions, goals, budgets) => {
    const recommendations = [];
    
    // Calculate basic financial metrics
    const incomeTransactions = transactions.filter(t => t.type === 'income');
    const expenseTransactions = transactions.filter(t => t.type === 'expense');
    
    const totalIncome = incomeTransactions.reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
    const totalExpenses = expenseTransactions.reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
    
    // Recommendation 1: Check savings rate
    if (totalIncome > 0) {
      const savingsRate = (totalIncome - totalExpenses) / totalIncome;
      
      if (savingsRate < 0.2) {
        recommendations.push({
          type: 'warning',
          title: 'Increase Your Savings Rate',
          description: `Your current savings rate is ${(savingsRate * 100).toFixed(1)}%. Financial experts recommend saving at least 20% of your income.`,
          priority: 'high'
        });
      } else if (savingsRate >= 0.2) {
        recommendations.push({
          type: 'success',
          title: 'Good Savings Rate',
          description: `Your savings rate of ${(savingsRate * 100).toFixed(1)}% meets or exceeds the recommended 20%. Keep up the good work!`,
          priority: 'low'
        });
      }
    }
    
    // Recommendation 2: Check spending categories
    if (expenseTransactions.length > 0) {
      // Group by category
      const expensesByCategory = {};
      expenseTransactions.forEach(t => {
        const category = t.category || 'Other';
        if (!expensesByCategory[category]) {
          expensesByCategory[category] = 0;
        }
        expensesByCategory[category] += parseFloat(t.amount || 0);
      });
      
      // Find highest spending category
      let highestCategory = '';
      let highestAmount = 0;
      
      Object.entries(expensesByCategory).forEach(([category, amount]) => {
        if (amount > highestAmount) {
          highestCategory = category;
          highestAmount = amount;
        }
      });
      
      if (totalExpenses > 0 && (highestAmount / totalExpenses > 0.3)) {
        recommendations.push({
          type: 'info',
          title: 'High Category Spending',
          description: `${(highestAmount / totalExpenses * 100).toFixed(1)}% of your expenses are for ${highestCategory}. Consider setting a budget for this category.`,
          priority: 'medium'
        });
      }
    }
    
    // Recommendation 3: Goal setting
    if (goals.length === 0) {
      recommendations.push({
        type: 'info',
        title: 'Set Financial Goals',
        description: 'Setting clear financial goals helps you stay focused and track your progress. Add your first goal to get started.',
        priority: 'medium'
      });
    } else {
      // Check progress on goals
      const unprogressedGoals = goals.filter(g => 
        g.currentAmount === 0 || g.currentAmount / g.targetAmount < 0.1
      );
      
      if (unprogressedGoals.length > 0) {
        recommendations.push({
          type: 'warning',
          title: 'Make Progress on Your Goals',
          description: `You have ${unprogressedGoals.length} goal(s) with little or no progress. Try to contribute regularly.`,
          priority: 'medium'
        });
      }
    }
    
    // Recommendation 4: Budget creation
    if (budgets.length === 0) {
      recommendations.push({
        type: 'info',
        title: 'Create a Budget',
        description: 'A budget helps you manage your spending and achieve your financial goals. Create your first budget now.',
        priority: 'high'
      });
    }
    
    return recommendations;
  };
  
  if (isLoading) {
    return <div className="loading">Generating personalized recommendations...</div>;
  }
  
  if (error) {
    return <div className="error">{error}</div>;
  }
  
  return (
    <div className="recommendations-page">
      <h1>AI-Powered Financial Recommendations</h1>
      
      {recommendations.length === 0 ? (
        <p className="no-data">
          No recommendations available at this time. Add more transactions and goals to get personalized recommendations.
        </p>
      ) : (
        <div className="recommendations-list">
          {recommendations.map((rec, index) => (
            <div key={index} className={`recommendation-card ${rec.type}`}>
              <h2>{rec.title}</h2>
              <p>{rec.description}</p>
              {rec.priority === 'high' && <span className="priority high">High Priority</span>}
              {rec.priority === 'medium' && <span className="priority medium">Medium Priority</span>}
              {rec.priority === 'low' && <span className="priority low">Low Priority</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Recommendations;
