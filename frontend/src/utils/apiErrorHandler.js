/**
 * Utility for handling API errors consistently throughout the application
 */

// Common error status codes and their user-friendly messages
const ERROR_MESSAGES = {
  // Client errors (4xx)
  400: 'Invalid request. Please check your input and try again.',
  401: 'You need to log in to access this resource.',
  403: 'You don\'t have permission to access this resource.',
  404: 'The requested resource was not found.',
  409: 'There was a conflict with the current state of the resource.',
  422: 'The provided data is invalid or incomplete.',
  429: 'Too many requests. Please try again later.',
  
  // Server errors (5xx)
  500: 'An unexpected server error occurred. Please try again later.',
  502: 'Bad gateway. The server is temporarily unavailable.',
  503: 'Service unavailable. Please try again later.',
  504: 'Gateway timeout. The server took too long to respond.'
};

/**
 * Formats an error response from an API call
 * @param {Error|Object} error - The error object from the API call
 * @returns {Object} Formatted error with message, status, and details
 */
export const formatApiError = (error) => {
  // Default error structure
  const formattedError = {
    message: 'An unexpected error occurred. Please try again.',
    status: null,
    details: null,
    originalError: error
  };
  
  // Handle Axios errors
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    const { status, data } = error.response;
    formattedError.status = status;
    
    // Use predefined message or from response
    formattedError.message = ERROR_MESSAGES[status] || 
      (data && data.message) || 
      formattedError.message;
    
    // Include any additional details from the response
    if (data && data.errors) {
      formattedError.details = data.errors;
    }
  } else if (error.request) {
    // The request was made but no response was received
    formattedError.message = 'No response received from the server. Please check your connection.';
  } else if (error.message) {
    // Something happened in setting up the request that triggered an Error
    formattedError.message = error.message;
  }
  
  return formattedError;
};

/**
 * Handles API errors by formatting them and optionally showing a toast notification
 * @param {Error|Object} error - The error object from the API call
 * @param {Function} [showToast] - Optional toast notification function
 * @param {Object} [options] - Additional options
 * @returns {Object} Formatted error object
 */
export const handleApiError = (error, showToast, options = {}) => {
  const formattedError = formatApiError(error);
  
  // Log the error to console in development
  if (process.env.NODE_ENV !== 'production') {
    console.error('API Error:', formattedError);
  }
  
  // Show toast notification if function provided
  if (showToast && typeof showToast === 'function') {
    showToast({
      type: 'error',
      message: options.customMessage || formattedError.message,
      ...options.toastOptions
    });
  }
  
  return formattedError;
};

/**
 * Extracts field-specific validation errors from API response
 * @param {Object} error - The formatted error object
 * @returns {Object} Field-specific errors mapping
 */
export const extractValidationErrors = (error) => {
  const fieldErrors = {};
  
  if (error && error.details) {
    // Handle array of errors
    if (Array.isArray(error.details)) {
      error.details.forEach(detail => {
        if (detail.field) {
          fieldErrors[detail.field] = detail.message;
        }
      });
    } 
    // Handle object with field keys
    else if (typeof error.details === 'object') {
      Object.keys(error.details).forEach(field => {
        fieldErrors[field] = error.details[field];
      });
    }
  }
  
  return fieldErrors;
};

export default {
  formatApiError,
  handleApiError,
  extractValidationErrors
};