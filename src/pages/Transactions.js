import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { transactionService } from '../services/apiService';
import './Transactions.css';

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const { currentUser } = useContext(AuthContext);

  // Load real transactions data from MongoDB
  useEffect(() => {
    const loadTransactions = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await transactionService.getAll();
        console.log('Transactions from API:', response.data);
        setTransactions(response.data.data || []);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading transactions:', error);
        setError('Failed to load transactions. Please try again.');
        setIsLoading(false);
      }
    };
    
    loadTransactions();
  }, []);

  // Handle transaction creation - ensure it saves to MongoDB
  const handleAddTransaction = async (transactionData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      // Log the request being sent
      console.log('Sending transaction to API:', transactionData);
      
      const response = await transactionService.add(transactionData);
      console.log('API Response:', response.data);
      
      // Update state with the returned transaction (which includes MongoDB _id)
      setTransactions(prevTransactions => [...prevTransactions, response.data.data]);
      setIsSubmitting(false);
      
      // Show success message
      alert('Transaction successfully recorded!');
      return true;
    } catch (error) {
      console.error('Error adding transaction:', error);
      setError('Failed to add transaction: ' + (error.response?.data?.error || error.message));
      setIsSubmitting(false);
      return false;
    }
  };

  // Handle transaction deletion - delete from MongoDB
  const handleDeleteTransaction = async (transactionId) => {
    try {
      await transactionService.delete(transactionId);
      setTransactions(transactions.filter(t => t._id !== transactionId));
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  // Add loading indicator
  if (isLoading) {
    return <div className="loading">Loading your transactions...</div>;
  }
  
  return (
    <div className="transactions">
      <h1>Your Transactions</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="transaction-list">
        {transactions.map(transaction => (
          <div key={transaction._id} className="transaction-item">
            <div className="transaction-details">
              <span className="transaction-date">{new Date(transaction.date).toLocaleDateString()}</span>
              <span className="transaction-category">{transaction.category}</span>
              <span className="transaction-amount">${transaction.amount.toFixed(2)}</span>
            </div>
            
            <div className="transaction-actions">
              <button 
                className="delete-btn" 
                onClick={() => handleDeleteTransaction(transaction._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Add transaction form or modal can be integrated here */}
    </div>
  );
}

export default Transactions;