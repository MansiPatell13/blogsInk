const express = require('express')
const { body, validationResult } = require('express-validator')
const Blog = require('../models/Blog')
const User = require('../models/User')
const { auth } = require('../middleware/auth')
const notificationManager = require('../utils/notificationManager')
const mongoose = require('mongoose')

const router = express.Router()

// Get all published blogs
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, category, search, sort = 'latest' } = req.query
    
    let query = { status: 'published' }
    
    // Filter by category
    if (category && category !== 'all') {
      query.category = category
    }
    
    // Search functionality
    if (search) {
      query.$text = { $search: search }
    }
    
    // Sorting
    let sortOption = {}
    if (sort === 'popular') {
      sortOption = { 'likes.length': -1 }
    } else {
      sortOption = { createdAt: -1 }
    }
    
    const blogs = await Blog.find(query)
      .populate('author', 'name avatar')
      .populate('category', 'name slug')
      .populate('tags', 'name displayName')
      .sort(sortOption)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec()
    
    const total = await Blog.countDocuments(query)
    
    res.json({
      blogs,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    })
  } catch (error) {
    console.error('Get blogs error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Get blog categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await Blog.distinct('category')
    res.json(categories)
  } catch (error) {
    console.error('Get categories error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Get single blog by ID
router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate('author', 'name avatar bio')
      .populate('category', 'name slug')
      .populate('tags', 'name displayName')
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          select: 'name avatar'
        }
      })
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' })
    }
    
    // Increment view count
    blog.views += 1
    await blog.save()
    
    res.json(blog)
  } catch (error) {
    console.error('Get blog error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Save draft or create new blog
router.post('/draft', auth, [
  body('title').trim().isLength({ min: 5, max: 200 }).withMessage('Title must be between 5 and 200 characters'),
  body('content').notEmpty().withMessage('Content is required'),
  body('excerpt').optional().trim().isLength({ min: 10, max: 500 }).withMessage('Excerpt must be between 10 and 500 characters'),
  body('category').optional().trim().notEmpty().withMessage('Category is required'),
  body('tags').optional().isArray().withMessage('Tags must be an array'),
  body('status').optional().isIn(['draft', 'published', 'archived']).withMessage('Status must be draft, published, or archived')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    
    const { title, content, excerpt, category, tags, imageUrl, status = 'draft' } = req.body
    
    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-')
      .concat('-', Date.now().toString().slice(-4))
    
    const blog = new Blog({
      title,
      content,
      excerpt: excerpt || content.substring(0, 150) + '...',
      category: category || 'general',
      tags: tags || [],
      imageUrl,
      status: status || 'draft',
      slug,
      author: req.user._id
    })
    
    await blog.save()
    
    // If blog is published, create notifications for followers
    if (blog.status === 'published') {
      await notificationManager.createBlogPublishedNotifications(
        blog._id,
        req.user._id,
        blog.title
      )
    }
    
    const populatedBlog = await Blog.findById(blog._id)
      .populate('author', 'name avatar')
    
    res.status(201).json({
      message: status === 'published' ? 'Blog published successfully' : 'Draft saved successfully',
      blog: populatedBlog
    })
  } catch (error) {
    console.error('Save draft error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Create new blog (legacy endpoint)
router.post('/', auth, [
  body('title').trim().isLength({ min: 5, max: 200 }).withMessage('Title must be between 5 and 200 characters'),
  body('content').notEmpty().withMessage('Content is required'),
  body('excerpt').trim().isLength({ min: 10, max: 500 }).withMessage('Excerpt must be between 10 and 500 characters'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('tags').isArray().withMessage('Tags must be an array')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    
    const { title, content, excerpt, category, tags, imageUrl, status = 'draft' } = req.body
    
    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-')
      .concat('-', Date.now().toString().slice(-4))
    
    const blog = new Blog({
      title,
      content,
      excerpt,
      category,
      tags,
      imageUrl,
      status,
      slug,
      author: req.user._id
    })
    
    await blog.save()
    
    // If blog is published, create notifications for followers
    if (blog.status === 'published') {
      await notificationManager.createBlogPublishedNotifications(
        blog._id,
        req.user._id,
        blog.title
      )
    }
    
    const populatedBlog = await Blog.findById(blog._id)
      .populate('author', 'name avatar')
    
    res.status(201).json({
      message: 'Blog created successfully',
      blog: populatedBlog
    })
  } catch (error) {
    console.error('Create blog error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Update blog
router.put('/:id', auth, [
  body('title').optional().trim().isLength({ min: 5, max: 200 }),
  body('content').optional().notEmpty(),
  body('excerpt').optional().trim().isLength({ min: 10, max: 500 }),
  body('category').optional().trim().notEmpty(),
  body('tags').optional().isArray()
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    
    const blog = await Blog.findById(req.params.id)
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' })
    }
    
    // Check if user is author or admin
    if (blog.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this blog' })
    }
    
    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('author', 'name avatar')
    
    res.json({
      message: 'Blog updated successfully',
      blog: updatedBlog
    })
  } catch (error) {
    console.error('Update blog error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Delete blog
router.delete('/:id', auth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' })
    }
    
    // Check if user is author or admin
    if (blog.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this blog' })
    }
    
    await Blog.findByIdAndDelete(req.params.id)
    
    res.json({ message: 'Blog deleted successfully' })
  } catch (error) {
    console.error('Delete blog error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Like/Unlike blog
router.post('/:id/like', auth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' })
    }
    
    const likeIndex = blog.likes.indexOf(req.user._id)
    
    if (likeIndex > -1) {
      // Unlike
      blog.likes.splice(likeIndex, 1)
    } else {
      // Like
      blog.likes.push(req.user._id)
    }
    
    await blog.save()
    
    res.json({
      message: likeIndex > -1 ? 'Blog unliked' : 'Blog liked',
      likes: blog.likes.length
    })
  } catch (error) {
    console.error('Like blog error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Like/Unlike blog
router.post('/:id/like', auth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' })
    }
    
    const likeIndex = blog.likes.indexOf(req.user._id)
    
    if (likeIndex > -1) {
      // Unlike
      blog.likes.splice(likeIndex, 1)
    } else {
      // Like
      blog.likes.push(req.user._id)
    }
    
    await blog.save()
    
    res.json({
      message: likeIndex > -1 ? 'Blog unliked' : 'Blog liked',
      likes: blog.likes.length
    })
  } catch (error) {
    console.error('Like blog error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Bookmark/Unbookmark blog
router.post('/:id/bookmark', auth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' })
    }
    
    // Check if user has bookmarked this blog
    const user = await User.findById(req.user._id)
    const bookmarkIndex = user.bookmarks.indexOf(blog._id)
    
    if (bookmarkIndex > -1) {
      // Remove bookmark
      user.bookmarks.splice(bookmarkIndex, 1)
      await user.save()
      res.json({ message: 'Blog removed from bookmarks', bookmarked: false })
    } else {
      // Add bookmark
      user.bookmarks.push(blog._id)
      await user.save()
      res.json({ message: 'Blog added to bookmarks', bookmarked: true })
    }
  } catch (error) {
    console.error('Bookmark blog error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Get user's bookmarked blogs
router.get('/user/:userId/bookmarks', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .populate({
        path: 'bookmarks',
        populate: {
          path: 'author',
          select: 'name avatar'
        }
      })
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    
    res.json(user.bookmarks)
  } catch (error) {
    console.error('Get bookmarked blogs error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Get user's blogs
router.get('/user/:userId', async (req, res) => {
  try {
    const blogs = await Blog.find({ 
      author: req.params.userId, 
      status: 'published' 
    })
    .populate('author', 'name avatar')
    .sort({ createdAt: -1 })
    
    res.json(blogs)
  } catch (error) {
    console.error('Get user blogs error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router
