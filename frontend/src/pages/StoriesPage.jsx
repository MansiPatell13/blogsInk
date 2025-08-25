import React, { useState, useEffect } from 'react'
import { BookOpen, Filter, Grid, List, Clock, Eye, Heart, MessageSquare, TrendingUp } from 'lucide-react'
import api from '../utils/api'
import BlogCard from '../components/BlogCard'

const StoriesPage = () => {
  const [stories, setStories] = useState([])
  const [filteredStories, setFilteredStories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState('grid')
  const [filters, setFilters] = useState({
    category: '',
    sortBy: 'newest',
    timeRange: '',
    author: ''
  })
  const [categories, setCategories] = useState([])
  const [trendingStories, setTrendingStories] = useState([])

  useEffect(() => {
    fetchStories()
    fetchCategories()
    fetchTrendingStories()
  }, [])

  useEffect(() => {
    filterAndSortStories()
  }, [stories, filters])

  const fetchStories = async () => {
    try {
      const response = await api.get('/blogs/stories')
      setStories(response.data.blogs)
    } catch (error) {
      console.error('Error fetching stories:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await api.get('/blogs/categories')
      setCategories(response.data.categories)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const fetchTrendingStories = async () => {
    try {
      const response = await api.get('/blogs/trending')
      setTrendingStories(response.data.blogs)
    } catch (error) {
      console.error('Error fetching trending stories:', error)
    }
  }

  const filterAndSortStories = () => {
    let filtered = [...stories]

    // Filter by category
    if (filters.category) {
      filtered = filtered.filter(story => story.category === filters.category)
    }

    // Filter by author
    if (filters.author) {
      filtered = filtered.filter(story => 
        story.author.name.toLowerCase().includes(filters.author.toLowerCase())
      )
    }

    // Filter by time range
    if (filters.timeRange) {
      const now = new Date()
      const timeRanges = {
        '1d': new Date(now.getTime() - 24 * 60 * 60 * 1000),
        '1w': new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        '1m': new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
        '3m': new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
      }
      
      if (timeRanges[filters.timeRange]) {
        filtered = filtered.filter(story => 
          new Date(story.createdAt) >= timeRanges[filters.timeRange]
        )
      }
    }

    // Sort stories
    switch (filters.sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        break
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        break
      case 'most-viewed':
        filtered.sort((a, b) => b.views - a.views)
        break
      case 'most-liked':
        filtered.sort((a, b) => b.likes.length - a.likes.length)
        break
      case 'most-commented':
        filtered.sort((a, b) => b.comments.length - a.comments.length)
        break
      case 'trending':
        filtered.sort((a, b) => {
          const aScore = (a.views * 0.3) + (a.likes.length * 0.4) + (a.comments.length * 0.3)
          const bScore = (b.views * 0.3) + (b.likes.length * 0.4) + (b.comments.length * 0.3)
          return bScore - aScore
        })
        break
      default:
        break
    }

    setFilteredStories(filtered)
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const clearFilters = () => {
    setFilters({
      category: '',
      sortBy: 'newest',
      timeRange: '',
      author: ''
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-yellow-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading stories...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Stories</h1>
              <p className="text-gray-600">
                Discover amazing stories from our community of writers
              </p>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search stories by title, author, or content..."
                value={filters.author}
                onChange={(e) => handleFilterChange('author', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
              <BookOpen className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>

            {/* Category Filter */}
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="most-viewed">Most Viewed</option>
              <option value="most-liked">Most Liked</option>
              <option value="most-commented">Most Commented</option>
              <option value="trending">Trending</option>
            </select>

            {/* Time Range */}
            <select
              value={filters.timeRange}
              onChange={(e) => handleFilterChange('timeRange', e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            >
              <option value="">All Time</option>
              <option value="1d">Last 24 Hours</option>
              <option value="1w">Last Week</option>
              <option value="1m">Last Month</option>
              <option value="3m">Last 3 Months</option>
            </select>

            {/* View Mode */}
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-yellow-600 text-white' : 'bg-white text-gray-600'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 ${viewMode === 'list' ? 'bg-yellow-600 text-white' : 'bg-white text-gray-600'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Clear Filters */}
            <button
              onClick={clearFilters}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Trending Stories */}
        {trendingStories.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <TrendingUp className="w-5 h-5 text-yellow-600" />
              <h2 className="text-xl font-semibold text-gray-900">Trending Stories</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trendingStories.slice(0, 3).map((story) => (
                <div key={story._id} className="relative">
                  <BlogCard blog={story} />
                  <div className="absolute top-2 left-2 bg-yellow-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                    Trending
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stories Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            {filteredStories.length} story{filteredStories.length !== 1 ? 'ies' : ''} found
          </p>
          <p className="text-sm text-gray-500">
            Showing {Math.min(filteredStories.length, 12)} of {stories.length} total stories
          </p>
        </div>

        {/* Stories Grid/List */}
        {filteredStories.length > 0 ? (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {filteredStories.map((story) => (
              <div key={story._id}>
                {viewMode === 'grid' ? (
                  <BlogCard blog={story} />
                ) : (
                  <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start space-x-4">
                      <img
                        src={story.imageUrl || '/placeholder.jpg'}
                        alt={story.title}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{story.title}</h3>
                        <p className="text-gray-600 mb-3">{story.excerpt}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {story.readTime} min read
                          </span>
                          <span className="flex items-center">
                            <Eye className="w-4 h-4 mr-1" />
                            {story.views} views
                          </span>
                          <span className="flex items-center">
                            <Heart className="w-4 h-4 mr-1" />
                            {story.likes.length} likes
                          </span>
                          <span className="flex items-center">
                            <MessageSquare className="w-4 h-4 mr-1" />
                            {story.comments.length} comments
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No stories found</h3>
            <p className="text-gray-600 mb-6">
              {filters.category || filters.author || filters.timeRange 
                ? 'Try adjusting your filters to find more stories.'
                : 'No stories have been published yet.'
              }
            </p>
            {filters.category || filters.author || filters.timeRange ? (
              <button
                onClick={clearFilters}
                className="bg-yellow-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-yellow-700 transition-colors"
              >
                Clear Filters
              </button>
            ) : (
              <button className="bg-yellow-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-yellow-700 transition-colors">
                Write First Story
              </button>
            )}
          </div>
        )}

        {/* Load More */}
        {filteredStories.length > 12 && (
          <div className="text-center mt-8">
            <button className="bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors">
              Load More Stories
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default StoriesPage
