import React, { useState } from 'react';
import './TransactionList.css';

const TransactionList = ({ transactions, onEdit, onDelete }) => {
  const [filter, setFilter] = useState({
    type: 'all',
    search: ''
  });
  
  // Sort transactions by date (newest first)
  const sortedTransactions = [...transactions].sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });
  
  // Apply filters
  const filteredTransactions = sortedTransactions.filter(transaction => {
    // Filter by type
    if (filter.type !== 'all' && transaction.type !== filter.type) {
      return false;
    }
    
    // Filter by search term
    if (filter.search && !transaction.description.toLowerCase().includes(filter.search.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter(prev => ({ ...prev, [name]: value }));
  };
  
  if (transactions.length === 0) {
    return <p className="no-data">No transactions found. Add your first transaction to get started.</p>;
  }
  
  return (
    <div className="transaction-list-container">
      <div className="filter-bar">
        <div className="filter-group">
          <label>Type:</label>
          <select 
            name="type" 
            value={filter.type} 
            onChange={handleFilterChange}
          >
            <option value="all">All</option>
            <option value="expense">Expenses</option>
            <option value="income">Income</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label>Search:</label>
          <input 
            type="text" 
            name="search" 
            value={filter.search} 
            onChange={handleFilterChange} 
            placeholder="Search transactions..." 
          />
        </div>
      </div>
      
      <table className="transaction-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Category</th>
            <th>Amount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTransactions.map(transaction => (
            <tr key={transaction.id} className={transaction.type}>
              <td>{transaction.date}</td>
              <td>{transaction.description}</td>
              <td>{transaction.category}</td>
              <td className="amount">
                {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
              </td>
              <td className="actions">
                <button 
                  className="edit-btn" 
                  onClick={() => onEdit(transaction)}
                  title="Edit"
                >
                  Edit
                </button>
                <button 
                  className="delete-btn" 
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this transaction?')) {
                      onDelete(transaction.id);
                    }
                  }}
                  title="Delete"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionList;
