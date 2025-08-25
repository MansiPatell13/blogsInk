import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'

const DropdownMenu = ({ 
  trigger, 
  items, 
  align = 'left',
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  const handleItemClick = (item) => {
    if (item.onClick) {
      item.onClick()
    }
    setIsOpen(false)
  }

  const alignClasses = {
    left: 'left-0',
    right: 'right-0',
    center: 'left-1/2 transform -translate-x-1/2'
  }

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      {/* Trigger */}
      <div onClick={toggleDropdown} className="cursor-pointer">
        {trigger}
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className={`absolute top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 ${alignClasses[align]}`}>
          {items.map((item, index) => (
            <div key={index}>
              {item.separator ? (
                <hr className="my-2 border-gray-200" />
              ) : (
                <button
                  onClick={() => handleItemClick(item)}
                  disabled={item.disabled}
                  className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors flex items-center justify-between ${
                    item.disabled ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {item.icon && <item.icon className="w-4 h-4" />}
                    <span>{item.label}</span>
                  </div>
                  {item.checked && <Check className="w-4 h-4 text-yellow-600" />}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Convenience component for common dropdown patterns
DropdownMenu.Trigger = ({ children, className = '', ...props }) => (
  <button
    className={`inline-flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${className}`}
    {...props}
  >
    {children}
    <ChevronDown className="w-4 h-4 ml-2" />
  </button>
)

export default DropdownMenu
