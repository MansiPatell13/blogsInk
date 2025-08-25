import React, { forwardRef } from 'react'
import { ChevronDown } from 'lucide-react'

const Select = forwardRef(({ 
  options = [],
  label,
  error,
  helperText,
  placeholder = 'Select an option',
  className = '',
  fullWidth = false,
  ...props 
}, ref) => {
  const baseClasses = 'px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors appearance-none bg-white'
  const stateClasses = error ? 'border-red-500' : 'border-gray-300'
  const widthClasses = fullWidth ? 'w-full' : ''

  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      
      <div className="relative">
        <select
          ref={ref}
          className={`${baseClasses} ${stateClasses} ${widthClasses} pr-10`}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>
      
      {error && (
        <p className="text-sm text-red-600 mt-1">{error}</p>
      )}
      
      {helperText && !error && (
        <p className="text-sm text-gray-500 mt-1">{helperText}</p>
      )}
    </div>
  )
})

Select.displayName = 'Select'

export default Select
