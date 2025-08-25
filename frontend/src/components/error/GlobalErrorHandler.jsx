import React, { useEffect } from 'react';
import { useToast } from '../../contexts/ToastContext';

/**
 * Component that sets up global error handling for the application
 * Catches unhandled errors and displays them as toast notifications
 */
const GlobalErrorHandler = ({ children }) => {
  const toast = useToast();
  
  useEffect(() => {
    // Handler for unhandled promise rejections
    const handleUnhandledRejection = (event) => {
      event.preventDefault();
      console.error('Unhandled Promise Rejection:', event.reason);
      
      // Show toast notification
      if (toast && typeof toast.error === 'function') {
        toast.error('An unexpected error occurred. Please try again.');
      }
    };
    
    // Handler for uncaught exceptions
    const handleError = (event) => {
      event.preventDefault();
      console.error('Uncaught Error:', event.error);
      
      // Show toast notification
      if (toast && typeof toast.error === 'function') {
        toast.error('An unexpected error occurred. Please try again.');
      }
    };
    
    // Add event listeners
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleError);
    
    // Clean up event listeners on unmount
    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleError);
    };
  }, [toast]);
  
  // This component doesn't render anything itself, just returns its children
  return children;
};

export default GlobalErrorHandler;