import React, { useState, useEffect, useRef } from 'react';
import { Menu, X } from 'lucide-react';

const ResponsiveMenu = ({
  children,
  className = '',
  buttonClassName = '',
  menuClassName = '',
  openIcon = Menu,
  closeIcon = X,
  align = 'right',
  width = 'auto',
  breakpoint = 'md' // When to show the hamburger menu
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const IconOpen = openIcon;
  const IconClose = closeIcon;

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close menu when pressing escape key
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, []);

  // Alignment classes
  const alignmentClasses = {
    'left': 'left-0',
    'right': 'right-0',
    'center': 'left-1/2 transform -translate-x-1/2'
  };

  // Width classes
  const widthClasses = {
    'auto': 'w-auto',
    'full': 'w-full',
    'sm': 'w-56',
    'md': 'w-64',
    'lg': 'w-72',
    'xl': 'w-80'
  };

  // Breakpoint classes for showing/hiding the menu button
  const breakpointClasses = {
    'sm': 'sm:hidden',
    'md': 'md:hidden',
    'lg': 'lg:hidden',
    'xl': 'xl:hidden',
    '2xl': '2xl:hidden',
    'none': ''
  };

  return (
    <div className={`relative ${className}`} ref={menuRef}>
      {/* Mobile menu button */}
      <button
        type="button"
        className={`flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white focus:outline-none ${breakpointClasses[breakpoint]} ${buttonClassName}`}
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="sr-only">{isOpen ? 'Close menu' : 'Open menu'}</span>
        {isOpen ? <IconClose className="h-6 w-6" /> : <IconOpen className="h-6 w-6" />}
      </button>

      {/* Desktop menu */}
      <div className={`hidden ${breakpoint}:flex ${menuClassName}`}>
        {children}
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div
        className={`absolute z-50 mt-2 ${alignmentClasses[align]} ${widthClasses[width]} origin-top-right bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none transition transform ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'} ${breakpointClasses[breakpoint] ? 'block' : 'hidden'}`}
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="menu-button"
      >
        <div className="py-1" role="none">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ResponsiveMenu;