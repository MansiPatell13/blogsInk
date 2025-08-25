const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary
const config = require('../config');

// Check if Cloudinary credentials are available
const isCloudinaryConfigured = 
  config.CLOUDINARY.CLOUD_NAME && 
  config.CLOUDINARY.API_KEY && 
  config.CLOUDINARY.API_SECRET;

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: config.CLOUDINARY.CLOUD_NAME,
    api_key: config.CLOUDINARY.API_KEY,
    api_secret: config.CLOUDINARY.API_SECRET
  });
  console.log('Cloudinary configured successfully');
} else {
  console.warn('Cloudinary credentials not found. Image upload functionality will be limited.');
}

// Configure storage
let storage;
let profileImageStorage;

if (isCloudinaryConfigured) {
  // Use Cloudinary storage if configured
  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'blogsink',
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
      transformation: [{ width: 1000, height: 1000, crop: 'limit' }]
    }
  });
  
  // Configure profile image storage
  profileImageStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'blogsink/profiles',
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
      transformation: [{ width: 400, height: 400, crop: 'fill', gravity: 'face' }]
    }
  });
} else {
  // Use local disk storage as fallback
  const path = require('path');
  const fs = require('fs');
  
  // Ensure upload directories exist
  const uploadsDir = path.join(__dirname, '../uploads');
  const profilesDir = path.join(uploadsDir, 'profiles');
  
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
  if (!fs.existsSync(profilesDir)) fs.mkdirSync(profilesDir, { recursive: true });
  
  // Configure local storage
  storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, uploadsDir);
    },
    filename: function(req, file, cb) {
      cb(null, `${Date.now()}-${file.originalname}`);
    }
  });
  
  profileImageStorage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, profilesDir);
    },
    filename: function(req, file, cb) {
      cb(null, `${Date.now()}-${file.originalname}`);
    }
  });
}

// Configure upload middleware with file filtering
const fileFilter = (req, file, cb) => {
  // Accept only specific image formats
  if (['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file format. Only JPEG, PNG, GIF and WebP are allowed.'), false);
  }
};

// Configure blog image upload
const blogImageUpload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter
});

// Configure profile image upload
const profileImageUpload = multer({
  storage: profileImageStorage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit for profile images
  fileFilter: fileFilter
});

// Helper function to get image URL (works with both Cloudinary and local storage)
const getImageUrl = (file) => {
  if (!file) return null;
  
  if (isCloudinaryConfigured) {
    // Return Cloudinary URL
    return file.path;
  } else {
    // Return local URL
    return `/uploads/${file.filename}`;
  }
};

module.exports = {
  cloudinary,
  blogImageUpload,
  profileImageUpload,
  getImageUrl,
  isCloudinaryConfigured
};