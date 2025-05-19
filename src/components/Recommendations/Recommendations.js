import React, { useState, useEffect } from 'react';
import RecommendationService from '../../services/RecommendationService';
import './Recommendations.css';

const Recommendations = () => {
  const [recommendations, setRecommendations] = useState({
    spending: [],
    savings: [],
    investment: []
  });
  
  const recommendationService = new RecommendationService();
  
  useEffect(() => {
    const allRecommendations = recommendationService.getAllRecommendations();
    setRecommendations(allRecommendations);
  }, []);
  
  const renderRecommendations = (recs) => {
    if (!recs || recs.length === 0) {
      return <p>No recommendations available.</p>;
    }
    
    return (
      <ul className="recommendation-list">
        {recs.map((rec, index) => (
          <li 
            key={index} 
            className={`recommendation-item ${rec.type}`}
          >
            {rec.message}
          </li>
        ))}
      </ul>
    );
  };
  
  return (
    <div className="recommendations-page">
      <h1>AI-Powered Financial Recommendations</h1>
      
      <div className="recommendation-section">
        <h2>Spending Recommendations</h2>
        <div className="recommendation-content">
          {renderRecommendations(recommendations.spending)}
        </div>
      </div>
      
      <div className="recommendation-section">
        <h2>Savings Recommendations</h2>
        <div className="recommendation-content">
          {renderRecommendations(recommendations.savings)}
        </div>
      </div>
      
      <div className="recommendation-section">
        <h2>Investment Recommendations</h2>
        <div className="recommendation-content">
          {renderRecommendations(recommendations.investment)}
        </div>
      </div>
    </div>
  );
};

export default Recommendations;
