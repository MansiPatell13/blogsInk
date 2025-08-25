const express = require('express')
const mongoose = require('mongoose')
const { auth, adminAuth } = require('../middleware/auth')
const User = require('../models/User')
const Blog = require('../models/Blog')
const Comment = require('../models/Comment')

const router = express.Router()

// All routes require admin authentication
router.use(adminAuth)

// Get admin dashboard statistics
router.get('/dashboard', async (req, res) => {
  try {
    const [
      totalUsers,
      totalBlogs,
      totalComments,
      publishedBlogs,
      draftBlogs,
      recentUsers,
      recentBlogs,
      topBlogs
    ] = await Promise.all([
      User.countDocuments(),
      Blog.countDocuments(),
      Comment.countDocuments(),
      Blog.countDocuments({ published: true }),
      Blog.countDocuments({ published: false }),
      User.find().sort({ createdAt: -1 }).limit(5).select('name email createdAt'),
      Blog.find().sort({ createdAt: -1 }).limit(5).populate('author', 'name'),
      Blog.find({ published: true })
        .sort({ views: -1, 'likes.length': -1 })
        .limit(5)
        .populate('author', 'name')
        .select('title views likes createdAt')
    ])

    // Calculate growth metrics (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const [
      newUsersThisMonth,
      newBlogsThisMonth,
      newCommentsThisMonth
    ] = await Promise.all([
      User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      Blog.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      Comment.countDocuments({ createdAt: { $gte: thirtyDaysAgo } })
    ])

    res.json({
      overview: {
        totalUsers,
        totalBlogs,
        totalComments,
        publishedBlogs,
        draftBlogs
      },
      growth: {
        newUsersThisMonth,
        newBlogsThisMonth,
        newCommentsThisMonth
      },
      recent: {
        users: recentUsers,
        blogs: recentBlogs,
        topBlogs
      }
    })
  } catch (error) {
    console.error('Admin dashboard error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Get all users with pagination and search
router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 20, search, role, sort = 'newest' } = req.query
    
    let query = {}
    
    // Search by name or email
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ]
    }
    
    // Filter by role
    if (role && role !== 'all') {
      query.role = role
    }
    
    // Sorting
    let sortOption = {}
    switch (sort) {
      case 'newest':
        sortOption = { createdAt: -1 }
        break
      case 'oldest':
        sortOption = { createdAt: 1 }
        break
      case 'name':
        sortOption = { name: 1 }
        break
      default:
        sortOption = { createdAt: -1 }
    }
    
    const users = await User.find(query)
      .select('-password')
      .sort(sortOption)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec()
    
    const total = await User.countDocuments(query)
    
    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    })
  } catch (error) {
    console.error('Get users error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Update user role
router.patch('/users/:userId/role', async (req, res) => {
  try {
    const { userId } = req.params
    const { role } = req.body
    
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' })
    }
    
    // Prevent admin from removing their own admin role
    if (userId === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot change your own role' })
    }
    
    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    ).select('-password')
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    
    res.json({ message: 'User role updated successfully', user })
  } catch (error) {
    console.error('Update user role error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Delete user (admin only)
router.delete('/users/:userId', async (req, res) => {
  try {
    const { userId } = req.params
    
    // Prevent admin from deleting themselves
    if (userId === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot delete your own account' })
    }
    
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    
    // Delete user's blogs and comments
    await Promise.all([
      Blog.deleteMany({ author: userId }),
      Comment.deleteMany({ author: userId })
    ])
    
    await User.findByIdAndDelete(userId)
    
    res.json({ message: 'User deleted successfully' })
  } catch (error) {
    console.error('Delete user error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Get all blogs with moderation options
router.get('/blogs', async (req, res) => {
  try {
    const { page = 1, limit = 20, status, search, sort = 'newest' } = req.query
    
    let query = {}
    
    // Filter by publication status
    if (status && status !== 'all') {
      query.published = status === 'published'
    }
    
    // Search functionality
    if (search) {
      query.$text = { $search: search }
    }
    
    // Sorting
    let sortOption = {}
    switch (sort) {
      case 'newest':
        sortOption = { createdAt: -1 }
        break
      case 'oldest':
        sortOption = { createdAt: 1 }
        break
      case 'popular':
        sortOption = { 'likes.length': -1 }
        break
      case 'views':
        sortOption = { views: -1 }
        break
      default:
        sortOption = { createdAt: -1 }
    }
    
    const blogs = await Blog.find(query)
      .populate('author', 'name email')
      .sort(sortOption)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec()
    
    const total = await Blog.countDocuments(query)
    
    res.json({
      blogs,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    })
  } catch (error) {
    console.error('Get admin blogs error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Moderate blog (approve/reject)
router.patch('/blogs/:blogId/moderate', async (req, res) => {
  try {
    const { blogId } = req.params
    const { action, reason } = req.body
    
    if (!['approve', 'reject', 'feature'].includes(action)) {
      return res.status(400).json({ message: 'Invalid action' })
    }
    
    const blog = await Blog.findById(blogId)
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' })
    }
    
    switch (action) {
      case 'approve':
        blog.published = true
        break
      case 'reject':
        blog.published = false
        // You could add a rejection reason field here
        break
      case 'feature':
        blog.featured = !blog.featured
        break
    }
    
    await blog.save()
    
    res.json({ 
      message: `Blog ${action}d successfully`,
      blog: await blog.populate('author', 'name email')
    })
  } catch (error) {
    console.error('Moderate blog error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Get content reports (placeholder for future implementation)
router.get('/reports', async (req, res) => {
  try {
    // This would integrate with a reporting system
    // For now, return empty array
    res.json({ reports: [], total: 0 })
  } catch (error) {
    console.error('Get reports error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Get system health and performance metrics
router.get('/system/health', async (req, res) => {
  try {
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    
    // Get memory usage
    const memUsage = process.memoryUsage()
    
    // Get uptime
    const uptime = process.uptime()
    
    res.json({
      status: 'healthy',
      database: dbStatus,
      memory: {
        rss: Math.round(memUsage.rss / 1024 / 1024) + ' MB',
        heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024) + ' MB',
        heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024) + ' MB'
      },
      uptime: Math.round(uptime / 60) + ' minutes',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('System health check error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router
