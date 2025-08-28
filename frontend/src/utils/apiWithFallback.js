import api from './api'
import { dummyAPI } from '../services/dummyData'

// Enhanced API wrapper that falls back to dummy data when backend fails
class APIWithFallback {
  constructor() {
    this.useDummyData = false
    this.backendAvailable = true
  }

  async makeRequest(apiCall, fallbackCall, endpoint = '') {
    if (this.useDummyData) {
      console.log(`Using dummy data for ${endpoint}`)
      return await fallbackCall()
    }

    try {
      const result = await apiCall()
      this.backendAvailable = true
      return result
    } catch (error) {
      console.warn(`Backend request failed for ${endpoint}:`, error.message)
      
      // If this is the first failure, try to determine if backend is completely down
      if (this.backendAvailable) {
        this.backendAvailable = false
        this.useDummyData = true
        console.log('Switching to dummy data mode due to backend failure')
      }
      
      return await fallbackCall()
    }
  }

  // Blog endpoints
  async getBlogs(params = {}) {
    return this.makeRequest(
      () => api.get('/blogs', { params }),
      () => dummyAPI.getBlogs(params),
      'GET /blogs'
    )
  }

  async getBlog(slug) {
    return this.makeRequest(
      () => api.get(`/blogs/${slug}`),
      () => dummyAPI.getBlog(slug),
      `GET /blogs/${slug}`
    )
  }

  async createBlog(blogData) {
    return this.makeRequest(
      () => api.post('/blogs', blogData),
      () => Promise.resolve({ data: { _id: Date.now().toString(), ...blogData } }),
      'POST /blogs'
    )
  }

  async updateBlog(id, blogData) {
    return this.makeRequest(
      () => api.put(`/blogs/${id}`, blogData),
      () => Promise.resolve({ data: { _id: id, ...blogData } }),
      `PUT /blogs/${id}`
    )
  }

  async deleteBlog(id) {
    return this.makeRequest(
      () => api.delete(`/blogs/${id}`),
      () => Promise.resolve({ data: { message: 'Blog deleted successfully' } }),
      `DELETE /blogs/${id}`
    )
  }

  // Category endpoints
  async getCategories() {
    return this.makeRequest(
      () => api.get('/categories'),
      () => dummyAPI.getCategories(),
      'GET /categories'
    )
  }

  async createCategory(categoryData) {
    return this.makeRequest(
      () => api.post('/categories', categoryData),
      () => Promise.resolve({ data: { _id: Date.now().toString(), ...categoryData } }),
      'POST /categories'
    )
  }

  // Tag endpoints
  async getTags() {
    return this.makeRequest(
      () => api.get('/tags'),
      () => dummyAPI.getTags(),
      'GET /tags'
    )
  }

  // Comment endpoints
  async getComments(blogId, params = {}) {
    return this.makeRequest(
      () => api.get(`/comments/${blogId}`, { params }),
      () => dummyAPI.getComments(blogId),
      `GET /comments/${blogId}`
    )
  }

  async createComment(blogId, commentData) {
    return this.makeRequest(
      () => api.post(`/comments/${blogId}`, commentData),
      () => Promise.resolve({ 
        data: { 
          _id: Date.now().toString(), 
          ...commentData, 
          blog: blogId,
          createdAt: new Date(),
          likes: []
        } 
      }),
      `POST /comments/${blogId}`
    )
  }

  async updateComment(commentId, commentData) {
    return this.makeRequest(
      () => api.put(`/comments/${commentId}`, commentData),
      () => Promise.resolve({ data: { _id: commentId, ...commentData } }),
      `PUT /comments/${commentId}`
    )
  }

  async deleteComment(commentId) {
    return this.makeRequest(
      () => api.delete(`/comments/${commentId}`),
      () => Promise.resolve({ data: { message: 'Comment deleted successfully' } }),
      `DELETE /comments/${commentId}`
    )
  }

  // User endpoints
  async getCurrentUser() {
    return this.makeRequest(
      () => api.get('/users/me'),
      () => dummyAPI.getCurrentUser(),
      'GET /users/me'
    )
  }

  async updateProfile(userData) {
    return this.makeRequest(
      () => api.put('/users/profile', userData),
      () => Promise.resolve({ data: { ...userData } }),
      'PUT /users/profile'
    )
  }

  // Search endpoints
  async searchBlogs(query, params = {}) {
    return this.makeRequest(
      () => api.get('/search/blogs', { params: { q: query, ...params } }),
      () => dummyAPI.searchBlogs(query),
      'GET /search/blogs'
    )
  }

  // Auth endpoints (these should always try backend first)
  async login(credentials) {
    try {
      return await api.post('/auth/login', credentials)
    } catch (error) {
      // For auth, we don't fall back to dummy data
      throw error
    }
  }

  async register(userData) {
    try {
      return await api.post('/auth/register', userData)
    } catch (error) {
      // For auth, we don't fall back to dummy data
      throw error
    }
  }

  async logout() {
    try {
      return await api.post('/auth/logout')
    } catch (error) {
      // Even if backend fails, we can clear local storage
      localStorage.removeItem('token')
      return Promise.resolve({ data: { message: 'Logged out successfully' } })
    }
  }

  // Like/bookmark endpoints (dummy implementations)
  async likeBlog(blogId) {
    return this.makeRequest(
      () => api.post(`/blogs/${blogId}/like`),
      () => Promise.resolve({ 
        data: { 
          message: 'Blog liked successfully!',
          likes: ['user1', 'user2', 'user3'] 
        } 
      }),
      `POST /blogs/${blogId}/like`
    )
  }

  async bookmarkBlog(blogId) {
    return this.makeRequest(
      () => api.post(`/blogs/${blogId}/bookmark`),
      () => Promise.resolve({ 
        data: { 
          message: 'Blog bookmarked successfully!',
          bookmarked: true 
        } 
      }),
      `POST /blogs/${blogId}/bookmark`
    )
  }

  // Utility methods
  isUsingDummyData() {
    return this.useDummyData
  }

  forceUseDummyData() {
    this.useDummyData = true
    this.backendAvailable = false
    console.log('Forced to use dummy data mode')
  }

  resetToBackend() {
    this.useDummyData = false
    this.backendAvailable = true
    console.log('Reset to try backend mode')
  }
}

// Create and export a singleton instance
const apiWithFallback = new APIWithFallback()
export default apiWithFallback
