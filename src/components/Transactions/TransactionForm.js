import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../../models/Transaction';
import './TransactionForm.css';

const TransactionForm = ({ transaction, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    id: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    amount: '',
    type: 'expense',
    category: 'Miscellaneous'
  });

  useEffect(() => {
    if (transaction) {
      setFormData({ ...transaction });
    }
  }, [transaction]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'amount' ? value : value }));
  };

  const handleTypeChange = (e) => {
    const type = e.target.value;
    setFormData(prev => ({ 
      ...prev, 
      type,
      category: type === 'income' ? 'Salary' : 'Miscellaneous'
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.description || !formData.amount || isNaN(formData.amount)) {
      alert('Please fill in all required fields with valid values');
      return;
    }
    
    onSave({
      ...formData,
      id: formData.id || uuidv4(),
      amount: parseFloat(formData.amount)
    });
  };

  const categories = formData.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <div className="transaction-form-container">
      <h2>{transaction ? 'Edit' : 'Add'} Transaction</h2>
      <form className="transaction-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Type</label>
          <div className="radio-group">
            <label>
              <input 
                type="radio" 
                name="type" 
                value="expense" 
                checked={formData.type === 'expense'} 
                onChange={handleTypeChange} 
              /> 
              Expense
            </label>
            <label>
              <input 
                type="radio" 
                name="type" 
                value="income" 
                checked={formData.type === 'income'} 
                onChange={handleTypeChange} 
              /> 
              Income
            </label>
          </div>
        </div>
        
        <div className="form-row">
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
        
        <div className="form-group">
          <label>Description</label>
          <input 
            type="text" 
            name="description" 
            value={formData.description} 
            onChange={handleChange} 
            required 
          />
        </div>
        
        <div className="form-group">
          <label>Category</label>
          <select 
            name="category" 
            value={formData.category} 
            onChange={handleChange} 
            required
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
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
