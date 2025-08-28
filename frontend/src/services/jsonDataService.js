// JSON-based data service that replaces backend with local JSON files
class JsonDataService {
  constructor() {
    this.baseUrl = '/data'
    this.cache = new Map()
  }

  // Helper method to load JSON data
  async loadJsonData(filename) {
    if (this.cache.has(filename)) {
      return this.cache.get(filename)
    }

    try {
      const response = await fetch(`${this.baseUrl}/${filename}`)
      if (!response.ok) {
        throw new Error(`Failed to load ${filename}`)
      }
      const data = await response.json()
      this.cache.set(filename, data)
      return data
    } catch (error) {
      console.error(`Error loading ${filename}:`, error)
      throw error
    }
  }

  // Simulate saving by updating cache and attempting to persist
  async saveData(type, data) {
    this.cache[type] = data;
    console.log(`${type} data updated:`, data);
    
    // Attempt to persist data by writing back to JSON files
    try {
      const jsonData = JSON.stringify(data, null, 2);
      // Note: This won't work in browser environment without a server
      // But we'll simulate the persistence in memory
      localStorage.setItem(`blogsInk_${type}`, jsonData);
      console.log(`${type} data persisted to localStorage`);
    } catch (error) {
      console.warn(`Failed to persist ${type} data:`, error);
    }
  }

