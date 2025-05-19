import React from 'react';
import { Link } from 'react-router-dom';
import './RecentTransactions.css';

const RecentTransactions = ({ transactions }) => {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="recent-transactions card">
        <h2>Recent Transactions</h2>
        <p className="no-data">No recent transactions</p>
      </div>
    );
  }
  
  return (
    <div className="recent-transactions card">
      <h2>Recent Transactions</h2>
      <ul className="transaction-list">
        {transactions.map(transaction => (
          <li 
            key={transaction.id} 
            className={`transaction-item ${transaction.type}`}
          >
            <div className="transaction-date">{transaction.date}</div>
            <div className="transaction-description">{transaction.description}</div>
            <div className="transaction-amount">
              {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
            </div>
          </li>
        ))}
      </ul>
      <Link to="/transactions" className="view-all">View All Transactions</Link>
    </div>
  );
};

export default RecentTransactions;
