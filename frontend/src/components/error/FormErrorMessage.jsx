import React from 'react';
import { AlertCircle } from 'lucide-react';

/**
 * Component for displaying field-specific validation errors in forms
 * 
 * @param {Object} props - Component props
 * @param {string} props.message - The error message to display
 * @param {string} props.className - Additional CSS classes
 */
const FormErrorMessage = ({ message, className = '' }) => {
  if (!message) return null;
  
  return (
    <div 
      className={`flex items-center mt-1 text-sm text-red-500 dark:text-red-400 ${className}`}
      role="alert"
    >
      <AlertCircle className="h-3 w-3 mr-1 flex-shrink-0" />
      <span>{message}</span>
    </div>
  );
};

export default FormErrorMessage;