import React, { useState, useEffect } from 'react';
import { goalService } from '../../services/apiService';
import GoalList from './GoalList';
import GoalForm from './GoalForm';
import './Goals.css';

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentGoal, setCurrentGoal] = useState(null);
  const [error, setError] = useState(null);
  
  // Load goals from MongoDB via API
  useEffect(() => {
    loadGoals();
  }, []);
  
  const loadGoals = async () => {
    try {
      setIsLoading(true);
      const response = await goalService.getAll();
      console.log('Goals from API:', response.data);
      setGoals(response.data.data || []);
      setIsLoading(false);
    } catch (err) {
      console.error('Error loading goals:', err);
      setError('Failed to load goals');
      setIsLoading(false);
    }
  };
  
  const handleAddGoal = async (goal) => {
    try {
      const response = await goalService.add(goal);
      console.log('Added goal:', response.data);
      await loadGoals();
      setIsAdding(false);
    } catch (err) {
      console.error('Error adding goal:', err);
      alert('Failed to add goal');
    }
  };
  
  const handleEditGoal = async (goal) => {
    try {
      const response = await goalService.update(goal._id, goal);
      console.log('Updated goal:', response.data);
      await loadGoals();
      setIsEditing(false);
      setCurrentGoal(null);
    } catch (err) {
      console.error('Error updating goal:', err);
      alert('Failed to update goal');
    }
  };
  
  const handleDeleteGoal = async (id) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      try {
        await goalService.delete(id);
        await loadGoals();
      } catch (err) {
        console.error('Error deleting goal:', err);
        alert('Failed to delete goal');
      }
    }
  };
  
  const handleContributeToGoal = async (id, amount) => {
    try {
      // First get the goal to update
      const goal = goals.find(g => g._id === id);
      if (!goal) return;
      
      // Update the goal with new amount
      const updatedGoal = {
        ...goal,
        currentAmount: (parseFloat(goal.currentAmount) || 0) + parseFloat(amount)
      };
      
      await goalService.update(id, updatedGoal);
      await loadGoals();
    } catch (err) {
      console.error('Error contributing to goal:', err);
      alert('Failed to update goal contribution');
    }
  };
  
  const startEditing = (goal) => {
    setCurrentGoal(goal);
    setIsEditing(true);
    setIsAdding(false);
  };
  
  if (isLoading) {
    return <div className="loading">Loading financial goals...</div>;
  }
  
  if (error) {
    return <div className="error">{error}</div>;
  }
  
  return (
    <div className="goals-page">
      <div className="goals-header">
        <h1>Financial Goals</h1>
        <button 
          className="add-button" 
          onClick={() => {
            setIsAdding(true);
            setIsEditing(false);
            setCurrentGoal(null);
          }}
        >
          Add Goal
        </button>
      </div>
      
      {(isAdding || isEditing) && (
        <GoalForm 
          goal={currentGoal}
          onSave={isEditing ? handleEditGoal : handleAddGoal}
          onCancel={() => {
            setIsAdding(false);
            setIsEditing(false);
            setCurrentGoal(null);
          }}
        />
      )}
      
      <GoalList 
        goals={goals}
        onEdit={startEditing}
        onDelete={handleDeleteGoal}
        onContribute={handleContributeToGoal}
      />
    </div>
  );
};

export default Goals;
