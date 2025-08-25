import React, { forwardRef } from 'react'

const Textarea = forwardRef(({ 
  label,
  error,
  helperText,
  className = '',
  fullWidth = false,
  rows = 4,
  ...props 
}, ref) => {
  const baseClasses = 'px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors resize-vertical'
  const stateClasses = error ? 'border-red-500' : 'border-gray-300'
  const widthClasses = fullWidth ? 'w-full' : ''

  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      
      <textarea
        ref={ref}
        rows={rows}
        className={`${baseClasses} ${stateClasses} ${widthClasses}`}
        {...props}
      />
      
      {error && (
        <p className="text-sm text-red-600 mt-1">{error}</p>
      )}
      
      {helperText && !error && (
        <p className="text-sm text-gray-500 mt-1">{helperText}</p>
      )}
    </div>
  )
})

Textarea.displayName = 'Textarea'

export default Textarea
