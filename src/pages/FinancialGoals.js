import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { goalService } from '../services/apiService';
import './FinancialGoals.css';

function FinancialGoals() {
  const [goals, setGoals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  const { currentUser } = useContext(AuthContext);

  // Load real goals data from MongoDB
  useEffect(() => {
    const loadGoals = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await goalService.getAll();
        console.log('Goals from API:', response.data);
        setGoals(response.data.data || []);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading goals:', error);
        setError('Failed to load goals. Please try again.');
        setIsLoading(false);
      }
    };
    
    loadGoals();
  }, []);

  // Handle goal creation - ensure it saves to MongoDB
  const handleCreateGoal = async (goalData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      // Log the request being sent
      console.log('Sending goal to API:', goalData);
      
      const response = await goalService.add(goalData);
      console.log('API Response:', response.data);
      
      // Update state with the returned goal (which includes MongoDB _id)
      setGoals(prevGoals => [...prevGoals, response.data.data]);
      setIsSubmitting(false);
      
      // Show success message
      alert('Goal successfully created!');
      return true;
    } catch (error) {
      console.error('Error creating goal:', error);
      setError('Failed to create goal: ' + (error.response?.data?.error || error.message));
      setIsSubmitting(false);
      return false;
    }
  };

  // Handle goal update
  const handleUpdateGoal = async (goalId, updatedData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      const response = await goalService.update(goalId, updatedData);
      
      // Update state with the returned updated goal
      setGoals(prevGoals => 
        prevGoals.map(goal => 
          goal._id === goalId ? response.data.data : goal
        )
      );
      
      setIsSubmitting(false);
      return true;
    } catch (error) {
      console.error('Error updating goal:', error);
      setError('Failed to update goal: ' + (error.response?.data?.error || error.message));
      setIsSubmitting(false);
      return false;
    }
  };

  // Handle goal deletion
  const handleDeleteGoal = async (goalId) => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      await goalService.delete(goalId);
      
      // Remove the deleted goal from state
      setGoals(prevGoals => prevGoals.filter(goal => goal._id !== goalId));
      setIsSubmitting(false);
      return true;
    } catch (error) {
      console.error('Error deleting goal:', error);
      setError('Failed to delete goal: ' + (error.response?.data?.error || error.message));
      setIsSubmitting(false);
      return false;
    }
  };

  // Add loading indicator
  if (isLoading) {
    return <div className="loading">Loading your financial goals...</div>;
  }
  
  return (
    <div className="financial-goals">
      <h1>Your Financial Goals</h1>
      
      {error && <div className="error">{error}</div>}
      
      <form className="goal-form" onSubmit={handleCreateGoal}>
        <input 
          type="text" 
          placeholder="Goal title" 
          value={newGoal.title}
          onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
          required
        />
        
        <input 
          type="number" 
          placeholder="Goal amount" 
          value={newGoal.amount}
          onChange={(e) => setNewGoal({ ...newGoal, amount: e.target.value })}
          required
        />
        
        <select 
          value={newGoal.type}
          onChange={(e) => setNewGoal({ ...newGoal, type: e.target.value })}
        >
          <option value="savings">Savings</option>
          <option value="investment">Investment</option>
        </select>
        
        <button type="submit">Add Goal</button>
      </form>
      
      <div className="goals-list">
        {goals.length === 0 ? (
          <p>No financial goals found. Create a new goal!</p>
        ) : (
          goals.map(goal => (
            <div key={goal._id} className="goal-item">
              <h2>{goal.title}</h2>
              <p>Amount: ${goal.amount}</p>
              <p>Type: {goal.type}</p>
              
              <button onClick={() => handleDeleteGoal(goal._id)}>Delete Goal</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default FinancialGoals;