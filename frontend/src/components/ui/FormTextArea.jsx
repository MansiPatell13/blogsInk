import React, { useState, useEffect } from 'react';

const FormTextArea = ({
  id,
  label,
  placeholder,
  value,
  onChange,
  validate,
  required = false,
  className = '',
  disabled = false,
  rows = 4,
  maxLength,
  onBlur,
}) => {
  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);
  const [charCount, setCharCount] = useState(0);

  // Update character count when value changes
  useEffect(() => {
    setCharCount(value?.length || 0);
  }, [value]);

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
      <textarea
        id={id}
        value={value}
        onChange={onChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        maxLength={maxLength}
        className={`
          w-full px-4 py-2 rounded-lg border 
          ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 
            'border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500'}
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white dark:bg-gray-800'}
          transition-all duration-200
          dark:text-white
          resize-y
        `}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      <div className="flex justify-between mt-1">
        {error && (
          <p id={`${id}-error`} className="text-sm text-red-500" role="alert">
            {error}
          </p>
        )}
        {maxLength && (
          <p className={`text-xs ${charCount > maxLength * 0.9 ? 'text-amber-500' : 'text-gray-500'}`}>
            {charCount}/{maxLength}
          </p>
        )}
      </div>
    </div>
  );
};

export default FormTextArea;