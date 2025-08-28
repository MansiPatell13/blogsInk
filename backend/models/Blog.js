const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  slug: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true
  },
  content: {
    type: String,
    required: true
  },
  excerpt: {
    type: String,
    required: true,
    maxlength: 500
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  tags: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tag'
  }],
  imageUrl: {
    type: String
  },
  imagePublicId: {
    type: String
  },
  imageAlt: {
    type: String,
    default: ''
  },
  published: {
    type: Boolean,
    default: false
  },
  publishedAt: {
    type: Date
  },
  featured: {
    type: Boolean,
    default: false
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  views: {
    type: Number,
    default: 0
  },
  readTime: {
    type: Number,
    default: 0
  },
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  seoTitle: {
    type: String,
    maxlength: 60
  },
  seoDescription: {
    type: String,
    maxlength: 160
  },
  accessibility: {
    hasAltText: {
      type: Boolean,
      default: false
    },
    readingLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'intermediate'
    },
    hasStructuredContent: {
      type: Boolean,
      default: false
    }
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  }
}, {
  timestamps: true
})

// Generate slug and calculate read time before saving
blogSchema.pre('save', function(next) {
  // Generate slug from title if not provided
  if (this.isModified('title') && !this.slug) {
    const slugify = require('slugify')
    this.slug = slugify(this.title, { lower: true, strict: true })
  }
  
  // Calculate read time
  if (this.isModified('content')) {
    const wordCount = this.content.split(/\s+/).length
    this.readTime = Math.ceil(wordCount / 200) // Average reading speed: 200 words per minute
  }
  
  // Set publishedAt when status changes to published
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date()
  }
  
  // Sync published field with status for backward compatibility
  this.published = this.status === 'published'
  
  next()
})

// Virtual for like count
blogSchema.virtual('likeCount').get(function() {
  return this.likes.length
})

// Ensure virtual fields are serialized
blogSchema.set('toJSON', { virtuals: true })
blogSchema.set('toObject', { virtuals: true })

// Indexes for better query performance
blogSchema.index({ title: 'text', content: 'text', excerpt: 'text' })
blogSchema.index({ category: 1, published: 1, createdAt: -1 })
blogSchema.index({ author: 1, published: 1 })

module.exports = mongoose.model('Blog', blogSchema)
