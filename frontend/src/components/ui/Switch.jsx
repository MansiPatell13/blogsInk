import React from 'react'

const Switch = ({ 
  checked = false, 
  onChange, 
  disabled = false,
  size = 'md',
  label,
  className = '',
  ...props 
}) => {
  const sizeClasses = {
    sm: 'w-9 h-5',
    md: 'w-11 h-6',
    lg: 'w-14 h-7'
  }

  const thumbSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  const handleChange = (e) => {
    if (onChange && !disabled) {
      onChange(e.target.checked)
    }
  }

  return (
    <div className={`flex items-center ${className}`}>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          className="sr-only peer"
          {...props}
        />
        <div className={`${sizeClasses[size]} bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:transition-all peer-checked:bg-yellow-600 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
        </div>
      </label>
      
      {label && (
        <span className={`ml-3 text-sm font-medium ${disabled ? 'text-gray-400' : 'text-gray-900'}`}>
          {label}
        </span>
      )}
    </div>
  )
}

export default Switch
