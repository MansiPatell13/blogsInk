const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const config = require('../config')

// Check if Cloudinary credentials are available
const isCloudinaryConfigured = 
  config.CLOUDINARY.CLOUD_NAME && 
  config.CLOUDINARY.API_KEY && 
  config.CLOUDINARY.API_SECRET;

// Configure Cloudinary if credentials are available
if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: config.CLOUDINARY.CLOUD_NAME,
    api_key: config.CLOUDINARY.API_KEY,
    api_secret: config.CLOUDINARY.API_SECRET
  })
  console.log('Cloudinary configured successfully in fileUpload.js')
} else {
  console.warn('Cloudinary credentials not found in fileUpload.js. Using local storage fallback.')
}

// Configure local storage for fallback
const localStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads')
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    const ext = path.extname(file.originalname)
    cb(null, file.fieldname + '-' + uniqueSuffix + ext)
  }
})

// Configure Cloudinary storage if available
let cloudinaryStorage;
if (isCloudinaryConfigured) {
  cloudinaryStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'blogsInk',
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'pdf'],
      transformation: [{ width: 1000, crop: 'limit' }]
    }
  })
}

// File filter function
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = config.ALLOWED_FILE_TYPES
  const mimeType = file.mimetype
  
  if (allowedFileTypes.includes(mimeType)) {
    cb(null, true)
  } else {
    cb(new Error(`File type not allowed. Allowed types: ${allowedFileTypes.join(', ')}`), false)
  }
}

// Create upload middleware based on environment
const storage = isCloudinaryConfigured ? cloudinaryStorage : localStorage

// Configure multer with appropriate storage
const upload = multer({
  storage,
  limits: {
    fileSize: config.MAX_FILE_SIZE
  },
  fileFilter
})

// Log configuration for debugging
console.log('File upload middleware configured with:', {
  usingCloudinary: isCloudinaryConfigured,
  maxFileSize: config.MAX_FILE_SIZE,
  allowedTypes: config.ALLOWED_FILE_TYPES
})

/**
 * Upload a file to Cloudinary or return local file path if Cloudinary is not configured
 * @param {string} filePath - Path to the file
 * @param {Object} options - Upload options
 * @returns {Promise<Object>} Upload result
 */
async function uploadToCloudinary(filePath, options = {}) {
  try {
    // If Cloudinary is not configured, return local file path
    if (!isCloudinaryConfigured) {
      const filename = path.basename(filePath);
      return {
        url: `/uploads/${filename}`,
        publicId: null
      };
    }
    
    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'blogsInk',
      ...options
    });
    
    // Delete local file after upload
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    return {
      url: result.secure_url,
      publicId: result.public_id
    };
  } catch (error) {
    console.error('Upload to Cloudinary error:', error);
    throw error;
  }
}

/**
 * Delete a file from Cloudinary or local storage
 * @param {string} publicId - Public ID of the file or local file path
 * @returns {Promise<boolean>} Success status
 */
async function deleteFromCloudinary(publicId) {
  try {
    if (!publicId) return false;
    
    // If Cloudinary is not configured, try to delete local file
    if (!isCloudinaryConfigured) {
      // Check if it's a local path
      if (publicId.startsWith('/uploads/')) {
        const localPath = path.join(__dirname, '..', publicId);
        if (fs.existsSync(localPath)) {
          fs.unlinkSync(localPath);
        }
      }
      return true;
    }
    
    // Delete from Cloudinary
    await cloudinary.uploader.destroy(publicId);
    return true;
  } catch (error) {
    console.error('Delete from Cloudinary error:', error);
    return false;
  }
}

/**
 * Get file URL based on environment
 * @param {string} filename - Filename or path
 * @returns {string} File URL
 */
function getFileUrl(filename) {
  if (!filename) return null;
  
  // If it's already a full URL, return it
  if (filename.startsWith('http')) {
    return filename;
  }
  
  // If it's a path starting with /uploads, it's already a local URL
  if (filename.startsWith('/uploads/')) {
    return filename;
  }
  
  // Otherwise, construct local URL
  return `/uploads/${filename}`;
}

module.exports = {
  upload,
  uploadToCloudinary,
  deleteFromCloudinary,
  getFileUrl,
  cloudinary,
  isCloudinaryConfigured
}