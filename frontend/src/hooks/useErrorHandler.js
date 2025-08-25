import { useState, useCallback } from 'react';
import { useToast } from '../contexts/ToastContext';
import { formatApiError, extractValidationErrors } from '../utils/apiErrorHandler';

/**
 * Custom hook for handling errors consistently across the application
 * 
 * @param {Object} options - Configuration options
 * @param {boolean} options.showToast - Whether to show toast notifications for errors
 * @param {boolean} options.logErrors - Whether to log errors to console
 * @returns {Object} Error handling utilities
 */
const useErrorHandler = (options = {}) => {
  const { showToast = true, logErrors = process.env.NODE_ENV !== 'production' } = options;
  
  // Get toast function from context if available
  const toast = useToast();
  
  // State for tracking field-specific validation errors
  const [fieldErrors, setFieldErrors] = useState({});
  
  // State for tracking general error message
  const [error, setError] = useState(null);
  
  /**
   * Handle API errors
   * @param {Error|Object} err - The error object
   * @param {Object} customOptions - Additional options
   */
  const handleError = useCallback((err, customOptions = {}) => {
    const formattedError = formatApiError(err);
    
    // Log error if enabled
    if (logErrors) {
      console.error('Error handled by useErrorHandler:', formattedError);
    }
    
    // Set general error
    setError(formattedError);
    
    // Extract and set field validation errors if present
    const validationErrors = extractValidationErrors(formattedError);
    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
    }
    
    // Show toast notification if enabled and toast function is available
    if (showToast && toast && typeof toast.error === 'function') {
      toast.error(customOptions.toastMessage || formattedError.message);
    }
    
    // Call custom error handler if provided
    if (customOptions.onError && typeof customOptions.onError === 'function') {
      customOptions.onError(formattedError);
    }
    
    return formattedError;
  }, [toast, showToast, logErrors]);
  
  /**
   * Clear all errors
   */
  const clearErrors = useCallback(() => {
    setError(null);
    setFieldErrors({});
  }, []);
  
  /**
   * Clear a specific field error
   * @param {string} fieldName - The name of the field to clear
   */
  const clearFieldError = useCallback((fieldName) => {
    setFieldErrors(prev => {
      const updated = { ...prev };
      delete updated[fieldName];
      return updated;
    });
  }, []);
  
  return {
    error,
    fieldErrors,
    handleError,
    clearErrors,
    clearFieldError,
    setFieldErrors,
    hasErrors: !!error || Object.keys(fieldErrors).length > 0
  };
};

export default useErrorHandler;