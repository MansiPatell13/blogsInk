const express = require('express')
const UserPreference = require('../models/UserPreference')
const { auth } = require('../middleware/auth')

const router = express.Router()

// Get user preferences
router.get('/', auth, async (req, res) => {
  try {
    let preferences = await UserPreference.findOne({ user: req.user._id })
      .populate('preferredCategories', 'name slug')
      .populate('preferredTags', 'name displayName')
    
    // Create default preferences if not found
    if (!preferences) {
      preferences = await UserPreference.createDefaultPreferences(req.user._id)
    }
    
    res.json(preferences)
  } catch (error) {
    console.error('Get preferences error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Update user preferences
router.put('/', auth, async (req, res) => {
  try {
    const { 
      theme, 
      fontSize, 
      reducedMotion, 
      highContrast,
      emailNotifications,
      pushNotifications,
      preferredCategories,
      preferredTags,
      language
    } = req.body
    
    let preferences = await UserPreference.findOne({ user: req.user._id })
    
    // Create default preferences if not found
    if (!preferences) {
      preferences = await UserPreference.createDefaultPreferences(req.user._id)
    }
    
    // Update fields if provided
    if (theme) preferences.theme = theme
    if (fontSize) preferences.fontSize = fontSize
    if (reducedMotion !== undefined) preferences.reducedMotion = reducedMotion
    if (highContrast !== undefined) preferences.highContrast = highContrast
    
    // Update email notification settings
    if (emailNotifications) {
      preferences.emailNotifications = {
        ...preferences.emailNotifications,
        ...emailNotifications
      }
    }
    
    // Update push notification settings
    if (pushNotifications) {
      preferences.pushNotifications = {
        ...preferences.pushNotifications,
        ...pushNotifications
      }
    }
    
    // Update preferred categories
    if (preferredCategories) {
      preferences.preferredCategories = preferredCategories
    }
    
    // Update preferred tags
    if (preferredTags) {
      preferences.preferredTags = preferredTags
    }
    
    // Update language
    if (language) {
      preferences.language = language
    }
    
    await preferences.save()
    
    res.json(preferences)
  } catch (error) {
    console.error('Update preferences error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Reset user preferences to default
router.post('/reset', auth, async (req, res) => {
  try {
    await UserPreference.findOneAndDelete({ user: req.user._id })
    
    const preferences = await UserPreference.createDefaultPreferences(req.user._id)
    
    res.json({
      message: 'Preferences reset to default',
      preferences
    })
  } catch (error) {
    console.error('Reset preferences error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router