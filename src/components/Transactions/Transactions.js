import React, { useState, useEffect } from 'react';
import TransactionService from '../../services/TransactionService';
import TransactionList from './TransactionList';
import TransactionForm from './TransactionForm';
import './Transactions.css';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState(null);
  
  const transactionService = new TransactionService();
  
  useEffect(() => {
    loadTransactions();
  }, []);
  
  const loadTransactions = () => {
    const allTransactions = transactionService.getAllTransactions();
    setTransactions(allTransactions);
  };
  
  const handleAddTransaction = (transaction) => {
    transactionService.addTransaction(transaction);
    loadTransactions();
    setIsAdding(false);
  };
  
  const handleEditTransaction = (transaction) => {
    transactionService.updateTransaction(transaction.id, transaction);
    loadTransactions();
    setIsEditing(false);
    setCurrentTransaction(null);
  };
  
  const handleDeleteTransaction = (id) => {
    transactionService.deleteTransaction(id);
    loadTransactions();
  };
  
  const startEditing = (transaction) => {
    setCurrentTransaction(transaction);
    setIsEditing(true);
    setIsAdding(false);
  };
  
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
