import React, { useState, useEffect } from 'react';
import { goalService } from '../../services/apiService';
import GoalList from './GoalList';
import GoalForm from './GoalForm';
import ConfirmationDialog from '../UI/ConfirmationDialog';
import './Goals.css';

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentGoal, setCurrentGoal] = useState(null);
  const [error, setError] = useState(null);
  // New state for delete confirmation
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    isOpen: false,
    goalId: null
  });
  
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
  
  // Show deletion confirmation dialog
  const showDeleteConfirmation = (id) => {
    setDeleteConfirmation({
      isOpen: true,
      goalId: id
    });
  };

  // Hide deletion confirmation dialog
  const hideDeleteConfirmation = () => {
    setDeleteConfirmation({
      isOpen: false,
      goalId: null
    });
  };
  
  // Replace window.confirm with custom dialog
  const handleDeleteGoal = (id) => {
    showDeleteConfirmation(id);
  };
  
  // Actual deletion after confirmation
  const confirmDeleteGoal = async () => {
    try {
      setIsLoading(true);
      console.log('Attempting to delete goal with ID:', deleteConfirmation.goalId);
      await goalService.delete(deleteConfirmation.goalId);
      console.log('Goal deletion successful, reloading goals');
      await loadGoals();
      hideDeleteConfirmation();
    } catch (err) {
      console.error('Error deleting goal:', err);
      // Add more detailed error information
      if (err.response) {
        console.error('Server response:', err.response.data);
        console.error('Status code:', err.response.status);
      }
      alert('Failed to delete goal. Check console for details.');
      hideDeleteConfirmation();
      setIsLoading(false);
    }
  };
  
  const handleContributeToGoal = async (id, amount) => {
    try {
      // Use the new contribute endpoint
      await goalService.contribute(id, amount);
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
      
      {/* Add the confirmation dialog component */}
      <ConfirmationDialog
        isOpen={deleteConfirmation.isOpen}
        title="Delete Financial Goal"
        message="Are you sure you want to delete this financial goal? This action cannot be undone."
        onConfirm={confirmDeleteGoal}
        onCancel={hideDeleteConfirmation}
        confirmText="Delete"
        cancelText="Cancel"
        confirmStyle="danger"
      />
    </div>
  );
};

export default Goals;
