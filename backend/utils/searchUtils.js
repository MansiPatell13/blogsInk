const Blog = require('../models/Blog')
const User = require('../models/User')
const Category = require('../models/Category')
const Tag = require('../models/Tag')
const SearchHistory = require('../models/SearchHistory')

/**
 * Advanced search for blogs with filtering, sorting, and pagination
 * @param {Object} options - Search options
 * @param {string} options.query - Search query
 * @param {string} options.category - Category filter
 * @param {Array} options.tags - Tags filter
 * @param {string} options.author - Author filter
 * @param {Object} options.dateRange - Date range filter
 * @param {string} options.sortBy - Sort field
 * @param {string} options.sortOrder - Sort order (asc/desc)
 * @param {number} options.page - Page number
 * @param {number} options.limit - Items per page
 * @param {string} options.userId - User ID for search history
 * @returns {Promise<Object>} Search results with pagination info
 */
async function advancedSearch(options) {
  try {
    const {
      query = '',
      category,
      tags = [],
      author,
      dateRange = {},
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 10,
      userId
    } = options

    // Build search filter
    const filter = {
      status: 'published' // Only search published blogs
    }

    // Text search
    if (query && query.trim() !== '') {
      filter.$or = [
        { title: { $regex: query, $options: 'i' } },
        { content: { $regex: query, $options: 'i' } },
        { excerpt: { $regex: query, $options: 'i' } }
      ]
    }

    // Category filter
    if (category) {
      filter.category = category
    }

    // Tags filter
    if (tags && tags.length > 0) {
      filter.tags = { $in: tags }
    }

    // Author filter
    if (author) {
      filter.author = author
    }

    // Date range filter
    if (dateRange.start || dateRange.end) {
      filter.createdAt = {}
      if (dateRange.start) {
        filter.createdAt.$gte = new Date(dateRange.start)
      }
      if (dateRange.end) {
        filter.createdAt.$lte = new Date(dateRange.end)
      }
    }

    // Sort options
    const sort = {}
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1

    // Execute search query with pagination
    const blogs = await Blog.find(filter)
      .populate('author', 'name avatar')
      .populate('category', 'name slug')
      .populate('tags', 'name displayName')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .exec()

    // Get total count for pagination
    const total = await Blog.countDocuments(filter)

    // Save search history if user is authenticated
    if (userId) {
      await saveSearchHistory({
        userId,
        query,
        filters: {
          category,
          tags,
          author,
          dateRange,
          sortBy
        },
        resultCount: total
      })
    }

    return {
      blogs,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    }
  } catch (error) {
    console.error('Advanced search error:', error)
    throw error
  }
}

/**
 * Get search suggestions for autocomplete
 * @param {string} query - Search query
 * @param {number} limit - Maximum number of suggestions
 * @returns {Promise<Object>} Suggestions for blogs, tags, categories, and authors
 */
async function getSearchSuggestions(query, limit = 5) {
  try {
    if (!query || query.trim() === '') {
      return {
        blogs: [],
        tags: [],
        categories: [],
        authors: []
      }
    }

    // Get blog title suggestions
    const blogs = await Blog.find(
      { 
        title: { $regex: query, $options: 'i' },
        status: 'published'
      },
      { title: 1, slug: 1 }
    ).limit(limit)

    // Get tag suggestions
    const tags = await Tag.find(
      { 
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { displayName: { $regex: query, $options: 'i' } }
        ]
      },
      { name: 1, displayName: 1 }
    ).limit(limit)

    // Get category suggestions
    const categories = await Category.find(
      { name: { $regex: query, $options: 'i' } },
      { name: 1, slug: 1 }
    ).limit(limit)

    // Get author suggestions
    const authors = await User.find(
      { name: { $regex: query, $options: 'i' } },
      { name: 1, avatar: 1 }
    ).limit(limit)

    return {
      blogs,
      tags,
      categories,
      authors
    }
  } catch (error) {
    console.error('Get search suggestions error:', error)
    throw error
  }
}

/**
 * Save search history for a user
 * @param {Object} data - Search history data
 * @param {string} data.userId - User ID
 * @param {string} data.query - Search query
 * @param {Object} data.filters - Search filters
 * @param {number} data.resultCount - Number of search results
 * @returns {Promise<Object>} Created search history
 */
async function saveSearchHistory(data) {
  try {
    const { userId, query, filters, resultCount } = data

    // Don't save empty searches
    if (!query || query.trim() === '') {
      return null
    }

    const searchHistory = new SearchHistory({
      user: userId,
      query,
      filters,
      resultCount
    })

    return await searchHistory.save()
  } catch (error) {
    console.error('Save search history error:', error)
    return null
  }
}

/**
 * Get search history for a user
 * @param {string} userId - User ID
 * @param {number} limit - Maximum number of history items
 * @returns {Promise<Array>} User's search history
 */
async function getUserSearchHistory(userId, limit = 10) {
  try {
    return await SearchHistory.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec()
  } catch (error) {
    console.error('Get user search history error:', error)
    return []
  }
}

/**
 * Clear search history for a user
 * @param {string} userId - User ID
 * @returns {Promise<boolean>} Success status
 */
async function clearUserSearchHistory(userId) {
  try {
    await SearchHistory.deleteMany({ user: userId })
    return true
  } catch (error) {
    console.error('Clear user search history error:', error)
    return false
  }
}

module.exports = {
  advancedSearch,
  getSearchSuggestions,
  saveSearchHistory,
  getUserSearchHistory,
  clearUserSearchHistory
}