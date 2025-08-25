import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const Accordion = ({ items, className = '' }) => {
  const [openIndex, setOpenIndex] = useState(null)

  const toggleItem = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {items.map((item, index) => (
        <div key={index} className="border border-gray-200 rounded-lg">
          <button
            onClick={() => toggleItem(index)}
            className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <span className="font-medium text-gray-900">{item.title}</span>
            <ChevronDown 
              className={`w-5 h-5 text-gray-500 transition-transform ${
                openIndex === index ? 'rotate-180' : ''
              }`} 
            />
          </button>
          
          {openIndex === index && (
            <div className="px-4 pb-3 border-t border-gray-200">
              <div className="pt-3 text-gray-600">
                {item.content}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default Accordion
