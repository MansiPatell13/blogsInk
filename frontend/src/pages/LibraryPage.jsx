import React, { useState, useEffect } from 'react'
import { BookOpen, Bookmark, Clock, Eye, Heart, MessageSquare, Filter, Search } from 'lucide-react'
import { useAuth } from '../utils/useAuth.jsx'
import api from '../utils/api'
import BlogCard from '../components/BlogCard'

const LibraryPage = () => {
  const { user } = useAuth()
  const [blogs, setBlogs] = useState([])
  const [filteredBlogs, setFilteredBlogs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [viewMode, setViewMode] = useState('grid')

  const categories = [
    'all',
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

  useEffect(() => {
    if (user) {
      fetchUserLibrary()
    }
  }, [user])

  useEffect(() => {
    filterAndSortBlogs()
  }, [blogs, searchQuery, selectedCategory, sortBy])

  const fetchUserLibrary = async () => {
    try {
      const response = await api.get('/users/library')
      setBlogs(response.data.blogs)
    } catch (error) {
      console.error('Error fetching library:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterAndSortBlogs = () => {
    let filtered = [...blogs]

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(blog =>
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.author.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(blog => blog.category === selectedCategory)
    }

    // Sort blogs
    switch (sortBy) {
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
      default:
        break
    }

    setFilteredBlogs(filtered)
  }

  const handleRemoveFromLibrary = async (blogId) => {
    try {
      await api.delete(`/users/library/${blogId}`)
      setBlogs(blogs.filter(blog => blog._id !== blogId))
    } catch (error) {
      console.error('Error removing from library:', error)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Sign in to access your library</h2>
          <p className="text-gray-600">Your saved articles and bookmarks will appear here.</p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-yellow-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your library...</p>
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
              <h1 className="text-3xl font-bold text-gray-900">My Library</h1>
              <p className="text-gray-600">
                {blogs.length} saved article{blogs.length !== 1 ? 's' : ''} in your collection
              </p>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search your library..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="most-viewed">Most Viewed</option>
              <option value="most-liked">Most Liked</option>
              <option value="most-commented">Most Commented</option>
            </select>

            {/* View Mode */}
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-yellow-600 text-white' : 'bg-white text-gray-600'}`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 ${viewMode === 'list' ? 'bg-yellow-600 text-white' : 'bg-white text-gray-600'}`}
              >
                List
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredBlogs.length > 0 ? (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {filteredBlogs.map((blog) => (
              <div key={blog._id} className="relative">
                {viewMode === 'grid' ? (
                  <BlogCard blog={blog} />
                ) : (
                  <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start space-x-4">
                      <img
                        src={blog.imageUrl || '/placeholder.jpg'}
                        alt={blog.title}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{blog.title}</h3>
                        <p className="text-gray-600 mb-3">{blog.excerpt}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {blog.readTime} min read
                          </span>
                          <span className="flex items-center">
                            <Eye className="w-4 h-4 mr-1" />
                            {blog.views} views
                          </span>
                          <span className="flex items-center">
                            <Heart className="w-4 h-4 mr-1" />
                            {blog.likes.length} likes
                          </span>
                          <span className="flex items-center">
                            <MessageSquare className="w-4 h-4 mr-1" />
                            {blog.comments.length} comments
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Remove Button */}
                <button
                  onClick={() => handleRemoveFromLibrary(blog._id)}
                  className="absolute top-2 right-2 w-8 h-8 bg-red-100 hover:bg-red-200 text-red-600 rounded-full flex items-center justify-center transition-colors"
                  title="Remove from library"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchQuery || selectedCategory !== 'all' ? 'No matching articles found' : 'Your library is empty'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || selectedCategory !== 'all' 
                ? 'Try adjusting your search or filters.'
                : 'Start building your collection by saving interesting articles you find.'
              }
            </p>
            {!searchQuery && selectedCategory === 'all' && (
              <button className="bg-yellow-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-yellow-700 transition-colors">
                Explore Articles
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default LibraryPage
