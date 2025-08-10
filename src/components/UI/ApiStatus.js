import React from 'react';
import { getMockApiMessage } from '../../config/apiConfig';
import './ApiStatus.css';

const ApiStatus = () => {
  const statusInfo = getMockApiMessage();
  
  return (
    <div className={`api-status api-status-${statusInfo.color}`}>
      <span className="status-badge">{statusInfo.status}</span>
      <span className="status-message">{statusInfo.message}</span>
    </div>
  );
};

export default ApiStatus;
