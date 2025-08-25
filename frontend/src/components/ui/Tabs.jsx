import React, { useState } from 'react'

const Tabs = ({ 
  tabs = [], 
  defaultTab = 0,
  className = '',
  onChange,
  variant = 'default'
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab)

  const handleTabClick = (index) => {
    setActiveTab(index)
    if (onChange) {
      onChange(index, tabs[index])
    }
  }

  const variantClasses = {
    default: {
      tab: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
      activeTab: 'border-yellow-500 text-yellow-600',
      content: 'border-gray-200'
    },
    pills: {
      tab: 'rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100',
      activeTab: 'bg-yellow-100 text-yellow-700',
      content: ''
    }
  }

  const styles = variantClasses[variant]

  return (
    <div className={className}>
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => handleTabClick(index)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                index === activeTab 
                  ? styles.activeTab 
                  : styles.tab
              }`}
            >
              {tab.icon && <tab.icon className="w-4 h-4 inline mr-2" />}
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className={`mt-4 ${styles.content}`}>
        {tabs[activeTab]?.content}
      </div>
    </div>
  )
}

export default Tabs
