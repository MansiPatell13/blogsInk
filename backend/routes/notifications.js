const express = require('express')
const Notification = require('../models/Notification')
const { auth } = require('../middleware/auth')

const router = express.Router()

// Get all notifications for the current user
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 20, filter = 'all' } = req.query
    
    let query = { recipient: req.user._id }
    
    // Filter notifications
    if (filter === 'read') {
      query.read = true
    } else if (filter === 'unread') {
      query.read = false
    }
    
    const notifications = await Notification.find(query)
      .populate('sender', 'name avatar')
      .populate('relatedBlog', 'title slug')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec()
    
    const total = await Notification.countDocuments(query)
    const unreadCount = await Notification.countDocuments({ 
      recipient: req.user._id, 
      read: false 
    })
    
    res.json({
      notifications,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      total,
      unreadCount
    })
  } catch (error) {
    console.error('Get notifications error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Mark notification as read
router.patch('/:id/read', auth, async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      recipient: req.user._id
    })
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' })
    }
    
    notification.read = true
    await notification.save()
    
    res.json({ message: 'Notification marked as read', notification })
  } catch (error) {
    console.error('Mark notification read error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Mark all notifications as read
router.patch('/read-all', auth, async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user._id, read: false },
      { read: true }
    )
    
    res.json({ message: 'All notifications marked as read' })
  } catch (error) {
    console.error('Mark all notifications read error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Delete a notification
router.delete('/:id', auth, async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      recipient: req.user._id
    })
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' })
    }
    
    await notification.remove()
    
    res.json({ message: 'Notification deleted' })
  } catch (error) {
    console.error('Delete notification error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Delete all notifications
router.delete('/', auth, async (req, res) => {
  try {
    await Notification.deleteMany({ recipient: req.user._id })
    
    res.json({ message: 'All notifications deleted' })
  } catch (error) {
    console.error('Delete all notifications error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Create a notification (for testing purposes)
router.post('/test', auth, async (req, res) => {
  try {
    const { type, message, recipientId } = req.body
    
    if (!type || !message || !recipientId) {
      return res.status(400).json({ message: 'Please provide all required fields' })
    }
    
    const notification = new Notification({
      recipient: recipientId,
      sender: req.user._id,
      type,
      message,
      link: req.body.link || ''
    })
    
    await notification.save()
    
    res.status(201).json({ message: 'Test notification created', notification })
  } catch (error) {
    console.error('Create test notification error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router