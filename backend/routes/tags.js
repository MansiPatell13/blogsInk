const express = require('express')
const Tag = require('../models/Tag')
const Blog = require('../models/Blog')
const { auth } = require('../middleware/auth')

const router = express.Router()

// Get all tags
router.get('/', async (req, res) => {
  try {
    const { sort = 'popular', limit = 50, featured } = req.query
    
    let query = {}
    if (featured === 'true') {
      query.featured = true
    }
    
    let sortOption = {}
    if (sort === 'popular') {
      sortOption = { count: -1 }
    } else if (sort === 'name') {
      sortOption = { name: 1 }
    } else if (sort === 'recent') {
      sortOption = { createdAt: -1 }
    }
    
    const tags = await Tag.find(query)
      .sort(sortOption)
      .limit(Number(limit))
    
    res.json(tags)
  } catch (error) {
    console.error('Get tags error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Get single tag by name
router.get('/:name', async (req, res) => {
  try {
    const tag = await Tag.findOne({ name: req.params.name.toLowerCase() })
    
    if (!tag) {
      return res.status(404).json({ message: 'Tag not found' })
    }
    
    res.json(tag)
  } catch (error) {
    console.error('Get tag error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Get blogs by tag
router.get('/:name/blogs', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query
    
    const tag = await Tag.findOne({ name: req.params.name.toLowerCase() })
    
    if (!tag) {
      return res.status(404).json({ message: 'Tag not found' })
    }
    
    const blogs = await Blog.find({ 
      tags: tag._id,
      status: 'published' 
    })
      .populate('author', 'name avatar')
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec()
    
    const total = await Blog.countDocuments({ 
      tags: tag._id,
      status: 'published' 
    })
    
    res.json({
      tag,
      blogs,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      total
    })
  } catch (error) {
    console.error('Get blogs by tag error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Create new tag
router.post('/', auth, async (req, res) => {
  try {
    const { name, displayName, description, featured } = req.body
    
    if (!name || !displayName) {
      return res.status(400).json({ message: 'Please provide name and displayName' })
    }
    
    // Check if tag already exists
    const existingTag = await Tag.findOne({ name: name.toLowerCase() })
    if (existingTag) {
      return res.status(400).json({ message: 'Tag already exists' })
    }
    
    const tag = new Tag({
      name: name.toLowerCase(),
      displayName,
      description,
      featured: featured || false,
      createdBy: req.user._id
    })
    
    await tag.save()
    
    res.status(201).json(tag)
  } catch (error) {
    console.error('Create tag error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Update tag
router.put('/:id', auth, async (req, res) => {
  try {
    const { displayName, description, featured } = req.body
    
    const tag = await Tag.findById(req.params.id)
    
    if (!tag) {
      return res.status(404).json({ message: 'Tag not found' })
    }
    
    if (displayName) tag.displayName = displayName
    if (description !== undefined) tag.description = description
    if (featured !== undefined) tag.featured = featured
    
    await tag.save()
    
    res.json(tag)
  } catch (error) {
    console.error('Update tag error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Delete tag
router.delete('/:id', auth, async (req, res) => {
  try {
    const tag = await Tag.findById(req.params.id)
    
    if (!tag) {
      return res.status(404).json({ message: 'Tag not found' })
    }
    
    // Remove tag from all blogs
    await Blog.updateMany(
      { tags: tag._id },
      { $pull: { tags: tag._id } }
    )
    
    await tag.remove()
    
    res.json({ message: 'Tag deleted successfully' })
  } catch (error) {
    console.error('Delete tag error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router