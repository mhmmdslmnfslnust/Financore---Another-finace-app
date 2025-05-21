import React, { useState } from 'react';
import { formatCurrency, formatDate } from '../../utils/formatters';
import ConfirmationDialog from '../UI/ConfirmationDialog';

const TransactionItem = ({ transaction, onEdit, onDelete }) => {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  
  const { id, type, amount, category, date, description } = transaction;
  
  const handleEdit = () => {
    onEdit(transaction);
  };
  
  const handleDeleteClick = () => {
    setShowDeleteConfirmation(true);
  };
  
  const confirmDelete = () => {
    onDelete(id);
    setShowDeleteConfirmation(false);
  };
  
  const cancelDelete = () => {
    setShowDeleteConfirmation(false);
  };

  return (
    <div className={`transaction-item ${type}`}>
      <div className="transaction-details">
        <div className="transaction-main">
          <div className="transaction-category">{category}</div>
          <div className="transaction-amount">{formatCurrency(amount)}</div>
        </div>
        <div className="transaction-secondary">
          <div className="transaction-date">{formatDate(date)}</div>
          {description && <div className="transaction-description">{description}</div>}
        </div>
      </div>
      <div className="transaction-actions">
        <button onClick={handleEdit} className="edit-button">Edit</button>
        <button onClick={handleDeleteClick} className="delete-button">Delete</button>
      </div>
      
      <ConfirmationDialog
        isOpen={showDeleteConfirmation}
        title="Delete Transaction"
        message="Are you sure you want to delete this transaction? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        confirmText="Delete"
        cancelText="Cancel"
        confirmStyle="danger"
      />
    </div>
  );
};

export default TransactionItem;
