import React from 'react';
import SkeletonLoader from './SkeletonLoader';

const LoadingPlaceholder = ({ isLoading, children, type = 'text', lines = 1, className = '' }) => {
  if (!isLoading) return children;
  
  return (
    <div className={`loading-placeholder ${className}`}>
      <SkeletonLoader type={type} lines={lines} />
    </div>
  );
};

export default LoadingPlaceholder;