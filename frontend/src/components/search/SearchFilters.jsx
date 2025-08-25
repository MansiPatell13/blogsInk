import React, { useState } from 'react'
import { Filter, X, Calendar, User, Tag } from 'lucide-react'

const SearchFilters = ({ darkMode = false }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [selectedTags, setSelectedTags] = useState([])
  const [selectedAuthor, setSelectedAuthor] = useState('')
  const [dateRange, setDateRange] = useState({ from: '', to: '' })
  const [sortBy, setSortBy] = useState('relevance')

  const categories = [
    'Technology',
    'Business',
    'Health',
    'Lifestyle',
    'Travel',
    'Food',
    'Sports',
    'Entertainment',
    'Education',
    'Science'
  ]

  const sortOptions = [
    { value: 'relevance', label: 'Most Relevant' },
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'most-viewed', label: 'Most Viewed' },
    { value: 'most-liked', label: 'Most Liked' },
    { value: 'most-commented', label: 'Most Commented' }
  ]

  const dateRanges = [
    { value: '', label: 'All Time' },
    { value: '1d', label: 'Last 24 Hours' },
    { value: '1w', label: 'Last Week' },
    { value: '1m', label: 'Last Month' },
    { value: '3m', label: 'Last 3 Months' },
    { value: '1y', label: 'Last Year' }
  ]

  const handleTagToggle = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  const clearFilters = () => {
    setSelectedTags([])
    setSelectedAuthor('')
    setDateRange({ from: '', to: '' })
    setSortBy('relevance')
  }

  const hasActiveFilters = selectedTags.length > 0 || selectedAuthor || dateRange.from || dateRange.to || sortBy !== 'relevance'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Filters
        </h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className={`text-sm ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800'}`}
          >
            Clear all
          </button>
        )}
      </div>

      {/* Sort By */}
      <div>
        <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
          Sort by
        </label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg text-sm ${
            darkMode 
              ? 'bg-gray-700 border-gray-600 text-white focus:border-yellow-500' 
              : 'bg-white border-gray-300 text-gray-900 focus:border-yellow-500'
          } focus:outline-none focus:ring-1 focus:ring-yellow-500`}
        >
          {sortOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Categories/Tags */}
      <div>
        <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
          Categories
        </label>
        <div className="space-y-2">
          {categories.map(category => (
            <label key={category} className="flex items-center">
              <input
                type="checkbox"
                checked={selectedTags.includes(category)}
                onChange={() => handleTagToggle(category)}
                className={`w-4 h-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500 ${
                  darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white'
                }`}
              />
              <span className={`ml-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {category}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Date Range */}
      <div>
        <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
          Date Range
        </label>
        <div className="space-y-2">
          <input
            type="date"
            value={dateRange.from}
            onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
            className={`w-full px-3 py-2 border rounded-lg text-sm ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white focus:border-yellow-500' 
                : 'bg-white border-gray-300 text-gray-900 focus:border-yellow-500'
            } focus:outline-none focus:ring-1 focus:ring-yellow-500`}
          />
          <input
            type="date"
            value={dateRange.to}
            onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
            className={`w-full px-3 py-2 border rounded-lg text-sm ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white focus:border-yellow-500' 
                : 'bg-white border-gray-300 text-gray-900 focus:border-yellow-500'
            } focus:outline-none focus:ring-1 focus:ring-yellow-500`}
          />
        </div>
      </div>

      {/* Author */}
      <div>
        <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
          Author
        </label>
        <input
          type="text"
          value={selectedAuthor}
          onChange={(e) => setSelectedAuthor(e.target.value)}
          placeholder="Search by author..."
          className={`w-full px-3 py-2 border rounded-lg text-sm ${
            darkMode 
              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-yellow-500' 
              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-yellow-500'
          } focus:outline-none focus:ring-1 focus:ring-yellow-500`}
        />
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <h4 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
            Active Filters
          </h4>
          <div className="flex flex-wrap gap-2">
            {selectedTags.map(tag => (
              <span
                key={tag}
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                  darkMode 
                    ? 'bg-gray-700 text-gray-300' 
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {tag}
                <button
                  onClick={() => handleTagToggle(tag)}
                  className="ml-1 hover:text-red-500"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {selectedAuthor && (
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                  darkMode 
                    ? 'bg-gray-700 text-gray-300' 
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                Author: {selectedAuthor}
                <button
                  onClick={() => setSelectedAuthor('')}
                  className="ml-1 hover:text-red-500"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {(dateRange.from || dateRange.to) && (
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                  darkMode 
                    ? 'bg-gray-700 text-gray-300' 
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                Date: {dateRange.from || 'Any'} - {dateRange.to || 'Any'}
                <button
                  onClick={() => setDateRange({ from: '', to: '' })}
                  className="ml-1 hover:text-red-500"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchFilters