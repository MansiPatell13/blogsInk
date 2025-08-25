const express = require('express')
const Blog = require('../models/Blog')
const User = require('../models/User')
const Tag = require('../models/Tag')
const Category = require('../models/Category')
const SearchHistory = require('../models/SearchHistory')
const { auth } = require('../middleware/auth')

const router = express.Router()

// Advanced search endpoint
router.get('/', async (req, res) => {
  try {
    const { 
      q = '', 
      category, 
      tags, 
      author, 
      startDate, 
      endDate, 
      sort = 'recent',
      page = 1, 
      limit = 10 
    } = req.query
    
    // Build query object
    let query = { published: true }
    
    // Text search if query provided
    if (q) {
      query.$text = { $search: q }
    }
    
    // Filter by category
    if (category) {
      query.category = category
    }
    
    // Filter by tags (comma separated list)
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim())
      query.tags = { $in: tagArray }
    }
    
    // Filter by author
    if (author) {
      query.author = author
    }
    
    // Filter by date range
    if (startDate || endDate) {
      query.createdAt = {}
      
      if (startDate) {
        query.createdAt.$gte = new Date(startDate)
      }
      
      if (endDate) {
        query.createdAt.$lte = new Date(endDate)
      }
    }
    
    // Determine sort order
    let sortOption = {}
    switch (sort) {
      case 'popular':
        sortOption = { views: -1 }
        break
      case 'likes':
        sortOption = { 'likes.length': -1 }
        break
      case 'oldest':
        sortOption = { createdAt: 1 }
        break
      case 'recent':
      default:
        sortOption = { createdAt: -1 }
    }
    
    // Execute search query
    const blogs = await Blog.find(query)
      .populate('author', 'name avatar')
      .populate('category', 'name slug')
      .populate('tags', 'name displayName')
      .sort(sortOption)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec()
    
    const total = await Blog.countDocuments(query)
    
    // Save search history if user is authenticated
    if (req.user) {
      const searchHistory = new SearchHistory({
        user: req.user._id,
        query: q,
        filters: {
          category,
          tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
          author,
          dateRange: {
            startDate: startDate ? new Date(startDate) : null,
            endDate: endDate ? new Date(endDate) : null
          },
          sortBy: sort
        },
        resultCount: total
      })
      
      await searchHistory.save()
    }
    
    res.json({
      blogs,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      total
    })
  } catch (error) {
    console.error('Search error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Get search suggestions (autocomplete)
router.get('/suggestions', async (req, res) => {
  try {
    const { q = '' } = req.query
    
    if (!q || q.length < 2) {
      return res.json({ suggestions: [] })
    }
    
    // Get blog title suggestions
    const blogSuggestions = await Blog.find(
      { 
        title: { $regex: q, $options: 'i' },
        published: true 
      },
      'title slug'
    ).limit(5)
    
    // Get tag suggestions
    const tagSuggestions = await Tag.find(
      { displayName: { $regex: q, $options: 'i' } },
      'name displayName'
    ).limit(3)
    
    // Get category suggestions
    const categorySuggestions = await Category.find(
      { name: { $regex: q, $options: 'i' } },
      'name slug'
    ).limit(3)
    
    // Get author suggestions
    const authorSuggestions = await User.find(
      { name: { $regex: q, $options: 'i' } },
      'name avatar'
    ).limit(3)
    
    res.json({
      suggestions: {
        blogs: blogSuggestions,
        tags: tagSuggestions,
        categories: categorySuggestions,
        authors: authorSuggestions
      }
    })
  } catch (error) {
    console.error('Search suggestions error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Get user's search history
router.get('/history', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query
    
    const searchHistory = await SearchHistory.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec()
    
    const total = await SearchHistory.countDocuments({ user: req.user._id })
    
    res.json({
      searchHistory,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      total
    })
  } catch (error) {
    console.error('Get search history error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Clear search history
router.delete('/history', auth, async (req, res) => {
  try {
    await SearchHistory.deleteMany({ user: req.user._id })
    
    res.json({ message: 'Search history cleared' })
  } catch (error) {
    console.error('Clear search history error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router