import React, { useState, useEffect } from 'react';

const FormInput = ({
  id,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  validate,
  required = false,
  className = '',
  disabled = false,
  autoComplete,
  onBlur,
  icon: Icon,
}) => {
  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Validate on value change if the field has been touched
  useEffect(() => {
    if (touched && validate) {
      setError(validate(value));
    }
  }, [value, touched, validate]);

  const handleBlur = (e) => {
    setTouched(true);
    if (validate) {
      setError(validate(value));
    }
    if (onBlur) onBlur(e);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className={`block text-sm font-medium mb-1 ${error ? 'text-red-500' : 'text-gray-700 dark:text-gray-300'}`}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400" />
          </div>
        )}
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete={autoComplete}
          className={`
            w-full px-4 py-2 rounded-lg border 
            ${Icon ? 'pl-10' : ''}
            ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 
              'border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500'}
            ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white dark:bg-gray-800'}
            transition-all duration-200
            dark:text-white
          `}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${id}-error` : undefined}
        />
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-1 text-sm text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default FormInput;