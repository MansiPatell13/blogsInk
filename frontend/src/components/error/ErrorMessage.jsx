import React from 'react';
import { AlertCircle, X } from 'lucide-react';

const ErrorMessage = ({
  message,
  title,
  variant = 'default', // default, inline, toast
  dismissible = false,
  onDismiss,
  className = '',
}) => {
  // Determine the appropriate styling based on the variant
  const getVariantClasses = () => {
    switch (variant) {
      case 'inline':
        return 'text-red-500 dark:text-red-400 text-sm flex items-center';
      case 'toast':
        return 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 rounded-lg shadow-sm p-4';
      case 'default':
      default:
        return 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 rounded-md p-3';
    }
  };

  // Handle dismiss click
  const handleDismiss = () => {
    if (onDismiss) {
      onDismiss();
    }
  };

  return (
    <div className={`error-message ${getVariantClasses()} ${className}`} role="alert">
      <div className="flex items-start">
        {variant !== 'inline' && (
          <div className="flex-shrink-0 mr-3">
            <AlertCircle className="h-5 w-5 text-red-400 dark:text-red-300" />
          </div>
        )}
        
        <div className="flex-1">
          {title && <div className="font-medium">{title}</div>}
          <div className={title ? 'mt-1' : ''}>
            {variant === 'inline' && (
              <AlertCircle className="inline-block h-3 w-3 mr-1" />
            )}
            {message}
          </div>
        </div>
        
        {dismissible && (
          <button 
            type="button" 
            className="flex-shrink-0 ml-3 text-red-400 dark:text-red-300 hover:text-red-500 dark:hover:text-red-200 focus:outline-none"
            onClick={handleDismiss}
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;