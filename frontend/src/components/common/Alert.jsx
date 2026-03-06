import React from 'react';
import { FiCheckCircle, FiAlertCircle, FiInfo, FiXCircle } from 'react-icons/fi';

const Alert = ({ type = 'info', message, onClose }) => {
  const icons = {
    success: FiCheckCircle,
    error: FiXCircle,
    warning: FiAlertCircle,
    info: FiInfo
  };
  
  const colors = {
    success: 'bg-green-50 text-green-800 border-green-200',
    error: 'bg-red-50 text-red-800 border-red-200',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    info: 'bg-blue-50 text-blue-800 border-blue-200'
  };
  
  const Icon = icons[type];
  
  return (
    <div className={`rounded-lg border p-4 ${colors[type]}`}>
      <div className="flex items-center">
        <Icon className="text-xl mr-3" />
        <span className="flex-1">{message}</span>
        {onClose && (
          <button onClick={onClose} className="ml-4">
            <FiXCircle className="text-xl" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;