const mongoose = require('mongoose')

const seoDataSchema = new mongoose.Schema({
  blog: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog',
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true,
    maxlength: 60
  },
  description: {
    type: String,
    required: true,
    maxlength: 160
  },
  keywords: [{
    type: String,
    trim: true
  }],
  canonicalUrl: {
    type: String
  },
  ogTitle: {
    type: String,
    maxlength: 60
  },
  ogDescription: {
    type: String,
    maxlength: 160
  },
  ogImage: {
    type: String
  },
  ogImageAlt: {
    type: String
  },
  twitterTitle: {
    type: String,
    maxlength: 60
  },
  twitterDescription: {
    type: String,
    maxlength: 160
  },
  twitterImage: {
    type: String
  },
  twitterImageAlt: {
    type: String
  },
  structuredData: {
    type: Object,
    default: {}
  }
}, {
  timestamps: true
})

// Auto-generate SEO data from blog content
seoDataSchema.statics.generateFromBlog = async function(blog) {
  try {
    const seoData = {
      blog: blog._id,
      title: blog.seoTitle || blog.title,
      description: blog.seoDescription || blog.excerpt,
      keywords: blog.tags,
      canonicalUrl: `/blog/${blog._id}`,
      ogTitle: blog.seoTitle || blog.title,
      ogDescription: blog.seoDescription || blog.excerpt,
      ogImage: blog.imageUrl,
      ogImageAlt: blog.imageAlt || blog.title,
      twitterTitle: blog.seoTitle || blog.title,
      twitterDescription: blog.seoDescription || blog.excerpt,
      twitterImage: blog.imageUrl,
      twitterImageAlt: blog.imageAlt || blog.title,
      structuredData: {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": blog.title,
        "description": blog.excerpt,
        "image": blog.imageUrl,
        "datePublished": blog.createdAt,
        "dateModified": blog.updatedAt,
        "author": {
          "@type": "Person",
          "name": blog.author.name
        }
      }
    }
    
    return await this.findOneAndUpdate(
      { blog: blog._id },
      seoData,
      { upsert: true, new: true }
    )
  } catch (error) {
    console.error('Error generating SEO data:', error)
    throw error
  }
}

module.exports = mongoose.model('SeoData', seoDataSchema)