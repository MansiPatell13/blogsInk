const express = require('express');
const router = express.Router();
const { uploadBlogImage, uploadProfileImage, deleteImage } = require('../middleware/upload');
const { auth } = require('../middleware/auth');
const { upload, uploadToCloudinary, deleteFromCloudinary, isCloudinaryConfigured } = require('../utils/fileUpload');
const User = require('../models/User');
const Category = require('../models/Category');

// Upload a blog image
router.post('/blog-image', auth, uploadBlogImage, (req, res) => {
  if (!req.body.imageUrl) {
    return res.status(400).json({ message: 'No image was uploaded' });
  }
  
  res.status(200).json({
    success: true,
    imageUrl: req.body.imageUrl,
    publicId: req.body.imagePublicId || null
  });
});

// Upload content image for rich text editor
router.post('/content-image', auth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    let imageUrl, publicId;

    // If using Cloudinary
    if (req.file.path && !req.file.filename) {
      // File is already uploaded to Cloudinary by multer-storage-cloudinary
      imageUrl = req.file.path;
      publicId = req.file.filename;
    } else {
      // Upload to Cloudinary manually if using local storage
      const result = await uploadToCloudinary(req.file.path, {
        folder: 'blogsInk/content',
        transformation: [{ width: 1000, crop: 'limit' }]
      });
      imageUrl = result.url;
      publicId = result.publicId;
    }

    res.status(200).json({
      success: true,
      imageUrl,
      publicId
    });
  } catch (error) {
    console.error('Upload content image error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Upload a profile image
router.post('/profile-image', auth, uploadProfileImage, async (req, res) => {
  if (!req.body.avatar) {
    return res.status(400).json({ message: 'No image was uploaded' });
  }
  
  try {
    // Update user avatar in database
    const user = await User.findById(req.user.id);
    if (user) {
      // Delete old avatar if exists and has publicId
      if (user.avatarPublicId) {
        await deleteFromCloudinary(user.avatarPublicId);
      }
      
      user.avatar = req.body.avatar;
      user.avatarPublicId = req.body.avatarPublicId || null;
      await user.save();
    }
    
    res.status(200).json({
      success: true,
      avatarUrl: req.body.avatar,
      publicId: req.body.avatarPublicId || null
    });
  } catch (error) {
    console.error('Error updating user avatar:', error);
    res.status(500).json({ message: 'Server error updating user profile' });
  }
});

// Upload category image (removed admin restriction)
router.post('/category-image', auth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    let imageUrl, publicId;

    // If using Cloudinary
    if (req.file.path && !req.file.filename) {
      // File is already uploaded to Cloudinary by multer-storage-cloudinary
      imageUrl = req.file.path;
      publicId = req.file.filename;
    } else {
      // Upload to Cloudinary manually if using local storage
      const result = await uploadToCloudinary(req.file.path, {
        folder: 'blogsInk/categories',
        transformation: [{ width: 600, height: 400, crop: 'fill' }]
      });
      imageUrl = result.url;
      publicId = result.publicId;
    }

    res.status(200).json({
      success: true,
      imageUrl,
      publicId
    });
  } catch (error) {
    console.error('Upload category image error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete an image
router.delete('/:publicId', auth, async (req, res) => {
  try {
    const result = await deleteImage(req.params.publicId);
    
    if (result.success) {
      return res.status(200).json({
        success: true,
        message: 'Image deleted successfully'
      });
    } else {
      return res.status(400).json({
        success: false,
        message: result.message || 'Failed to delete image'
      });
    }
  } catch (error) {
    console.error('Error in delete image route:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting image'
    });
  }
});

// Test endpoint for file upload
router.post('/test', (req, res) => {
  // Use multer middleware directly with error handling
  upload.single('image')(req, res, async (err) => {
    try {
      // Handle multer errors
      if (err) {
        console.error('Multer error:', err);
        return res.status(400).json({ 
          success: false, 
          message: `Upload error: ${err.message}` 
        });
      }
      
      // Check if file was uploaded
      if (!req.file) {
        return res.status(400).json({ 
          success: false, 
          message: 'No file uploaded' 
        });
      }
      
      // Log the file object to help with debugging
      console.log('Uploaded file:', JSON.stringify(req.file, null, 2));
      
      let imageUrl, publicId;
      
      // Check if using Cloudinary or local storage
      if (isCloudinaryConfigured) {
        try {
          // For Cloudinary storage
          if (req.file.path && req.file.path.includes('http')) {
            // Already uploaded to Cloudinary by multer-storage-cloudinary
            imageUrl = req.file.path;
            publicId = req.file.filename;
          } else {
            // Need to upload to Cloudinary manually
            const result = await uploadToCloudinary(req.file.path);
            imageUrl = result.url;
            publicId = result.publicId;
          }
        } catch (cloudinaryError) {
          console.error('Cloudinary upload error:', cloudinaryError);
          // Fallback to local path
          imageUrl = `/uploads/${req.file.filename}`;
          publicId = null;
        }
      } else {
        // For local storage
        imageUrl = `/uploads/${req.file.filename}`;
        publicId = null;
      }
      
      res.status(200).json({
        success: true,
        message: 'File upload test successful',
        imageUrl,
        publicId,
        file: req.file
      });
    } catch (error) {
      console.error('Test upload error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'File upload failed: ' + (error.message || 'Unknown error') 
      });
    }
  });
});

module.exports = router;