const multer = require('multer');
const path = require('path');
const fs = require('fs');
const express = require('express');
const { 
  cloudinary, 
  blogImageUpload, 
  profileImageUpload, 
  getImageUrl, 
  isCloudinaryConfigured 
} = require('../config/cloudinary');

// Middleware to handle blog image uploads
const uploadBlogImage = (req, res, next) => {
  const upload = blogImageUpload.single('image');
  
  upload(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ message: 'File size too large. Maximum size is 5MB.' });
        }
        return res.status(400).json({ message: `Upload error: ${err.message}` });
      } else {
        // An unknown error occurred
        return res.status(500).json({ message: `Server error: ${err.message}` });
      }
    }
    
    // If no file was uploaded
    if (!req.file) {
      return next(); // Continue without image
    }
    
    // Process the uploaded file (works with both Cloudinary and local storage)
    if (isCloudinaryConfigured) {
      // For Cloudinary storage
      req.body.imageUrl = req.file.path;
      req.body.imagePublicId = req.file.filename;
    } else {
      // For local storage
      req.body.imageUrl = `/uploads/${req.file.filename}`;
    }
    
    next();
  });
};

// Middleware to handle profile image uploads
const uploadProfileImage = (req, res, next) => {
  const upload = profileImageUpload.single('avatar');
  
  upload(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ message: 'File size too large. Maximum size is 2MB.' });
        }
        return res.status(400).json({ message: `Upload error: ${err.message}` });
      } else {
        // An unknown error occurred
        return res.status(500).json({ message: `Server error: ${err.message}` });
      }
    }
    
    // If no file was uploaded
    if (!req.file) {
      return next(); // Continue without image
    }
    
    // Process the uploaded file (works with both Cloudinary and local storage)
    if (isCloudinaryConfigured) {
      // For Cloudinary storage
      req.body.avatar = req.file.path;
      req.body.avatarPublicId = req.file.filename;
    } else {
      // For local storage
      req.body.avatar = `/uploads/profiles/${req.file.filename}`;
    }
    next();
  });
};

// Helper function to delete an image from Cloudinary or local storage
const deleteImage = async (publicId) => {
  if (!publicId) return { success: false, message: 'No public ID provided' };
  
  try {
    // Handle local storage
    if (!isCloudinaryConfigured) {
      // If it's a local path
      if (publicId.startsWith('/uploads/')) {
        const localPath = path.join(__dirname, '..', publicId);
        if (fs.existsSync(localPath)) {
          fs.unlinkSync(localPath);
        }
        return { success: true };
      }
      return { success: false, message: 'Invalid file path' };
    }
    
    // Handle Cloudinary
    // Extract public ID from Cloudinary URL if needed
    let id = publicId;
    if (publicId.includes('cloudinary.com')) {
      // Extract the public ID from the URL
      const parts = publicId.split('/');
      const fileNameWithExtension = parts[parts.length - 1];
      const fileName = fileNameWithExtension.split('.')[0];
      id = `blogsink/${fileName}`; // Adjust folder as needed
    }
    
    const result = await cloudinary.uploader.destroy(id);
    return { success: true, result };
  } catch (error) {
    console.error('Error deleting image:', error);
    return { success: false, message: error.message };
  }
};

module.exports = {
  uploadBlogImage,
  uploadProfileImage,
  deleteImage
};