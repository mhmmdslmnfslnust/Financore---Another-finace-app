import React from 'react';
import { Link } from 'react-router-dom';
import './GoalsOverview.css';

const GoalsOverview = ({ goals }) => {
  if (!goals || goals.length === 0) {
    return (
      <div className="goals-overview card">
        <h2>Financial Goals</h2>
        <p className="no-data">No goals set yet</p>
        <Link to="/goals" className="add-goal-button">Add Your First Goal</Link>
      </div>
    );
  }
  
  // Sort goals by progress percentage (ascending)
  const sortedGoals = [...goals].sort((a, b) => {
    const progressA = a.currentAmount / a.targetAmount;
    const progressB = b.currentAmount / b.targetAmount;
    return progressA - progressB;
  });
  
  return (
    <div className="goals-overview card">
      <h2>Financial Goals</h2>
      <ul className="goals-list">
        {sortedGoals.slice(0, 3).map(goal => {
          const progressPercentage = (goal.currentAmount / goal.targetAmount * 100).toFixed(0);
          
          return (
            <li key={goal.id} className="goal-item">
              <div className="goal-info">
                <div className="goal-name">{goal.name}</div>
                <div className="goal-progress-text">
                  ${goal.currentAmount.toFixed(2)} of ${goal.targetAmount.toFixed(2)}
                </div>
              </div>
              <div className="goal-progress-bar">
                <div 
                  className="goal-progress-fill" 
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <div className="goal-percentage">{progressPercentage}%</div>
            </li>
          );
        })}
      </ul>
      <Link to="/goals" className="view-all">View All Goals</Link>
    </div>
  );
};

export default GoalsOverview;
