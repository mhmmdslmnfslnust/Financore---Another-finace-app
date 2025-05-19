import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import './GoalForm.css';

const GoalForm = ({ goal, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    targetAmount: '',
    currentAmount: '0',
    deadline: '',
    category: 'Savings'
  });

  useEffect(() => {
    if (goal) {
      setFormData({ ...goal });
    }
  }, [goal]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name.includes('Amount') ? value : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.targetAmount || isNaN(formData.targetAmount)) {
      alert('Please fill in all required fields with valid values');
      return;
    }
    
    onSave({
      ...formData,
      id: formData.id || uuidv4(),
      targetAmount: parseFloat(formData.targetAmount),
      currentAmount: parseFloat(formData.currentAmount || 0)
    });
  };
  
  const categories = ['Savings', 'Investment', 'Emergency Fund', 'Retirement', 'Vacation', 'Education', 'Home', 'Car', 'Debt Payoff', 'Other'];

  return (
    <div className="goal-form-container">
      <h2>{goal ? 'Edit' : 'Add'} Financial Goal</h2>
      <form className="goal-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Goal Name</label>
          <input 
            type="text" 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            required 
            placeholder="e.g., Emergency Fund, Vacation, etc."
          />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>Target Amount ($)</label>
            <input 
              type="number" 
              name="targetAmount" 
              value={formData.targetAmount} 
              onChange={handleChange} 
              step="0.01" 
              min="1" 
              required 
              placeholder="5000"
            />
          </div>
          
          <div className="form-group">
            <label>Current Amount ($)</label>
            <input 
              type="number" 
              name="currentAmount" 
              value={formData.currentAmount} 
              onChange={handleChange} 
              step="0.01" 
              min="0" 
              placeholder="0"
            />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>Target Date (Optional)</label>
            <input 
              type="date" 
              name="deadline" 
              value={formData.deadline || ''} 
              onChange={handleChange} 
              min={new Date().toISOString().split('T')[0]}
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

export default GoalForm;
