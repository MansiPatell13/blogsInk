import React, { useState } from 'react';

const FormCheckbox = ({
  id,
  label,
  checked,
  onChange,
  required = false,
  className = '',
  disabled = false,
  error: externalError,
}) => {
  const [touched, setTouched] = useState(false);
  const error = touched && required && !checked ? 'This field is required' : externalError;

  const handleBlur = () => {
    setTouched(true);
  };

  return (
    <div className={`flex items-start mb-4 ${className}`}>
      <div className="flex items-center h-5">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          onBlur={handleBlur}
          disabled={disabled}
          className={`
            w-4 h-4 rounded
            ${error ? 'border-red-500 focus:ring-red-500' : 
              'border-gray-300 dark:border-gray-600 focus:ring-primary-500'}
            ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white dark:bg-gray-800'}
            transition-colors duration-200
            text-primary-600 focus:ring-2
          `}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${id}-error` : undefined}
        />
      </div>
      <div className="ml-3 text-sm">
        <label 
          htmlFor={id} 
          className={`font-medium ${disabled ? 'text-gray-400' : error ? 'text-red-500' : 'text-gray-700 dark:text-gray-300'}`}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {error && (
          <p id={`${id}-error`} className="mt-1 text-sm text-red-500" role="alert">
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default FormCheckbox;