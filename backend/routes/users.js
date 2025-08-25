const express = require('express')
const User = require('../models/User')
const { auth, adminAuth } = require('../middleware/auth')

const router = express.Router()

// Get all users (admin only)
router.get('/', adminAuth, async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 })
    res.json(users)
  } catch (error) {
    console.error('Get users error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('followers', 'name avatar')
      .populate('following', 'name avatar')
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    
    res.json(user)
  } catch (error) {
    console.error('Get user error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Follow/Unfollow user
router.post('/:id/follow', auth, async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot follow yourself' })
    }
    
    const userToFollow = await User.findById(req.params.id)
    if (!userToFollow) {
      return res.status(404).json({ message: 'User not found' })
    }
    
    const currentUser = await User.findById(req.user._id)
    
    const isFollowing = currentUser.following.includes(req.params.id)
    
    if (isFollowing) {
      // Unfollow
      currentUser.following = currentUser.following.filter(
        id => id.toString() !== req.params.id
      )
      userToFollow.followers = userToFollow.followers.filter(
        id => id.toString() !== req.user._id.toString()
      )
    } else {
      // Follow
      currentUser.following.push(req.params.id)
      userToFollow.followers.push(req.user._id)
    }
    
    await currentUser.save()
    await userToFollow.save()
    
    res.json({
      message: isFollowing ? 'User unfollowed' : 'User followed',
      following: currentUser.following.length,
      followers: userToFollow.followers.length
    })
  } catch (error) {
    console.error('Follow user error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Get user statistics
router.get('/:id/stats', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    
    // You can add more statistics here like blog count, total views, etc.
    const stats = {
      followers: user.followers.length,
      following: user.following.length,
      joinDate: user.createdAt
    }
    
    res.json(stats)
  } catch (error) {
    console.error('Get user stats error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Update user role (admin only)
router.patch('/:id/role', adminAuth, async (req, res) => {
  try {
    const { role } = req.body
    
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' })
    }
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select('-password')
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    
    res.json({
      message: 'User role updated successfully',
      user
    })
  } catch (error) {
    console.error('Update user role error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Delete user (admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    
    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Cannot delete admin users' })
    }
    
    await User.findByIdAndDelete(req.params.id)
    
    res.json({ message: 'User deleted successfully' })
  } catch (error) {
    console.error('Delete user error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router
