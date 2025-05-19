import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { transactionService, goalService } from '../../services/apiService';
import DatabaseService from '../../patterns/singleton/DatabaseService';
import './Dashboard.css';

// Dashboard components
import FinancialSummary from './FinancialSummary';
import RecentTransactions from './RecentTransactions';
import GoalsOverview from './GoalsOverview';
import TopRecommendations from './TopRecommendations';
import ModeSelector from './ModeSelector';

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [goals, setGoals] = useState([]);
  const [recommendations, setRecommendations] = useState({});
  const [financialState, setFinancialState] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  
  // Get current user from auth context
  const { currentUser } = useContext(AuthContext);
  
  useEffect(() => {
    // Fetch real data from API instead of client services
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch transactions from MongoDB via API
        const transResponse = await transactionService.getAll();
        const userTransactions = transResponse.data.data || [];
        setTransactions(userTransactions);
        
        // Calculate financial metrics
        const incomeTotal = userTransactions
          .filter(t => t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0);
        
        const expenseTotal = userTransactions
          .filter(t => t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0);
        
        setTotalIncome(incomeTotal);
        setTotalExpenses(expenseTotal);
        
        // Fetch goals from MongoDB via API
        const goalResponse = await goalService.getAll();
        const userGoals = goalResponse.data.data || [];
        setGoals(userGoals);
        
        // Generate recommendations based on real user data
        generateRecommendations(userTransactions, userGoals);
        
        // Get financial state from local storage for now
        // (this could be moved to the server later)
        setFinancialState(DatabaseService.getFinancialState());
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Generate recommendations based on real user data
  const generateRecommendations = (transactions, goals) => {
    const recommendationsList = {
      spending: [],
      savings: []
    };
    
    // Simple recommendation based on spending patterns
    if (transactions.length > 0) {
      // Group expenses by category
      const expensesByCategory = {};
      transactions
        .filter(t => t.type === 'expense')
        .forEach(t => {
          if (!expensesByCategory[t.category]) {
            expensesByCategory[t.category] = 0;
          }
          expensesByCategory[t.category] += t.amount;
        });
      
      // Find highest spending category
      let highestCategory = '';
      let highestAmount = 0;
      
      for (const category in expensesByCategory) {
        if (expensesByCategory[category] > highestAmount) {
          highestAmount = expensesByCategory[category];
          highestCategory = category;
        }
      }
      
      // Calculate percentage of total expenses
      const percentage = totalExpenses > 0 
        ? ((highestAmount / totalExpenses) * 100).toFixed(1) 
        : 0;
      
      // Add recommendation if percentage is high
      if (percentage > 30) {
        recommendationsList.spending.push({
          type: 'info',
          message: `Your highest spending category is ${highestCategory} at $${highestAmount.toFixed(2)} (${percentage}% of total). Consider setting a budget for this category.`
        });
      }
    }
    
    // Simple savings recommendation
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
      
      <ModeSelector 
        currentState={financialState} 
        onStateChange={(newState) => {
          DatabaseService.setFinancialState(newState);
          setFinancialState(newState);
        }} 
      />
      
      <div className="dashboard-grid">
        <FinancialSummary 
          income={totalIncome} 
          expenses={totalExpenses} 
        />
        
        <RecentTransactions transactions={transactions.slice(0, 5)} />
        
        <GoalsOverview goals={goals} />
        
        <TopRecommendations 
          recommendations={[
            ...(recommendations.spending || []),
            ...(recommendations.savings || [])
          ].slice(0, 3)}
        />
      </div>
    </div>
  );
};

export default Dashboard;
