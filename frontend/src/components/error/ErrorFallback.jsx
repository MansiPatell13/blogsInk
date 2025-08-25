import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

const ErrorFallback = ({ 
  error, 
  resetErrorBoundary,
  title = 'Something went wrong',
  showError = process.env.NODE_ENV !== 'production',
  showReset = true,
  resetText = 'Try again',
  className = ''
}) => {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-lg mx-auto ${className}`}>
      <div className="flex items-center space-x-3 text-red-500 mb-4">
        <AlertTriangle className="h-8 w-8" />
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>
      
      <div className="mb-6">
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          We're sorry, but an unexpected error occurred. Our team has been notified.
        </p>
        
        {showError && error && (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-md">
            <p className="font-mono text-sm text-red-600 dark:text-red-400 whitespace-pre-wrap break-words">
              {error.toString()}
            </p>
          </div>
        )}
      </div>
      
      {showReset && resetErrorBoundary && (
        <div className="flex justify-end">
          <button
            onClick={resetErrorBoundary}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            <span>{resetText}</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ErrorFallback;