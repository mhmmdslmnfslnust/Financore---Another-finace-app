import React, { useState } from 'react';
import './GoalList.css';

const GoalList = ({ goals, onEdit, onDelete, onContribute }) => {
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [contributionAmount, setContributionAmount] = useState('');
  
  const handleContributeClick = (goal) => {
    setSelectedGoal(goal);
    setContributionAmount('');
  };
  
  const handleContribute = () => {
    if (!contributionAmount || isNaN(contributionAmount) || parseFloat(contributionAmount) <= 0) {
      alert('Please enter a valid contribution amount');
      return;
    }
    
    onContribute(selectedGoal.id, parseFloat(contributionAmount));
    setSelectedGoal(null);
    setContributionAmount('');
  };
  
  if (goals.length === 0) {
    return <p className="no-data">No financial goals found. Add your first goal to get started.</p>;
  }
  
  // Sort goals by progress (least to most complete)
  const sortedGoals = [...goals].sort((a, b) => {
    const progressA = a.currentAmount / a.targetAmount;
    const progressB = b.currentAmount / b.targetAmount;
    return progressA - progressB;
  });
  
  return (
    <div className="goal-list-container">
      {selectedGoal && (
        <div className="contribution-modal">
          <div className="modal-content">
            <h3>Contribute to Goal: {selectedGoal.name}</h3>
            <div className="form-group">
              <label>Amount ($)</label>
              <input 
                type="number" 
                value={contributionAmount} 
                onChange={e => setContributionAmount(e.target.value)} 
                step="0.01" 
                min="0.01" 
                required 
                autoFocus
              />
            </div>
            <div className="modal-actions">
              <button 
                className="cancel-button" 
                onClick={() => setSelectedGoal(null)}
              >
                Cancel
              </button>
              <button 
                className="contribute-button" 
                onClick={handleContribute}
              >
                Contribute
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="goals-grid">
        {sortedGoals.map(goal => {
          const progressPercentage = (goal.currentAmount / goal.targetAmount * 100).toFixed(0);
          const isCompleted = goal.currentAmount >= goal.targetAmount;
          const remainingAmount = goal.targetAmount - goal.currentAmount;
          
          return (
            <div key={goal.id} className={`goal-card ${isCompleted ? 'completed' : ''}`}>
              <div className="goal-header">
                <h3>{goal.name}</h3>
                <span className="goal-category">{goal.category}</span>
              </div>
              
              <div className="goal-amounts">
                <div className="amount-item">
                  <span className="label">Target</span>
                  <span className="value">${goal.targetAmount.toFixed(2)}</span>
                </div>
                <div className="amount-item">
                  <span className="label">Current</span>
                  <span className="value">${goal.currentAmount.toFixed(2)}</span>
                </div>
                <div className="amount-item">
                  <span className="label">Remaining</span>
                  <span className="value">${Math.max(0, remainingAmount).toFixed(2)}</span>
                </div>
              </div>
              
              <div className="goal-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${Math.min(100, progressPercentage)}%` }}
                  ></div>
                </div>
                <span className="progress-text">{progressPercentage}% Complete</span>
              </div>
              
              {goal.deadline && (
                <div className="goal-deadline">
                  <span className="label">Deadline</span>
                  <span className="value">{new Date(goal.deadline).toLocaleDateString()}</span>
                </div>
              )}
              
              <div className="goal-actions">
                {!isCompleted && (
                  <button 
                    className="contribute-btn" 
                    onClick={() => handleContributeClick(goal)}
                  >
                    Contribute
                  </button>
                )}
                <button 
                  className="edit-btn" 
                  onClick={() => onEdit(goal)}
                >
                  Edit
                </button>
                <button 
                  className="delete-btn" 
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this goal?')) {
                      onDelete(goal.id);
                    }
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GoalList;
