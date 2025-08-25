import React from 'react';
import { Wifi, RefreshCw } from 'lucide-react';

const NetworkError = ({
  title = 'Connection Error',
  message = 'Unable to connect to the server. Please check your internet connection and try again.',
  onRetry,
  retryText = 'Try Again',
  className = '',
}) => {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-lg mx-auto ${className}`}>
      <div className="flex flex-col items-center text-center">
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-full mb-6">
          <Wifi className="h-12 w-12 text-red-500" />
        </div>
        
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          {title}
        </h2>
        
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          {message}
        </p>
        
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center space-x-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
          >
            <RefreshCw className="h-5 w-5" />
            <span>{retryText}</span>
          </button>
        )}
        
        <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
          <p>If the problem persists, please contact support.</p>
        </div>
      </div>
    </div>
  );
};

export default NetworkError;