  // Helper method to save JSON data (simulated - in real app would need backend)
  async saveJsonData(filename, data) {
    // In a real implementation, this would send data to a server endpoint
    // For now, we'll update the cache and simulate persistence
    await this.saveData(filename, data)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200))
    
    console.log(`Data saved to ${filename}:`, data.length, 'items')
    return data
  }

  // Generate unique ID
  generateId() {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9)
  }

  // Blog operations
  async getBlogs(params = {}) {
    const blogs = await this.loadJsonData('blogs.json')
    let filteredBlogs = [...blogs]

    // Filter by category
    if (params.category && params.category !== 'all') {
      filteredBlogs = filteredBlogs.filter(blog => 
        blog.category._id === params.category
      )
    }

    // Filter by search query
    if (params.search) {
      const query = params.search.toLowerCase()
      filteredBlogs = filteredBlogs.filter(blog =>
        blog.title.toLowerCase().includes(query) ||
        blog.excerpt.toLowerCase().includes(query) ||
        blog.content.toLowerCase().includes(query)
      )
    }

    // Sort blogs
    switch (params.sort) {
      case 'popular':
        filteredBlogs.sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0))
        break
      case 'oldest':
        filteredBlogs.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        break
      case 'latest':
      default:
        filteredBlogs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        break
    }

    // Pagination
    const page = parseInt(params.page) || 1
    const limit = parseInt(params.limit) || 10
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedBlogs = filteredBlogs.slice(startIndex, endIndex)

    return {
      data: {
        blogs: paginatedBlogs,
        totalPages: Math.ceil(filteredBlogs.length / limit),
        currentPage: page,
        total: filteredBlogs.length
      }
    }
  }

  async getBlog(slug) {
    const blogs = await this.loadJsonData('blogs.json')
    const blog = blogs.find(b => b.slug === slug)
    
    if (!blog) {
      throw new Error('Blog not found')
    }

    // Increment view count
    blog.views = (blog.views || 0) + 1
    await this.saveJsonData('blogs.json', blogs)

    return { data: blog }
  }

  async createBlog(blogData) {
    const blogs = await this.loadJsonData('blogs.json')
    const users = await this.loadJsonData('users.json')
    const categories = await this.loadJsonData('categories.json')
    const tags = await this.loadJsonData('tags.json')

    // Get current user (simulate logged in user)
    const currentUser = users[0] // For demo, use first user

    // Find category and tags
    const category = categories.find(c => c._id === blogData.category) || categories[0]
    const blogTags = blogData.tags ? 
      tags.filter(t => blogData.tags.includes(t._id)) : []

    const newBlog = {
      _id: this.generateId(),
      title: blogData.title,
      slug: this.generateSlug(blogData.title),
      excerpt: blogData.excerpt || blogData.content.substring(0, 150) + '...',
      content: blogData.content,
      author: {
        _id: currentUser._id,
        name: currentUser.name,
        email: currentUser.email,
        avatar: currentUser.avatar
      },
      category: {
        _id: category._id,
        name: category.name,
        slug: category.slug
      },
      tags: blogTags,
      imageUrl: blogData.imageUrl || '/placeholder.jpg',
      status: blogData.status || 'published',
      publishedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      likes: [],
      views: 0,
      readTime: this.calculateReadTime(blogData.content),
      featured: false,
      seoTitle: blogData.seoTitle || blogData.title,
      seoDescription: blogData.seoDescription || blogData.excerpt
    }

    blogs.unshift(newBlog)
    await this.saveJsonData('blogs.json', blogs)

    return { data: newBlog }
  }

  async updateBlog(blogId, updateData) {
    const blogs = await this.loadJsonData('blogs.json')
    const blogIndex = blogs.findIndex(b => b._id === blogId)

    if (blogIndex === -1) {
      throw new Error('Blog not found')
    }

    const updatedBlog = {
      ...blogs[blogIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    }

    if (updateData.title) {
      updatedBlog.slug = this.generateSlug(updateData.title)
    }

    if (updateData.content) {
      updatedBlog.readTime = this.calculateReadTime(updateData.content)
    }

    blogs[blogIndex] = updatedBlog
    await this.saveJsonData('blogs.json', blogs)

    return { data: updatedBlog }
  }

  async deleteBlog(blogId) {
    const blogs = await this.loadJsonData('blogs.json')
    const comments = await this.loadJsonData('comments.json')

    const filteredBlogs = blogs.filter(b => b._id !== blogId)
    const filteredComments = comments.filter(c => c.blog !== blogId)

    await this.saveJsonData('blogs.json', filteredBlogs)
    await this.saveJsonData('comments.json', filteredComments)

    return { data: { message: 'Blog deleted successfully' } }
  }

  async likeBlog(blogId, userId = 'user1') {
    const blogs = await this.loadJsonData('blogs.json')
    const blogIndex = blogs.findIndex(b => b._id === blogId)

    if (blogIndex === -1) {
      throw new Error('Blog not found')
    }

    const blog = blogs[blogIndex]
    const likes = blog.likes || []
    const isLiked = likes.includes(userId)

    if (isLiked) {
      blog.likes = likes.filter(id => id !== userId)
    } else {
      blog.likes = [...likes, userId]
    }

    blogs[blogIndex] = blog
    await this.saveJsonData('blogs.json', blogs)

    return {
      data: {
        message: isLiked ? 'Blog unliked' : 'Blog liked successfully!',
        likes: blog.likes,
        liked: !isLiked
      }
    }
  }

  // Category operations
  async getCategories() {
    const categories = await this.loadJsonData('categories.json')
    return { data: categories }
  }

  async createCategory(categoryData) {
    const categories = await this.loadJsonData('categories.json')

    const newCategory = {
      _id: this.generateId(),
      name: categoryData.name,
      slug: this.generateSlug(categoryData.name),
      description: categoryData.description || '',
      color: categoryData.color || '#3B82F6',
      blogCount: 0,
      featured: categoryData.featured || false,
      createdAt: new Date().toISOString()
    }

    categories.push(newCategory)
    await this.saveJsonData('categories.json', categories)

    return { data: newCategory }
  }

  // Tag operations
  async getTags() {
    const tags = await this.loadJsonData('tags.json')
    return { data: tags }
  }

  // Comment operations
  async getComments(blogId) {
    const comments = await this.loadJsonData('comments.json')
    const blogComments = comments.filter(c => c.blog === blogId && !c.parentComment)

    // Add replies to parent comments
    const commentsWithReplies = blogComments.map(comment => ({
      ...comment,
      replies: comments.filter(c => c.parentComment === comment._id)
    }))

    return {
      data: {
        comments: commentsWithReplies,
        total: commentsWithReplies.length
      }
    }
  }

  async createComment(blogId, commentData) {
    const comments = await this.loadJsonData('comments.json')
    const users = await this.loadJsonData('users.json')

    // Get current user (simulate logged in user)
    const currentUser = users[0] // For demo, use first user

    const newComment = {
      _id: this.generateId(),
      content: commentData.content,
      author: {
        _id: currentUser._id,
        name: currentUser.name,
        avatar: currentUser.avatar
      },
      blog: blogId,
      parentComment: commentData.parentComment || null,
      replies: [],
      likes: [],
      isEdited: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    comments.unshift(newComment)
    await this.saveJsonData('comments.json', comments)

    return { data: newComment }
  }

  async updateComment(commentId, updateData) {
    const comments = await this.loadJsonData('comments.json')
    const commentIndex = comments.findIndex(c => c._id === commentId)

    if (commentIndex === -1) {
      throw new Error('Comment not found')
    }

    const updatedComment = {
      ...comments[commentIndex],
      content: updateData.content,
      isEdited: true,
      updatedAt: new Date().toISOString()
    }

    comments[commentIndex] = updatedComment
    await this.saveJsonData('comments.json', comments)

    return { data: updatedComment }
  }

  async deleteComment(commentId) {
    const comments = await this.loadJsonData('comments.json')
    const filteredComments = comments.filter(c => 
      c._id !== commentId && c.parentComment !== commentId
    )

    await this.saveJsonData('comments.json', filteredComments)

    return { data: { message: 'Comment deleted successfully' } }
  }

  // User operations
  async getCurrentUser() {
    const users = await this.loadJsonData('users.json')
    return { data: users[0] } // For demo, return first user as current user
  }

  async updateProfile(userData) {
    const users = await this.loadJsonData('users.json')
    const userIndex = 0 // For demo, update first user

    const updatedUser = {
      ...users[userIndex],
      ...userData,
      updatedAt: new Date().toISOString()
    }

    users[userIndex] = updatedUser
    await this.saveJsonData('users.json', users)

    return { data: updatedUser }
  }

  // Search operations
  async searchBlogs(query) {
    return this.getBlogs({ search: query })
  }

  // Utility methods
  generateSlug(title) {
    return title
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-')
      .concat('-', Date.now().toString().slice(-4))
  }

  calculateReadTime(content) {
    const wordsPerMinute = 200
    const words = content.split(/\s+/).length
    return Math.ceil(words / wordsPerMinute)
  }

  // Clear cache (useful for development)
  clearCache() {
    this.cache.clear()
  }
}

// Create and export singleton instance
const jsonDataService = new JsonDataService()
export default jsonDataService
