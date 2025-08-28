const mongoose = require('mongoose')
const slugify = require('slugify')

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    maxlength: 50
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    maxlength: 500,
    default: ''
  },
  image: {
    type: String
  },
  imagePublicId: {
    type: String
  },
  color: {
    type: String,
    default: '#3B82F6'
  },
  featured: {
    type: Boolean,
    default: false
  },
  parentCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  blogCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
})

// Generate slug from name before saving
categorySchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true })
  }
  next()
})

// Update blog count when blogs are added/removed
categorySchema.methods.updateBlogCount = async function() {
  const Blog = require('./Blog')
  const count = await Blog.countDocuments({ category: this._id, status: 'published' })
  this.blogCount = count
  await this.save()
}

// Remove password from JSON response
categorySchema.methods.toJSON = function() {
  const category = this.toObject()
  return category
}

module.exports = mongoose.model('Category', categorySchema)