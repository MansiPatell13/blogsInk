const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const Blog = require('../models/Blog');
const User = require('../models/User');
const Category = require('../models/Category');
const Tag = require('../models/Tag');

let token;
let userId;
let blogId;
let categoryId;
let tagId;

// Mock data
const testUser = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'password123'
};

const testCategory = {
  name: 'Test Category',
  description: 'Test category description'
};

const testTag = {
  name: 'test-tag',
  displayName: 'Test Tag'
};

const testBlog = {
  title: 'Test Blog',
  excerpt: 'This is a test blog excerpt',
  content: 'This is the content of the test blog',
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
  
  // Create a test category (as admin)
  const categoryResponse = await request(app)
    .post('/api/categories')
    .set('Authorization', `Bearer ${token}`)
    .send(testCategory);
  
  categoryId = categoryResponse.body._id;
  
  // Create a test tag (as admin)
  const tagResponse = await request(app)
    .post('/api/tags')
    .set('Authorization', `Bearer ${token}`)
    .send(testTag);
  
  tagId = tagResponse.body._id;
});

// Clean up after tests
afterAll(async () => {
  // Delete test data
  await Blog.deleteMany({ author: userId });
  await User.findByIdAndDelete(userId);
  await Category.findByIdAndDelete(categoryId);
  await Tag.findByIdAndDelete(tagId);
  
  // Close MongoDB connection
  await mongoose.connection.close();
});

describe('Blog API', () => {
  describe('GET /api/blogs', () => {
    it('should get all blogs', async () => {
      const res = await request(app).get('/api/blogs');
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('blogs');
      expect(res.body).toHaveProperty('pagination');
    });
    
    it('should filter blogs by search term', async () => {
      const res = await request(app).get('/api/blogs?search=test');
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('blogs');
    });
    
    it('should filter blogs by category', async () => {
      const res = await request(app).get(`/api/blogs?category=${categoryId}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('blogs');
    });
    
    it('should filter blogs by tag', async () => {
      const res = await request(app).get(`/api/blogs?tag=${tagId}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('blogs');
    });
    
    it('should filter blogs by author', async () => {
      const res = await request(app).get(`/api/blogs?author=${userId}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('blogs');
    });
    
    it('should sort blogs', async () => {
      const res = await request(app).get('/api/blogs?sort=title&order=asc');
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('blogs');
    });
    
    it('should paginate blogs', async () => {
      const res = await request(app).get('/api/blogs?page=1&limit=5');
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('blogs');
      expect(res.body).toHaveProperty('pagination');
      expect(res.body.pagination).toHaveProperty('page', 1);
      expect(res.body.pagination).toHaveProperty('limit', 5);
    });
  });
  
  describe('POST /api/blogs', () => {
    it('should create a new blog', async () => {
      const blogData = {
        ...testBlog,
        category: categoryId,
        tags: [tagId]
      };
      
      const res = await request(app)
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(blogData);
      
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('title', testBlog.title);
      expect(res.body).toHaveProperty('slug');
      expect(res.body).toHaveProperty('author', userId);
      
      blogId = res.body._id; // Save for later tests
    });
    
    it('should not create a blog without required fields', async () => {
      const res = await request(app)
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Incomplete Blog'
        });
      
      expect(res.statusCode).toEqual(400);
    });
    
    it('should not create a blog without authentication', async () => {
      const res = await request(app)
        .post('/api/blogs')
        .send(testBlog);
      
      expect(res.statusCode).toEqual(401);
    });
  });
  
  describe('GET /api/blogs/:id', () => {
    it('should get a blog by ID', async () => {
      const res = await request(app).get(`/api/blogs/${blogId}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('_id', blogId);
      expect(res.body).toHaveProperty('title', testBlog.title);
      expect(res.body).toHaveProperty('author');
      expect(res.body.author).toHaveProperty('_id', userId);
      expect(res.body).toHaveProperty('category');
      expect(res.body).toHaveProperty('tags');
    });
    
    it('should return 404 for non-existent blog', async () => {
      const res = await request(app).get(`/api/blogs/60f1b5b5b5b5b5b5b5b5b5b5`);
      
      expect(res.statusCode).toEqual(404);
    });
  });
  
  describe('PUT /api/blogs/:id', () => {
    it('should update a blog', async () => {
      const updatedData = {
        title: 'Updated Test Blog',
        excerpt: 'This is an updated test blog excerpt'
      };
      
      const res = await request(app)
        .put(`/api/blogs/${blogId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updatedData);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('title', updatedData.title);
      expect(res.body).toHaveProperty('excerpt', updatedData.excerpt);
    });
    
    it('should not update a blog without authentication', async () => {
      const res = await request(app)
        .put(`/api/blogs/${blogId}`)
        .send({ title: 'Unauthorized Update' });
      
      expect(res.statusCode).toEqual(401);
    });
    
    it('should not allow a user to update another user\'s blog', async () => {
      // Create another user
      const anotherUser = {
        name: 'Another User',
        email: 'another@example.com',
        password: 'password123'
      };
      
      const userRes = await request(app)
        .post('/api/auth/register')
        .send(anotherUser);
      
      const anotherToken = userRes.body.token;
      
      // Try to update the blog with the new user
      const res = await request(app)
        .put(`/api/blogs/${blogId}`)
        .set('Authorization', `Bearer ${anotherToken}`)
        .send({ title: 'Unauthorized Update' });
      
      expect(res.statusCode).toEqual(403);
      
      // Clean up
      await User.findByIdAndDelete(userRes.body.user._id);
    });
  });
  
  describe('POST /api/blogs/:id/like', () => {
    it('should like a blog', async () => {
      const res = await request(app)
        .post(`/api/blogs/${blogId}/like`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message', 'Blog liked');
      expect(res.body).toHaveProperty('likes');
    });
    
    it('should unlike a blog that was already liked', async () => {
      const res = await request(app)
        .post(`/api/blogs/${blogId}/like`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message', 'Blog unliked');
    });
    
    it('should not like a blog without authentication', async () => {
      const res = await request(app)
        .post(`/api/blogs/${blogId}/like`);
      
      expect(res.statusCode).toEqual(401);
    });
  });
  
  describe('PATCH /api/blogs/:id/status', () => {
    it('should update blog status', async () => {
      const res = await request(app)
        .patch(`/api/blogs/${blogId}/status`)
        .set('Authorization', `Bearer ${token}`)
        .send({ status: 'draft' });
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('status', 'draft');
      expect(res.body).toHaveProperty('publishedAt', null);
    });
    
    it('should set publishedAt when publishing a blog', async () => {
      const res = await request(app)
        .patch(`/api/blogs/${blogId}/status`)
        .set('Authorization', `Bearer ${token}`)
        .send({ status: 'published' });
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('status', 'published');
      expect(res.body).toHaveProperty('publishedAt');
      expect(res.body.publishedAt).not.toBeNull();
    });
    
    it('should not update status with invalid value', async () => {
      const res = await request(app)
        .patch(`/api/blogs/${blogId}/status`)
        .set('Authorization', `Bearer ${token}`)
        .send({ status: 'invalid' });
      
      expect(res.statusCode).toEqual(400);
    });
  });
  
  describe('DELETE /api/blogs/:id', () => {
    it('should delete a blog', async () => {
      const res = await request(app)
        .delete(`/api/blogs/${blogId}`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message', 'Blog removed');
    });
    
    it('should return 404 for deleted blog', async () => {
      const res = await request(app).get(`/api/blogs/${blogId}`);
      
      expect(res.statusCode).toEqual(404);
    });
  });
});