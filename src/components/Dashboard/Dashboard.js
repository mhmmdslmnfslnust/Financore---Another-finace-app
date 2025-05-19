import React, { useState, useEffect } from 'react';
import TransactionService from '../../services/TransactionService';
import GoalService from '../../services/GoalService';
import RecommendationService from '../../services/RecommendationService';
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
  
  const transactionService = new TransactionService();
  const goalService = new GoalService();
  const recommendationService = new RecommendationService();
  
  useEffect(() => {
    // Fetch data
    setTransactions(transactionService.getAllTransactions());
    setGoals(goalService.getAllGoals());
    setRecommendations(recommendationService.getAllRecommendations());
    
    // Get current financial state
    setFinancialState(DatabaseService.getFinancialState());
  }, []);

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
          income={transactionService.getTotalIncome()} 
          expenses={transactionService.getTotalExpenses()} 
        />
        
        <RecentTransactions transactions={transactions.slice(0, 5)} />
        
        <GoalsOverview goals={goals} />
        
        <TopRecommendations 
          recommendations={[
            ...(recommendations.spending || []).slice(0, 2),
            ...(recommendations.savings || []).slice(0, 1)
          ]}
        />
      </div>
    </div>
  );
};

export default Dashboard;
