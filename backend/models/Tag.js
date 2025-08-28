const mongoose = require('mongoose')
const slugify = require('slugify')

const tagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    maxlength: 30
  },
  displayName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    maxlength: 200,
    default: ''
  },
  color: {
    type: String,
    default: '#6B7280'
  },
  featured: {
    type: Boolean,
    default: false
  },
  blogCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
})

// Generate slug from name before saving
tagSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true })
  }
  if (this.isModified('name') && !this.displayName) {
    this.displayName = this.name
  }
  next()
})

// Update blog count when blogs are added/removed
tagSchema.methods.updateBlogCount = async function() {
  const Blog = require('./Blog')
  const count = await Blog.countDocuments({ 
    tags: this._id, 
    status: 'published' 
  })
  this.blogCount = count
  await this.save()
}

module.exports = mongoose.model('Tag', tagSchema)