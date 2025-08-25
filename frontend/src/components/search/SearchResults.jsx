import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Clock, User, Tag, Search } from 'lucide-react'
import BlogCard from '../blog/BlogCard'

const SearchResults = ({ 
  results, 
  query, 
  isLoading, 
  error, 
  darkMode = false, 
  viewMode = 'grid' 
}) => {
  const navigate = useNavigate()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
          <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
            Searching for "{query}"...
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className={`w-16 h-16 ${darkMode ? 'text-gray-600' : 'text-gray-400'} mx-auto mb-4`}>
          <Search />
        </div>
        <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
          Search Error
        </h3>
        <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
          {error}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (results.length === 0 && query) {
    return (
      <div className="text-center py-12">
        <div className={`w-16 h-16 ${darkMode ? 'text-gray-600' : 'text-gray-400'} mx-auto mb-4`}>
          <Search />
        </div>
        <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
          No results found
        </h3>
        <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
          We couldn't find any articles matching "{query}"
        </p>
        <div className="mt-6">
          <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'} mb-3`}>
            Try adjusting your search terms or filters:
          </p>
          <ul className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} space-y-1`}>
            <li>• Check your spelling</li>
            <li>• Try more general keywords</li>
            <li>• Remove some filters</li>
            <li>• Try different search terms</li>
          </ul>
        </div>
      </div>
    )
  }

  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((result) => (
          <BlogCard key={result.id} blog={result} darkMode={darkMode} />
        ))}
      </div>
    )
  }

  // List view
  return (
    <div className="space-y-6">
      {results.map((result) => (
        <article
          key={result.id}
          className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer`}
          onClick={() => navigate(`/blog/${result.slug}`)}
        >
          <div className="flex items-start space-x-4">
            {/* Article Image */}
            <div className="flex-shrink-0">
              <div className={`w-24 h-24 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-lg flex items-center justify-center`}>
                <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {result.title.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>

            {/* Article Content */}
            <div className="flex-1 min-w-0">
              <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2 hover:text-yellow-600 transition-colors`}>
                {result.title}
              </h3>
              
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} text-sm mb-3 line-clamp-2`}>
                {result.excerpt || result.content.substring(0, 150)}...
              </p>

              {/* Article Meta */}
              <div className="flex items-center space-x-4 text-xs">
                <div className={`flex items-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <User className="w-3 h-3 mr-1" />
                  <span>{result.author?.name || 'Anonymous'}</span>
                </div>
                
                <div className={`flex items-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <Clock className="w-3 h-3 mr-1" />
                  <span>{result.readTime || 5} min read</span>
                </div>

                {result.tags && result.tags.length > 0 && (
                  <div className={`flex items-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <Tag className="w-3 h-3 mr-1" />
                    <span>{result.tags[0]}</span>
                    {result.tags.length > 1 && (
                      <span className="ml-1">+{result.tags.length - 1}</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}

export default SearchResults