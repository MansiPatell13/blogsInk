const express = require('express')
const SeoData = require('../models/SeoData')
const Blog = require('../models/Blog')
const { auth } = require('../middleware/auth')

const router = express.Router()

// Get SEO data for a blog
router.get('/blog/:blogId', async (req, res) => {
  try {
    const seoData = await SeoData.findOne({ blog: req.params.blogId })
    
    if (!seoData) {
      return res.status(404).json({ message: 'SEO data not found' })
    }
    
    res.json(seoData)
  } catch (error) {
    console.error('Get SEO data error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Create or update SEO data for a blog
router.post('/blog/:blogId', auth, async (req, res) => {
  try {
    const blog = await Blog.findOne({ 
      _id: req.params.blogId,
      author: req.user._id
    }).populate('author', 'name')
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found or you are not authorized' })
    }
    
    const {
      title,
      description,
      keywords,
      canonicalUrl,
      ogTitle,
      ogDescription,
      ogImage,
      ogImageAlt,
      twitterTitle,
      twitterDescription,
      twitterImage,
      twitterImageAlt
    } = req.body
    
    // Find existing SEO data or create new
    let seoData = await SeoData.findOne({ blog: blog._id })
    
    if (!seoData) {
      // Generate initial SEO data from blog
      seoData = await SeoData.generateFromBlog(blog)
    }
    
    // Update fields if provided
    if (title) seoData.title = title
    if (description) seoData.description = description
    if (keywords) seoData.keywords = keywords
    if (canonicalUrl) seoData.canonicalUrl = canonicalUrl
    if (ogTitle) seoData.ogTitle = ogTitle
    if (ogDescription) seoData.ogDescription = ogDescription
    if (ogImage) seoData.ogImage = ogImage
    if (ogImageAlt) seoData.ogImageAlt = ogImageAlt
    if (twitterTitle) seoData.twitterTitle = twitterTitle
    if (twitterDescription) seoData.twitterDescription = twitterDescription
    if (twitterImage) seoData.twitterImage = twitterImage
    if (twitterImageAlt) seoData.twitterImageAlt = twitterImageAlt
    
    // Update structured data
    seoData.structuredData = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": seoData.title,
      "description": seoData.description,
      "image": seoData.ogImage || blog.imageUrl,
      "datePublished": blog.publishedAt || blog.createdAt,
      "dateModified": blog.updatedAt,
      "author": {
        "@type": "Person",
        "name": blog.author.name
      }
    }
    
    await seoData.save()
    
    res.json(seoData)
  } catch (error) {
    console.error('Update SEO data error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Generate SEO data for all blogs
router.post('/generate-all', auth, async (req, res) => {
  try {
    const blogs = await Blog.find({ status: 'published' }).populate('author', 'name')
    
    const results = await Promise.all(
      blogs.map(async (blog) => {
        try {
          const seoData = await SeoData.generateFromBlog(blog)
          return { blogId: blog._id, success: true, seoData }
        } catch (error) {
          return { blogId: blog._id, success: false, error: error.message }
        }
      })
    )
    
    res.json({
      message: `Generated SEO data for ${results.filter(r => r.success).length} blogs`,
      results
    })
  } catch (error) {
    console.error('Generate all SEO data error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router