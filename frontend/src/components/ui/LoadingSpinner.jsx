import React from 'react';

const LoadingSpinner = ({ size = 'md', color = 'primary', className = '' }) => {
  // Size variants
  const sizeClasses = {
    xs: 'h-4 w-4 border-2',
    sm: 'h-6 w-6 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-3',
    xl: 'h-16 w-16 border-4',
  };

  // Color variants
  const colorClasses = {
    primary: 'border-primary-600',
    secondary: 'border-gray-600',
    white: 'border-white',
    black: 'border-black',
    yellow: 'border-yellow-500',
  };

  return (
    <div
      className={`
        inline-block rounded-full
        border-solid border-t-transparent
        animate-spin
        ${sizeClasses[size] || sizeClasses.md}
        ${colorClasses[color] || colorClasses.primary}
        ${className}
      `}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default LoadingSpinner;