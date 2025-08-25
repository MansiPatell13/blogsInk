const express = require('express')
const { body, validationResult } = require('express-validator')
const Category = require('../models/Category')
const { auth, adminAuth } = require('../middleware/auth')

const router = express.Router()

// Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find()
      .sort({ name: 1 })
    
    res.json(categories)
  } catch (error) {
    console.error('Get categories error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Get single category by ID
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id)
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' })
    }
    
    res.json(category)
  } catch (error) {
    console.error('Get category error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Create new category (admin only)
router.post('/', adminAuth, [
  body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('description').optional().trim().isLength({ max: 500 }).withMessage('Description must be less than 500 characters'),
  body('color').optional().isHexColor().withMessage('Color must be a valid hex color')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    
    const { name, description, color, image } = req.body
    
    // Check if category already exists
    const existingCategory = await Category.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } })
    if (existingCategory) {
      return res.status(400).json({ message: 'Category already exists' })
    }
    
    const category = new Category({
      name,
      description,
      color,
      image
    })
    
    await category.save()
    
    res.status(201).json({
      message: 'Category created successfully',
      category
    })
  } catch (error) {
    console.error('Create category error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Update category (admin only)
router.put('/:id', adminAuth, [
  body('name').optional().trim().isLength({ min: 2, max: 50 }),
  body('description').optional().trim().isLength({ max: 500 }),
  body('color').optional().isHexColor()
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' })
    }
    
    res.json({
      message: 'Category updated successfully',
      category
    })
  } catch (error) {
    console.error('Update category error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Delete category (admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id)
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' })
    }
    
    res.json({ message: 'Category deleted successfully' })
  } catch (error) {
    console.error('Delete category error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router