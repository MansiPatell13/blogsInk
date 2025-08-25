import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';

const PageTransition = ({ children }) => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [displayLocation, setDisplayLocation] = useState(location);
  
  useEffect(() => {
    if (location !== displayLocation) {
      setIsLoading(true);
      const timeout = setTimeout(() => {
        setDisplayLocation(location);
        setIsLoading(false);
      }, 300); // Short delay for transition
      
      return () => clearTimeout(timeout);
    }
  }, [location, displayLocation]);

  return (
    <div className="page-transition relative">
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 z-50">
          <LoadingSpinner size="lg" color="primary" />
        </div>
      )}
      <div
        className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
      >
        {children}
      </div>
    </div>
  );
};

export default PageTransition;