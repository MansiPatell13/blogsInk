import React, { useState, useEffect } from 'react';

const FormSelect = ({
  id,
  label,
  value,
  onChange,
  options,
  validate,
  required = false,
  className = '',
  disabled = false,
  placeholder = 'Select an option',
  onBlur,
}) => {
  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);

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
      <select
        id={id}
        value={value}
        onChange={onChange}
        onBlur={handleBlur}
        disabled={disabled}
        className={`
          w-full px-4 py-2 rounded-lg border appearance-none
          ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 
            'border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500'}
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white dark:bg-gray-800'}
          transition-all duration-200
          dark:text-white
          bg-no-repeat bg-right
        `}
        style={{ 
          backgroundImage: "url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')",
          backgroundPosition: "right 0.7rem top 50%",
          backgroundSize: "0.65rem auto",
          paddingRight: "2rem"
        }}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${id}-error` : undefined}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p id={`${id}-error`} className="mt-1 text-sm text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default FormSelect;