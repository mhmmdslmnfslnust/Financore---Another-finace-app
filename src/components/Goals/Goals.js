import React, { useState, useEffect } from 'react';
import GoalService from '../../services/GoalService';
import GoalList from './GoalList';
import GoalForm from './GoalForm';
import './Goals.css';

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentGoal, setCurrentGoal] = useState(null);
  
  const goalService = new GoalService();
  
  useEffect(() => {
    loadGoals();
  }, []);
  
  const loadGoals = () => {
    const allGoals = goalService.getAllGoals();
    setGoals(allGoals);
  };
  
  const handleAddGoal = (goal) => {
    goalService.addGoal(goal);
    loadGoals();
    setIsAdding(false);
  };
  
  const handleEditGoal = (goal) => {
    goalService.updateGoal(goal.id, goal);
    loadGoals();
    setIsEditing(false);
    setCurrentGoal(null);
  };
  
  const handleDeleteGoal = (id) => {
    goalService.deleteGoal(id);
    loadGoals();
  };
  
  const handleContributeToGoal = (id, amount) => {
    goalService.contributeToGoal(id, amount);
    loadGoals();
  };
  
  const startEditing = (goal) => {
    setCurrentGoal(goal);
    setIsEditing(true);
    setIsAdding(false);
  };
  
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
