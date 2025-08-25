import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Grid, List, Search } from 'lucide-react'
import api from '../utils/api'
import BlogCard from '../components/blog/BlogCard'
import { SearchBar, SearchResults, SearchFilters, useSearch } from '../components/search'
import { MetaTags } from '../components/seo'

const SearchPage = () => {
  const [searchParams] = useSearchParams()
  const [viewMode, setViewMode] = useState('grid')
  const { query, results, isLoading, error, performSearch, filters } = useSearch()
  
  // Get theme from localStorage or context if available
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme')
    return savedTheme === 'dark'
  })
  
  // Listen for theme changes
  useEffect(() => {
    const handleThemeChange = () => {
      setDarkMode(localStorage.getItem('theme') === 'dark')
    }
    
    window.addEventListener('themeChange', handleThemeChange)
    return () => window.removeEventListener('themeChange', handleThemeChange)
  }, [])

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

  useEffect(() => {
    if (query) {
      performSearch()
    }
  }, [query, filters])

  // Toggle view mode between grid and list
  const toggleViewMode = () => {
    setViewMode(prev => prev === 'grid' ? 'list' : 'grid')
  }

  if (!query) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <MetaTags 
          title="Search | BlogsInk"
          description="Search for articles, authors, and topics on BlogsInk"
          keywords="search, blogs, articles, authors, topics"
        />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <Search className={`w-16 h-16 ${darkMode ? 'text-gray-600' : 'text-gray-400'} mx-auto mb-6`} />
            <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Search BlogsInk</h1>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-8`}>
              Find articles, authors, and topics that interest you
            </p>
            
            <div className="max-w-2xl mx-auto">
              <SearchBar 
                placeholder="Search for blogs, authors, topics..."
                darkMode={darkMode}
                autoFocus
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <MetaTags 
        title={`Search results for "${query}" | BlogsInk`}
        description={`Search results for ${query} on BlogsInk`}
        keywords={`search, ${query}, blogs, articles`}
      />
      
      {/* Search Header */}
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-2xl">
            <SearchBar 
              defaultValue={query}
              placeholder="Search for blogs, authors, topics..."
              darkMode={darkMode}
            />
          </div>
          
          <div className="mt-4 flex items-center justify-between">
            <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
              {isLoading ? 'Searching...' : `${results.length} result${results.length !== 1 ? 's' : ''} found`}
            </p>
            <div className="flex items-center space-x-4">
              {/* View Mode Toggle */}
              <div className={`flex border ${darkMode ? 'border-gray-700' : 'border-gray-300'} rounded-lg overflow-hidden`}>
                <button
                  onClick={toggleViewMode}
                  className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-yellow-600 text-white' : darkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-600'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={toggleViewMode}
                  className={`px-3 py-2 ${viewMode === 'list' ? 'bg-yellow-600 text-white' : darkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-600'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-6 sticky top-8`}>
              <SearchFilters darkMode={darkMode} />
            </div>
          </div>

          {/* Search Results */}
          <div className="flex-1">
            <SearchResults 
              results={results}
              query={query}
              isLoading={isLoading}
              error={error}
              darkMode={darkMode}
              viewMode={viewMode}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchPage
