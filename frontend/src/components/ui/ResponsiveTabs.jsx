import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import useMediaQuery from '../../utils/useMediaQuery';

const ResponsiveTabs = ({
  tabs,
  defaultTab,
  onChange,
  className = '',
  variant = 'underline', // underline, pills, bordered
  mobileBreakpoint = 'md',
  dropdownLabel = 'Menu',
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab || (tabs.length > 0 ? tabs[0].id : null));
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const isMobile = useMediaQuery(`(max-width: ${mobileBreakpoint === 'sm' ? '640px' : mobileBreakpoint === 'md' ? '768px' : '1024px'})`);
  
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setIsDropdownOpen(false);
    if (onChange) {
      onChange(tabId);
    }
  };
  
  // Get the active tab content
  const activeTabContent = tabs.find(tab => tab.id === activeTab)?.content;
  
  // Generate tab classes based on variant
  const getTabClasses = (isActive) => {
    const baseClasses = 'px-4 py-2 transition-colors focus:outline-none';
    
    switch (variant) {
      case 'pills':
        return `${baseClasses} rounded-full ${isActive 
          ? 'bg-primary-500 text-white' 
          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`;
      
      case 'bordered':
        return `${baseClasses} border ${isActive 
          ? 'border-primary-500 text-primary-500' 
          : 'border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-600'} rounded-lg`;
      
      case 'underline':
      default:
        return `${baseClasses} ${isActive 
          ? 'border-b-2 border-primary-500 text-primary-500' 
          : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'}`;
    }
  };
  
  // Mobile dropdown view
  if (isMobile) {
    const activeTabLabel = tabs.find(tab => tab.id === activeTab)?.label || dropdownLabel;
    
    return (
      <div className={`responsive-tabs ${className}`}>
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full flex items-center justify-between px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-left"
          >
            <span>{activeTabLabel}</span>
            <ChevronDown className={`ml-2 h-5 w-5 transition-transform ${isDropdownOpen ? 'transform rotate-180' : ''}`} />
          </button>
          
          {isDropdownOpen && (
            <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`block w-full text-left px-4 py-2 ${tab.id === activeTab 
                    ? 'bg-gray-100 dark:bg-gray-700 text-primary-500' 
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}
        </div>
        
        <div className="mt-4">
          {activeTabContent}
        </div>
      </div>
    );
  }
  
  // Desktop tabs view
  return (
    <div className={`responsive-tabs ${className}`}>
      <div className={`flex ${variant === 'underline' ? 'border-b border-gray-200 dark:border-gray-700' : 'space-x-2'}`}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={getTabClasses(tab.id === activeTab)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      <div className="mt-4">
        {activeTabContent}
      </div>
    </div>
  );
};

export default ResponsiveTabs;