import React from 'react';
import './FinancialSummary.css';

const FinancialSummary = ({ income, expenses }) => {
  const balance = income - expenses;
  const savingsRate = income > 0 ? ((income - expenses) / income * 100).toFixed(1) : 0;
  
  return (
    <div className="financial-summary card">
      <h2>Financial Summary</h2>
      <div className="summary-grid">
        <div className="summary-item income">
          <h3>Income</h3>
          <p>${income.toFixed(2)}</p>
        </div>
        
        <div className="summary-item expenses">
          <h3>Expenses</h3>
          <p>${expenses.toFixed(2)}</p>
        </div>
        
        <div className={`summary-item balance ${balance >= 0 ? 'positive' : 'negative'}`}>
          <h3>Balance</h3>
          <p>${Math.abs(balance).toFixed(2)}{balance < 0 ? ' (Deficit)' : ''}</p>
        </div>
        
        <div className="summary-item savings-rate">
          <h3>Savings Rate</h3>
          <p>{savingsRate}%</p>
        </div>
      </div>
    </div>
  );
};

export default FinancialSummary;
