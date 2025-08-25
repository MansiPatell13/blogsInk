const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');
const Blog = require('../models/Blog');
const Category = require('../models/Category');
const Tag = require('../models/Tag');
const SearchHistory = require('../models/SearchHistory');

let token;
let userId;
let blogId;
let categoryId;
let tagId;

// Mock data
const testUser = {
  name: 'Search Test User',
  email: 'searchtest@example.com',
  password: 'password123'
};

const testCategory = {
  name: 'Search Test Category',
  description: 'Test category for search'
};

const testTag = {
  name: 'search-test-tag',
  displayName: 'Search Test Tag'
};

const testBlog = {
  title: 'Search Test Blog',
  excerpt: 'This is a test blog for search functionality',
  content: 'This is the content of the test blog for search functionality',
  status: 'published'
};

// Setup before tests
beforeAll(async () => {
  // Register a test user
  const userResponse = await request(app)
    .post('/api/auth/register')
    .send(testUser);
  
  token = userResponse.body.token;
  userId = userResponse.body.user._id;
  
  // Create a test category
  const categoryResponse = await request(app)
    .post('/api/categories')
    .set('Authorization', `Bearer ${token}`)
    .send(testCategory);
  
  categoryId = categoryResponse.body._id;
  
  // Create a test tag
  const tagResponse = await request(app)
    .post('/api/tags')
    .set('Authorization', `Bearer ${token}`)
    .send(testTag);
  
  tagId = tagResponse.body._id;
  
  // Create a test blog
  const blogData = {
    ...testBlog,
    category: categoryId,
    tags: [tagId]
  };
  
  const blogResponse = await request(app)
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(blogData);
  
  blogId = blogResponse.body._id;
});

// Clean up after tests
afterAll(async () => {
  // Delete test data
  await Blog.findByIdAndDelete(blogId);
  await Category.findByIdAndDelete(categoryId);
  await Tag.findByIdAndDelete(tagId);
  await User.findByIdAndDelete(userId);
  await SearchHistory.deleteMany({ user: userId });
  
  // Close MongoDB connection
  await mongoose.connection.close();
});

describe('Search API', () => {
  describe('GET /api/search', () => {
    it('should search blogs by query', async () => {
      const res = await request(app).get('/api/search?q=search');
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('blogs');
      expect(res.body).toHaveProperty('pagination');
      expect(res.body.blogs.length).toBeGreaterThan(0);
      expect(res.body.blogs[0]).toHaveProperty('title', testBlog.title);
    });
    
    it('should filter search by category', async () => {
      const res = await request(app).get(`/api/search?q=test&category=${categoryId}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('blogs');
      expect(res.body.blogs.length).toBeGreaterThan(0);
      expect(res.body.blogs[0].category._id).toBe(categoryId);
    });
    
    it('should filter search by tag', async () => {
      const res = await request(app).get(`/api/search?q=test&tags=${tagId}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('blogs');
      expect(res.body.blogs.length).toBeGreaterThan(0);
      expect(res.body.blogs[0].tags.some(tag => tag._id === tagId)).toBeTruthy();
    });
    
    it('should filter search by author', async () => {
      const res = await request(app).get(`/api/search?q=test&author=${userId}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('blogs');
      expect(res.body.blogs.length).toBeGreaterThan(0);
      expect(res.body.blogs[0].author._id).toBe(userId);
    });
    
    it('should filter search by date range', async () => {
      const today = new Date();
      const startDate = new Date(today);
      startDate.setDate(today.getDate() - 1);
      
      const endDate = new Date(today);
      endDate.setDate(today.getDate() + 1);
      
      const startDateStr = startDate.toISOString().split('T')[0];
      const endDateStr = endDate.toISOString().split('T')[0];
      
      const res = await request(app).get(`/api/search?q=test&startDate=${startDateStr}&endDate=${endDateStr}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('blogs');
      expect(res.body.blogs.length).toBeGreaterThan(0);
    });
    
    it('should sort search results', async () => {
      const res = await request(app).get('/api/search?q=test&sortBy=title&sortOrder=asc');
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('blogs');
    });
    
    it('should paginate search results', async () => {
      const res = await request(app).get('/api/search?q=test&page=1&limit=5');
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('blogs');
      expect(res.body).toHaveProperty('pagination');
      expect(res.body.pagination).toHaveProperty('page', 1);
      expect(res.body.pagination).toHaveProperty('limit', 5);
    });
    
    it('should save search history for authenticated users', async () => {
      const res = await request(app)
        .get('/api/search?q=authenticated-search')
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toEqual(200);
      
      // Check if search history was saved
      const historyRes = await request(app)
        .get('/api/search/history')
        .set('Authorization', `Bearer ${token}`);
      
      expect(historyRes.statusCode).toEqual(200);
      expect(historyRes.body).toHaveProperty('searchHistory');
      expect(historyRes.body.searchHistory.some(item => item.query === 'authenticated-search')).toBeTruthy();
    });
  });
  
  describe('GET /api/search/suggestions', () => {
    it('should get search suggestions', async () => {
      const res = await request(app).get('/api/search/suggestions?q=search');
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('blogs');
      expect(res.body).toHaveProperty('tags');
      expect(res.body).toHaveProperty('categories');
      expect(res.body).toHaveProperty('authors');
    });
    
    it('should limit search suggestions', async () => {
      const res = await request(app).get('/api/search/suggestions?q=test&limit=2');
      
      expect(res.statusCode).toEqual(200);
      
      // Check if each suggestion type has at most 2 items
      Object.values(res.body).forEach(suggestions => {
        expect(suggestions.length).toBeLessThanOrEqual(2);
      });
    });
  });
  
  describe('GET /api/search/history', () => {
    it('should get user search history', async () => {
      const res = await request(app)
        .get('/api/search/history')
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('searchHistory');
      expect(Array.isArray(res.body.searchHistory)).toBeTruthy();
    });
    
    it('should not get search history without authentication', async () => {
      const res = await request(app).get('/api/search/history');
      
      expect(res.statusCode).toEqual(401);
    });
  });
  
  describe('DELETE /api/search/history', () => {
    it('should clear user search history', async () => {
      // First make a search to ensure there's history
      await request(app)
        .get('/api/search?q=to-be-cleared')
        .set('Authorization', `Bearer ${token}`);
      
      // Then clear the history
      const res = await request(app)
        .delete('/api/search/history')
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message', 'Search history cleared');
      
      // Verify history is cleared
      const historyRes = await request(app)
        .get('/api/search/history')
        .set('Authorization', `Bearer ${token}`);
      
      expect(historyRes.statusCode).toEqual(200);
      expect(historyRes.body.searchHistory).toHaveLength(0);
    });
    
    it('should not clear search history without authentication', async () => {
      const res = await request(app).delete('/api/search/history');
      
      expect(res.statusCode).toEqual(401);
    });
  });
});