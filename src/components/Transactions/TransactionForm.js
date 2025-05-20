import React, { useState, useEffect } from 'react';
import './TransactionForm.css';

const TransactionForm = ({ transaction, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    amount: '',
    type: 'expense',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  // If editing an existing transaction, populate the form
  useEffect(() => {
    if (transaction) {
      const formattedDate = transaction.date 
        ? new Date(transaction.date).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0];
        
      setFormData({
        amount: transaction.amount,
        type: transaction.type || 'expense',
        category: transaction.category || '',
        description: transaction.description || '',
        date: formattedDate
      });
    }
  }, [transaction]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.amount || !formData.category) {
      alert('Please fill in all required fields');
      return;
    }
    
    onSave({
      ...formData,
      amount: parseFloat(formData.amount)
    });
  };

  // Category options
  const expenseCategories = [
    'Housing', 'Transportation', 'Food', 'Utilities', 'Insurance', 
    'Healthcare', 'Savings', 'Debt', 'Personal', 'Entertainment', 
    'Miscellaneous'
  ];
  
  const incomeCategories = [
    'Salary', 'Freelance', 'Investments', 'Gifts', 'Refunds', 
    'Other Income'
  ];
  
  const categories = formData.type === 'expense' ? expenseCategories : incomeCategories;

  return (
    <div className="transaction-form-container">
      <h2>{transaction ? 'Edit' : 'Add'} Transaction</h2>
      <form className="transaction-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Type</label>
            <select 
              name="type" 
              value={formData.type} 
              onChange={handleChange}
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Amount ($)</label>
            <input 
              type="number" 
              name="amount" 
              value={formData.amount} 
              onChange={handleChange} 
              step="0.01" 
              min="0.01" 
              required
            />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>Category</label>
            <select 
              name="category" 
              value={formData.category} 
              onChange={handleChange} 
              required
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label>Date</label>
            <input 
              type="date" 
              name="date" 
              value={formData.date} 
              onChange={handleChange} 
              required
            />
          </div>
        </div>
        
        <div className="form-group">
          <label>Description (Optional)</label>
          <textarea 
            name="description" 
            value={formData.description} 
            onChange={handleChange} 
            rows="2"
          />
        </div>
        
        <div className="form-actions">
          <button type="button" className="cancel-button" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="save-button">
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;
