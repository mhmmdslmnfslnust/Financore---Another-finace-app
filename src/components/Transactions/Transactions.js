import React, { useState, useEffect } from 'react';
import { transactionService } from '../../services/apiService';
import TransactionForm from './TransactionForm';
import './Transactions.css';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState(null);

  // Load transactions
  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await transactionService.getAll();
      console.log('API Response:', response.data);
      setTransactions(response.data.data || []);
      setIsLoading(false);
    } catch (err) {
      console.error('Error loading transactions:', err);
      setError('Failed to load transactions. Please try again.');
      setIsLoading(false);
    }
  };

  const handleAddTransaction = async (transaction) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await transactionService.add(transaction);
      console.log('Added transaction:', response.data);
      
      // Reload all transactions to ensure we have the latest data
      await loadTransactions();
      setIsAdding(false);
    } catch (err) {
      console.error('Error adding transaction:', err);
      setError('Failed to add transaction. Please try again.');
      setIsLoading(false);
    }
  };

  const handleUpdateTransaction = async (transaction) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await transactionService.update(currentTransaction._id, transaction);
      console.log('Updated transaction:', response.data);
      
      // Reload transactions
      await loadTransactions();
      setIsEditing(false);
      setCurrentTransaction(null);
    } catch (err) {
      console.error('Error updating transaction:', err);
      setError('Failed to update transaction. Please try again.');
      setIsLoading(false);
    }
  };

  const handleDeleteTransaction = async (id) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) {
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      await transactionService.delete(id);
      
      // Reload transactions
      await loadTransactions();
    } catch (err) {
      console.error('Error deleting transaction:', err);
      setError('Failed to delete transaction. Please try again.');
      setIsLoading(false);
    }
  };

  if (isLoading && transactions.length === 0) {
    return <div className="loading">Loading transactions...</div>;
  }

  return (
    <div className="transactions-page">
      <div className="transactions-header">
        <h1>Transactions</h1>
        <button 
          className="add-button" 
          onClick={() => {
            setIsAdding(true);
            setIsEditing(false);
            setCurrentTransaction(null);
          }}
        >
          Add Transaction
        </button>
      </div>
      
      {error && <div className="error">{error}</div>}
      
      {(isAdding || isEditing) && (
        <TransactionForm 
          transaction={currentTransaction}
          onSave={isEditing ? handleUpdateTransaction : handleAddTransaction}
          onCancel={() => {
            setIsAdding(false);
            setIsEditing(false);
            setCurrentTransaction(null);
          }}
        />
      )}
      
      <div className="transactions-list">
        {transactions.length === 0 ? (
          <p className="no-data">No transactions found. Add your first transaction to get started!</p>
        ) : (
          transactions.map(transaction => (
            <div 
              key={transaction._id} 
              className={`transaction-item ${transaction.type === 'income' ? 'income' : 'expense'}`}
            >
              <div className="transaction-details">
                <div className="transaction-main">
                  <span className="transaction-category">{transaction.category}</span>
                  <span className="transaction-amount">
                    {transaction.type === 'income' ? '+' : '-'} ${Math.abs(transaction.amount).toFixed(2)}
                  </span>
                </div>
                <div className="transaction-secondary">
                  <span className="transaction-date">
                    {new Date(transaction.date).toLocaleDateString()}
                  </span>
                  <span className="transaction-description">{transaction.description}</span>
                </div>
              </div>
              
              <div className="transaction-actions">
                <button 
                  className="edit-button" 
                  onClick={() => {
                    setCurrentTransaction(transaction);
                    setIsEditing(true);
                    setIsAdding(false);
                  }}
                >
                  Edit
                </button>
                <button 
                  className="delete-button" 
                  onClick={() => handleDeleteTransaction(transaction._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Transactions;
