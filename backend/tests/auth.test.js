const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');

let token;
let userId;

// Mock data
const testUser = {
  name: 'Auth Test User',
  email: 'authtest@example.com',
  password: 'password123'
};

// Clean up after tests
afterAll(async () => {
  // Delete test data
  await User.findByIdAndDelete(userId);
  
  // Close MongoDB connection
  await mongoose.connection.close();
});

describe('Authentication API', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser);
      
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty('user');
      expect(res.body.user).toHaveProperty('name', testUser.name);
      expect(res.body.user).toHaveProperty('email', testUser.email);
      expect(res.body.user).not.toHaveProperty('password');
      
      token = res.body.token;
      userId = res.body.user._id;
    });
    
    it('should not register a user with an existing email', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser);
      
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error');
    });
    
    it('should not register a user without required fields', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Incomplete User'
        });
      
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error');
    });
    
    it('should not register a user with invalid email', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Invalid Email User',
          email: 'invalid-email',
          password: 'password123'
        });
      
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error');
    });
    
    it('should not register a user with short password', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Short Password User',
          email: 'shortpass@example.com',
          password: 'short'
        });
      
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error');
    });
  });
  
  describe('POST /api/auth/login', () => {
    it('should login an existing user', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty('user');
      expect(res.body.user).toHaveProperty('name', testUser.name);
      expect(res.body.user).toHaveProperty('email', testUser.email);
    });
    
    it('should not login with incorrect password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword'
        });
      
      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('error');
    });
    
    it('should not login with non-existent email', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123'
        });
      
      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('error');
    });
  });
  
  describe('GET /api/auth/me', () => {
    it('should get current user profile', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('_id', userId);
      expect(res.body).toHaveProperty('name', testUser.name);
      expect(res.body).toHaveProperty('email', testUser.email);
      expect(res.body).not.toHaveProperty('password');
    });
    
    it('should not get profile without authentication', async () => {
      const res = await request(app).get('/api/auth/me');
      
      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('error');
    });
    
    it('should not get profile with invalid token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalidtoken');
      
      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('error');
    });
  });
  
  describe('PUT /api/auth/updatedetails', () => {
    it('should update user details', async () => {
      const updatedDetails = {
        name: 'Updated Auth User',
        email: testUser.email, // Keep the same email to avoid conflicts
        bio: 'This is a test bio',
        website: 'https://example.com',
        location: 'Test Location'
      };
      
      const res = await request(app)
        .put('/api/auth/updatedetails')
        .set('Authorization', `Bearer ${token}`)
        .send(updatedDetails);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('name', updatedDetails.name);
      expect(res.body).toHaveProperty('bio', updatedDetails.bio);
      expect(res.body).toHaveProperty('website', updatedDetails.website);
      expect(res.body).toHaveProperty('location', updatedDetails.location);
    });
    
    it('should not update user details without authentication', async () => {
      const res = await request(app)
        .put('/api/auth/updatedetails')
        .send({ name: 'Unauthorized Update' });
      
      expect(res.statusCode).toEqual(401);
    });
    
    it('should not update email to an existing one', async () => {
      // Create another user first
      const anotherUser = {
        name: 'Another Auth User',
        email: 'another-auth@example.com',
        password: 'password123'
      };
      
      await request(app)
        .post('/api/auth/register')
        .send(anotherUser);
      
      // Try to update to the email of the other user
      const res = await request(app)
        .put('/api/auth/updatedetails')
        .set('Authorization', `Bearer ${token}`)
        .send({ email: anotherUser.email });
      
      expect(res.statusCode).toEqual(400);
      
      // Clean up
      await User.findOneAndDelete({ email: anotherUser.email });
    });
  });
  
  describe('PUT /api/auth/updatepassword', () => {
    it('should update user password', async () => {
      const passwordUpdate = {
        currentPassword: testUser.password,
        newPassword: 'newpassword123'
      };
      
      const res = await request(app)
        .put('/api/auth/updatepassword')
        .set('Authorization', `Bearer ${token}`)
        .send(passwordUpdate);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('token');
      
      // Update token for subsequent tests
      token = res.body.token;
      
      // Verify can login with new password
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: passwordUpdate.newPassword
        });
      
      expect(loginRes.statusCode).toEqual(200);
    });
    
    it('should not update password with incorrect current password', async () => {
      const res = await request(app)
        .put('/api/auth/updatepassword')
        .set('Authorization', `Bearer ${token}`)
        .send({
          currentPassword: 'wrongpassword',
          newPassword: 'anothernewpassword'
        });
      
      expect(res.statusCode).toEqual(401);
    });
    
    it('should not update password without authentication', async () => {
      const res = await request(app)
        .put('/api/auth/updatepassword')
        .send({
          currentPassword: 'newpassword123',
          newPassword: 'anothernewpassword'
        });
      
      expect(res.statusCode).toEqual(401);
    });
  });
  
  describe('POST /api/auth/forgotpassword', () => {
    it('should send a reset token for a valid email', async () => {
      const res = await request(app)
        .post('/api/auth/forgotpassword')
        .send({ email: testUser.email });
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message');
    });
    
    it('should return 404 for non-existent email', async () => {
      const res = await request(app)
        .post('/api/auth/forgotpassword')
        .send({ email: 'nonexistent@example.com' });
      
      expect(res.statusCode).toEqual(404);
    });
  });
});