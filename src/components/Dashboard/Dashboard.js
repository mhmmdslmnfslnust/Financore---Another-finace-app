import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { transactionService, goalService } from '../../services/apiService';
import FinancialSummary from './FinancialSummary';
import RecentTransactions from './RecentTransactions';
import GoalsOverview from './GoalsOverview';
import './Dashboard.css';
import './TopRecommendations.css'; // Add this import to include the recommendation styles

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [goals, setGoals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recommendations, setRecommendations] = useState({ spending: [], savings: [] });
  const navigate = useNavigate();

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
    
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [transResponse, goalResponse] = await Promise.all([
          transactionService.getAll(),
          goalService.getAll()
        ]);

        const transData = transResponse.data.data || [];
        const goalData = goalResponse.data.data || [];
        
        setTransactions(transData);
        setGoals(goalData);
        
        generateRecommendations(transData, goalData);
        
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const generateRecommendations = (transactions, goals) => {
    const recommendationsList = {
      spending: [],
      savings: []
    };

    if (transactions.length > 0) {
      const expensesByCategory = {};
      const expenseTransactions = transactions.filter(t => t.type === 'expense');
      
      expenseTransactions.forEach(t => {
        if (!expensesByCategory[t.category]) {
          expensesByCategory[t.category] = 0;
        }
        expensesByCategory[t.category] += parseFloat(t.amount || 0);
      });

      let highestCategory = '';
      let highestAmount = 0;

      for (const category in expensesByCategory) {
        if (expensesByCategory[category] > highestAmount) {
          highestAmount = expensesByCategory[category];
          highestCategory = category;
        }
      }

      const totalExpensesAmount = expenseTransactions.reduce(
        (sum, t) => sum + parseFloat(t.amount || 0), 0
      );

      const percentage = totalExpensesAmount > 0
        ? ((highestAmount / totalExpensesAmount) * 100).toFixed(1)
        : 0;

      if (percentage > 30) {
        recommendationsList.spending.push({
          type: 'info',
          message: `Your highest spending category is ${highestCategory} at $${highestAmount.toFixed(2)} (${percentage}% of total). Consider setting a budget for this category.`
        });
      }
    }

    if (goals.length === 0) {
      recommendationsList.savings.push({
        type: 'suggestion',
        message: 'You haven\'t set any financial goals yet. Setting clear goals can help you save more effectively.'
      });
    }

    setRecommendations(recommendationsList);
  };

  if (isLoading) {
    return (
      <div className="dashboard loading">
        <p>Loading your financial dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <h1>Financial Dashboard</h1>

      <div className="dashboard-grid">
        <FinancialSummary
          income={totalIncome}
          expenses={totalExpenses}
        />

        <RecentTransactions transactions={transactions.slice(0, 5)} />

        <GoalsOverview goals={goals} />

        <div className="dashboard-card recommendations-card card">
          <h2>Recommendations</h2>
          <ul className="recommendations-list">
            {recommendations.spending.concat(recommendations.savings).slice(0, 3).map((rec, index) => (
              <li key={index} className={`recommendation-item ${rec.type}`}>
                {rec.message}
              </li>
            ))}
            
            {recommendations.spending.length === 0 && 
             recommendations.savings.length === 0 && (
              <li className="recommendation-item">
                Add more transactions to get personalized recommendations.
              </li>
            )}
          </ul>
          <a href="/recommendations" className="view-all">View All Recommendations</a>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
