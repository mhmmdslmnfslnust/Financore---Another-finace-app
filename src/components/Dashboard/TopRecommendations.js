import React from 'react';
import { Link } from 'react-router-dom';
import './TopRecommendations.css';

const TopRecommendations = ({ recommendations }) => {
  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="top-recommendations card">
        <h2>AI Recommendations</h2>
        <p className="no-data">No recommendations available yet</p>
        <p className="tip">Add more transactions to get personalized financial advice</p>
      </div>
    );
  }
  
  return (
    <div className="top-recommendations card">
      <h2>AI Recommendations</h2>
      <ul className="recommendations-list">
        {recommendations.map((recommendation, index) => (
          <li 
            key={index} 
            className={`recommendation-item ${recommendation.type || 'tip'}`}
          >
            {recommendation.message}
          </li>
        ))}
      </ul>
      <Link to="/recommendations" className="view-all">View All Recommendations</Link>
    </div>
  );
};

export default TopRecommendations;
