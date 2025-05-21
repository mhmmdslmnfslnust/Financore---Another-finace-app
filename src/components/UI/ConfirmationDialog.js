import React from 'react';
import './ConfirmationDialog.css';

/**
 * Reusable confirmation dialog component
 * @param {Object} props
 * @param {string} props.title - Dialog title
 * @param {string} props.message - Dialog message
 * @param {Function} props.onConfirm - Function to call when confirmed
 * @param {Function} props.onCancel - Function to call when canceled
 * @param {boolean} props.isOpen - Whether the dialog is open
 * @param {string} props.confirmText - Text for confirm button (optional)
 * @param {string} props.cancelText - Text for cancel button (optional)
 * @param {string} props.confirmStyle - Style for confirm button: 'danger', 'warning', or 'default' (optional)
 */
const ConfirmationDialog = ({ 
  title, 
  message, 
  onConfirm, 
  onCancel, 
  isOpen, 
  confirmText = "Confirm", 
  cancelText = "Cancel",
  confirmStyle = "danger" // 'danger', 'warning', or 'default'
}) => {
  if (!isOpen) return null;

  // Close when clicking outside the dialog (on overlay)
  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('confirmation-overlay')) {
      onCancel();
    }
  };

  // Prevent clicks inside the dialog from bubbling to the overlay
  const handleDialogClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="confirmation-overlay" onClick={handleOverlayClick}>
      <div className="confirmation-dialog" onClick={handleDialogClick}>
        <div className="confirmation-header">
          <h3>{title}</h3>
        </div>
        <div className="confirmation-body">
          <p>{message}</p>
        </div>
        <div className="confirmation-actions">
          <button 
            className="cancel-button" 
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button 
            className={`confirm-button ${confirmStyle}`} 
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
