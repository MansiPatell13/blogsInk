const express = require('express')
const jwt = require('jsonwebtoken')
const { body, validationResult } = require('express-validator')
const User = require('../models/User')
const { auth } = require('../middleware/auth')
const config = require('../config')

const router = express.Router()

// Register user
router.post('/register', [
  body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { name, email, password } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' })
    }

    // Create new user
    const user = new User({
      name,
      email,
      password
    })

    await user.save()

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      config.JWT_SECRET,
      { expiresIn: config.JWT_EXPIRES_IN }
    )

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      }
    })
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Login user
router.post('/login', [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    console.log('Login request received:', req.body)
    
    // Check validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array())
      return res.status(400).json({ errors: errors.array() })
    }

    const { email, password } = req.body
    console.log('Attempting login for email:', email)

    // Find user by email
    const user = await User.findOne({ email })
    if (!user) {
      console.log('User not found for email:', email)
      return res.status(400).json({ message: 'Invalid credentials' })
    }
    console.log('User found:', user._id)

    // Check password with safe guard
    let isMatch = false
    try {
      if (typeof user.password !== 'string' || user.password.length === 0) {
        // Stored password is invalid; treat as auth failure
        console.log('Invalid password format in database')
        return res.status(400).json({ message: 'Invalid credentials' })
      }
      isMatch = await user.comparePassword(password)
      console.log('Password match result:', isMatch)
    } catch (compareErr) {
      // Avoid leaking details; log and return 400
      console.error(`Password compare error for email ${email}:`, compareErr)
      return res.status(400).json({ message: 'Invalid credentials' })
    }
    if (!isMatch) {
      console.log('Password does not match')
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      config.JWT_SECRET,
      { expiresIn: config.JWT_EXPIRES_IN }
    )

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    // If this ever fails unexpectedly, still do not leak info
    res.status(500).json({ message: 'Server error' })
  }
})

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    res.json({
      user: req.user
    })
  } catch (error) {
    console.error('Get user error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Update user profile
router.put('/profile', auth, [
  body('name').optional().trim().isLength({ min: 2, max: 50 }),
  body('bio').optional().trim().isLength({ max: 500 })
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { name, bio, avatar } = req.body
    const updateFields = {}

    if (name) updateFields.name = name
    if (bio !== undefined) updateFields.bio = bio
    if (avatar) updateFields.avatar = avatar

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateFields,
      { new: true, runValidators: true }
    ).select('-password')

    res.json({
      message: 'Profile updated successfully',
      user
    })
  } catch (error) {
    console.error('Update profile error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Update password
router.put('/updatepassword', auth, [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters long')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { currentPassword, newPassword } = req.body
    
    // Get user with password
    const user = await User.findById(req.user._id)
    
    // Check if current password matches
    const isMatch = await user.comparePassword(currentPassword)
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' })
    }
    
    // Update password
    user.password = newPassword
    await user.save()
    
    // Generate new token
    const token = jwt.sign(
      { userId: user._id },
      config.JWT_SECRET,
      { expiresIn: config.JWT_EXPIRES_IN }
    )
    
    res.json({
      message: 'Password updated successfully',
      token
    })
  } catch (error) {
    console.error('Update password error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Forgot password
router.post('/forgot-password', [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email')
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { email } = req.body

    // Check if user exists
    const user = await User.findOne({ email })
    
    // For security reasons, always return success even if user doesn't exist
    // This prevents email enumeration attacks
    
    // In a real implementation, you would:
    // 1. Generate a reset token
    // 2. Save it to the user record with an expiration
    // 3. Send an email with a link containing the token
    
    res.json({
      message: 'If an account with that email exists, password reset instructions have been sent'
    })
  } catch (error) {
    console.error('Forgot password error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router
