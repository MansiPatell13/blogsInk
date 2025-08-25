import React from 'react';
import LoadingSpinner from './LoadingSpinner';

const LoadingOverlay = ({ isLoading, message = 'Loading...', children, blur = true }) => {
  if (!isLoading) return children;

  return (
    <div className="relative">
      {/* Render children with blur if specified */}
      <div className={blur ? 'filter blur-sm pointer-events-none' : ''}>
        {children}
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 dark:bg-gray-900/70 z-50">
        <LoadingSpinner size="lg" color="primary" />
        {message && (
          <p className="mt-4 text-gray-700 dark:text-gray-300 font-medium">{message}</p>
        )}
      </div>
    </div>
  );
};

export default LoadingOverlay;