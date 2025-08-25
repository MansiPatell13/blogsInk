const Notification = require('../models/Notification')
const User = require('../models/User')

/**
 * Create a notification
 * @param {Object} notificationData - Notification data
 * @param {string} notificationData.recipientId - Recipient user ID
 * @param {string} notificationData.senderId - Sender user ID (optional)
 * @param {string} notificationData.type - Notification type
 * @param {string} notificationData.message - Notification message
 * @param {string} notificationData.blogId - Related blog ID (optional)
 * @param {string} notificationData.commentId - Related comment ID (optional)
 * @param {string} notificationData.link - Notification link (optional)
 * @returns {Promise<Object>} Created notification
 */
async function createNotification(notificationData) {
  try {
    const { recipientId, senderId, type, message, blogId, commentId, link } = notificationData
    
    // Check if recipient exists and has notifications enabled
    const recipient = await User.findById(recipientId)
    if (!recipient || !recipient.notificationSettings.inApp) {
      return null
    }
    
    // Don't send notification to yourself
    if (senderId && senderId.toString() === recipientId.toString()) {
      return null
    }
    
    const notification = new Notification({
      recipient: recipientId,
      sender: senderId || null,
      type,
      message,
      relatedBlog: blogId || null,
      relatedComment: commentId || null,
      link: link || ''
    })
    
    return await notification.save()
  } catch (error) {
    console.error('Create notification error:', error)
    return null
  }
}

/**
 * Create a like notification
 * @param {string} blogId - Blog ID
 * @param {string} authorId - Blog author ID
 * @param {string} likerId - User ID who liked the blog
 * @returns {Promise<Object>} Created notification
 */
async function createLikeNotification(blogId, authorId, likerId) {
  try {
    const liker = await User.findById(likerId).select('name')
    
    return await createNotification({
      recipientId: authorId,
      senderId: likerId,
      type: 'like',
      message: `${liker.name} liked your blog post`,
      blogId,
      link: `/blog/${blogId}`
    })
  } catch (error) {
    console.error('Create like notification error:', error)
    return null
  }
}

/**
 * Create a comment notification
 * @param {string} blogId - Blog ID
 * @param {string} commentId - Comment ID
 * @param {string} authorId - Blog author ID
 * @param {string} commenterId - User ID who commented
 * @returns {Promise<Object>} Created notification
 */
async function createCommentNotification(blogId, commentId, authorId, commenterId) {
  try {
    const commenter = await User.findById(commenterId).select('name')
    
    return await createNotification({
      recipientId: authorId,
      senderId: commenterId,
      type: 'comment',
      message: `${commenter.name} commented on your blog post`,
      blogId,
      commentId,
      link: `/blog/${blogId}#comment-${commentId}`
    })
  } catch (error) {
    console.error('Create comment notification error:', error)
    return null
  }
}

/**
 * Create a follow notification
 * @param {string} followerId - User ID who followed
 * @param {string} followedId - User ID who was followed
 * @returns {Promise<Object>} Created notification
 */
async function createFollowNotification(followerId, followedId) {
  try {
    const follower = await User.findById(followerId).select('name')
    
    return await createNotification({
      recipientId: followedId,
      senderId: followerId,
      type: 'follow',
      message: `${follower.name} started following you`,
      link: `/profile/${followerId}`
    })
  } catch (error) {
    console.error('Create follow notification error:', error)
    return null
  }
}

/**
 * Create a mention notification
 * @param {string} mentionerId - User ID who mentioned
 * @param {string} mentionedId - User ID who was mentioned
 * @param {string} blogId - Blog ID (optional)
 * @param {string} commentId - Comment ID (optional)
 * @returns {Promise<Object>} Created notification
 */
async function createMentionNotification(mentionerId, mentionedId, blogId, commentId) {
  try {
    const mentioner = await User.findById(mentionerId).select('name')
    
    let message = `${mentioner.name} mentioned you`
    let link = ''
    
    if (blogId && commentId) {
      message += ' in a comment'
      link = `/blog/${blogId}#comment-${commentId}`
    } else if (blogId) {
      message += ' in a blog post'
      link = `/blog/${blogId}`
    }
    
    return await createNotification({
      recipientId: mentionedId,
      senderId: mentionerId,
      type: 'mention',
      message,
      blogId: blogId || null,
      commentId: commentId || null,
      link
    })
  } catch (error) {
    console.error('Create mention notification error:', error)
    return null
  }
}

/**
 * Create a system notification
 * @param {string} recipientId - Recipient user ID
 * @param {string} message - Notification message
 * @param {string} link - Notification link (optional)
 * @returns {Promise<Object>} Created notification
 */
async function createSystemNotification(recipientId, message, link = '') {
  try {
    return await createNotification({
      recipientId,
      type: 'system',
      message,
      link
    })
  } catch (error) {
    console.error('Create system notification error:', error)
    return null
  }
}

/**
 * Create a blog published notification for followers
 * @param {string} blogId - Blog ID
 * @param {string} authorId - Blog author ID
 * @param {string} blogTitle - Blog title
 * @returns {Promise<Array>} Created notifications
 */
async function createBlogPublishedNotifications(blogId, authorId, blogTitle) {
  try {
    const author = await User.findById(authorId).select('name followers')
    
    if (!author || !author.followers || author.followers.length === 0) {
      return []
    }
    
    const notifications = []
    
    for (const followerId of author.followers) {
      const notification = await createNotification({
        recipientId: followerId,
        senderId: authorId,
        type: 'blog_published',
        message: `${author.name} published a new blog: ${blogTitle}`,
        blogId,
        link: `/blog/${blogId}`
      })
      
      if (notification) {
        notifications.push(notification)
      }
    }
    
    return notifications
  } catch (error) {
    console.error('Create blog published notifications error:', error)
    return []
  }
}

module.exports = {
  createNotification,
  createLikeNotification,
  createCommentNotification,
  createFollowNotification,
  createMentionNotification,
  createSystemNotification,
  createBlogPublishedNotifications
}