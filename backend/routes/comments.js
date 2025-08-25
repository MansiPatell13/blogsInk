const express = require('express')
const { body, validationResult } = require('express-validator')
const Comment = require('../models/Comment')
const Blog = require('../models/Blog')
const { auth, adminAuth } = require('../middleware/auth')
const notificationManager = require('../utils/notificationManager')

const router = express.Router()

// Get comments for a blog
router.get('/:blogId', async (req, res) => {
  try {
    const { blogId } = req.params
    const { page = 1, limit = 20 } = req.query
    
    const comments = await Comment.find({ 
      blog: blogId, 
      parentComment: null 
    })
      .populate('author', 'name avatar')
      .populate({
        path: 'replies',
        populate: {
          path: 'author',
          select: 'name avatar'
        }
      })
      .populate('likes', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec()
    
    const total = await Comment.countDocuments({ blog: blogId, parentComment: null })
    
    res.json({
      comments,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    })
  } catch (error) {
    console.error('Get comments error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Create a new comment
router.post('/:blogId', auth, [
  body('content').trim().isLength({ min: 1, max: 1000 }).withMessage('Comment must be between 1 and 1000 characters'),
  body('parentComment').optional().isMongoId().withMessage('Invalid parent comment ID')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { blogId } = req.params
    const { content, parentComment } = req.body
    
    // Check if blog exists
    const blog = await Blog.findById(blogId)
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' })
    }
    
    // Check if parent comment exists (if replying)
    if (parentComment) {
      const parent = await Comment.findById(parentComment)
      if (!parent) {
        return res.status(404).json({ message: 'Parent comment not found' })
      }
    }
    
    const comment = new Comment({
      content,
      author: req.user._id,
      blog: blogId,
      parentComment: parentComment || null
    })
    
    await comment.save()
    
    // If this is a reply, add it to parent comment's replies
    if (parentComment) {
      const parentCommentDoc = await Comment.findByIdAndUpdate(parentComment, {
        $push: { replies: comment._id }
      }).populate('author', 'name')
      
      // Create notification for parent comment author
      if (parentCommentDoc && parentCommentDoc.author._id.toString() !== req.user._id.toString()) {
        await notificationManager.createCommentNotification(
          blogId,
          comment._id,
          parentCommentDoc.author._id,
          req.user._id
        )
      }
    } else {
      // Create notification for blog author
      if (blog.author.toString() !== req.user._id.toString()) {
        await notificationManager.createCommentNotification(
          blogId,
          comment._id,
          blog.author,
          req.user._id
        )
      }
    }
    
    // Populate author info for response
    await comment.populate('author', 'name avatar')
    
    res.status(201).json(comment)
  } catch (error) {
    console.error('Create comment error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Update a comment
router.put('/:commentId', auth, [
  body('content').trim().isLength({ min: 1, max: 1000 }).withMessage('Comment must be between 1 and 1000 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { commentId } = req.params
    const { content } = req.body
    
    const comment = await Comment.findById(commentId)
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' })
    }
    
    // Check if user can edit this comment
    if (comment.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to edit this comment' })
    }
    
    comment.content = content
    comment.isEdited = true
    await comment.save()
    
    await comment.populate('author', 'name avatar')
    res.json(comment)
  } catch (error) {
    console.error('Update comment error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Delete a comment
router.delete('/:commentId', auth, async (req, res) => {
  try {
    const { commentId } = req.params
    
    const comment = await Comment.findById(commentId)
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' })
    }
    
    // Check if user can delete this comment
    if (comment.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this comment' })
    }
    
    // If this is a parent comment, remove it from parent's replies
    if (comment.parentComment) {
      await Comment.findByIdAndUpdate(comment.parentComment, {
        $pull: { replies: commentId }
      })
    }
    
    // Delete the comment and all its replies
    await Comment.deleteMany({
      $or: [
        { _id: commentId },
        { parentComment: commentId }
      ]
    })
    
    res.json({ message: 'Comment deleted successfully' })
  } catch (error) {
    console.error('Delete comment error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Like/unlike a comment
router.post('/:commentId/like', auth, async (req, res) => {
  try {
    const { commentId } = req.params
    const userId = req.user._id
    
    const comment = await Comment.findById(commentId)
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' })
    }
    
    const isLiked = comment.likes.includes(userId)
    
    if (isLiked) {
      // Unlike
      comment.likes = comment.likes.filter(id => id.toString() !== userId.toString())
    } else {
      // Like
      comment.likes.push(userId)
    }
    
    await comment.save()
    await comment.populate('likes', 'name')
    
    res.json({
      likes: comment.likes,
      isLiked: !isLiked
    })
  } catch (error) {
    console.error('Like comment error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Report a comment (admin only)
router.post('/:commentId/report', auth, async (req, res) => {
  try {
    const { commentId } = req.params
    const { reason } = req.body
    
    // For now, just log the report
    // In a real app, you'd store reports in a separate collection
    console.log(`Comment ${commentId} reported by user ${req.user._id} for reason: ${reason}`)
    
    res.json({ message: 'Comment reported successfully' })
  } catch (error) {
    console.error('Report comment error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Get comment statistics
router.get('/stats/overview', adminAuth, async (req, res) => {
  try {
    const totalComments = await Comment.countDocuments()
    const totalReplies = await Comment.countDocuments({ parentComment: { $ne: null } })
    const recentComments = await Comment.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    })
    
    res.json({
      totalComments,
      totalReplies,
      recentComments,
      totalInteractions: totalComments + totalReplies
    })
  } catch (error) {
    console.error('Get comment stats error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router
