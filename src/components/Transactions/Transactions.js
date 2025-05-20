import React, { useState, useEffect } from 'react';
import { transactionService } from '../../services/apiService';
import TransactionList from './TransactionList';
import TransactionForm from './TransactionForm';
import './Transactions.css';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState(null);
  const [error, setError] = useState(null);
  
  // Load transactions from MongoDB via API
  useEffect(() => {
    loadTransactions();
  }, []);
  
  const loadTransactions = async () => {
    try {
      setIsLoading(true);
      const response = await transactionService.getAll();
      console.log('Transactions from API:', response.data);
      setTransactions(response.data.data || []);
      setIsLoading(false);
    } catch (err) {
      console.error('Error loading transactions:', err);
      setError('Failed to load transactions');
      setIsLoading(false);
    }
  };
  
  const handleAddTransaction = async (transaction) => {
    try {
      const response = await transactionService.add(transaction);
      console.log('Added transaction:', response.data);
      await loadTransactions();
      setIsAdding(false);
    } catch (err) {
      console.error('Error adding transaction:', err);
      alert('Failed to add transaction');
    }
  };
  
  const handleEditTransaction = async (transaction) => {
    try {
      const response = await transactionService.update(transaction._id, transaction);
      console.log('Updated transaction:', response.data);
      await loadTransactions();
      setIsEditing(false);
      setCurrentTransaction(null);
    } catch (err) {
      console.error('Error updating transaction:', err);
      alert('Failed to update transaction');
    }
  };
  
  const handleDeleteTransaction = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await transactionService.delete(id);
        await loadTransactions();
      } catch (err) {
        console.error('Error deleting transaction:', err);
        alert('Failed to delete transaction');
      }
    }
  };
  
  const startEditing = (transaction) => {
    setCurrentTransaction(transaction);
    setIsEditing(true);
    setIsAdding(false);
  };
  
  if (isLoading) {
    return <div className="loading">Loading transactions...</div>;
  }
  
  if (error) {
    return <div className="error">{error}</div>;
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
      
      {(isAdding || isEditing) && (
        <TransactionForm 
          transaction={currentTransaction}
          onSave={isEditing ? handleEditTransaction : handleAddTransaction}
          onCancel={() => {
            setIsAdding(false);
            setIsEditing(false);
            setCurrentTransaction(null);
          }}
        />
      )}
      
      <TransactionList 
        transactions={transactions}
        onEdit={startEditing}
        onDelete={handleDeleteTransaction}
      />
    </div>
  );
};

export default Transactions;
