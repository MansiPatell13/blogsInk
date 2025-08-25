import React from 'react';

const SkeletonLoader = ({ type = 'text', lines = 1, className = '' }) => {
  // Different skeleton types
  const renderSkeleton = () => {
    switch (type) {
      case 'avatar':
        return (
          <div 
            className="rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"
            style={{ width: '48px', height: '48px' }}
          />
        );
      
      case 'image':
        return (
          <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
        );
      
      case 'card':
        return (
          <div className="w-full rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="h-48 bg-gray-200 dark:bg-gray-700 animate-pulse" />
            <div className="p-4 space-y-3">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-2/3" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-4/5" />
            </div>
          </div>
        );
      
      case 'button':
        return (
          <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
        );
      
      case 'input':
        return (
          <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
        );
      
      case 'text':
      default:
        return (
          <div className="space-y-2 w-full">
            {[...Array(lines)].map((_, i) => (
              <div 
                key={i} 
                className={`h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse ${i === lines - 1 && lines > 1 ? 'w-4/5' : 'w-full'}`} 
              />
            ))}
          </div>
        );
    }
  };

  return (
    <div className={`skeleton-loader ${className}`} aria-hidden="true">
      {renderSkeleton()}
    </div>
  );
};

export default SkeletonLoader;