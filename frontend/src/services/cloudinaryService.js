// Cloudinary service for image uploads (only backend connection we keep)
class CloudinaryService {
  constructor() {
    this.cloudName = 'your-cloud-name' // Replace with actual Cloudinary cloud name
    this.uploadPreset = 'your-upload-preset' // Replace with actual upload preset
    this.apiUrl = `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`
  }

  async uploadImage(file, options = {}) {
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', this.uploadPreset)
      
      // Add optional parameters
      if (options.folder) {
        formData.append('folder', options.folder)
      }
      if (options.public_id) {
        formData.append('public_id', options.public_id)
      }
      if (options.tags) {
        formData.append('tags', options.tags.join(','))
      }

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`)
      }

      const result = await response.json()
      
      return {
        success: true,
        data: {
          url: result.secure_url,
          public_id: result.public_id,
          width: result.width,
          height: result.height,
          format: result.format,
          bytes: result.bytes
        }
      }
    } catch (error) {
      console.error('Cloudinary upload error:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  async deleteImage(publicId) {
    try {
      // Note: Deletion requires server-side implementation with API secret
      // This is a placeholder for the frontend
      console.log('Image deletion requested for:', publicId)
      return {
        success: true,
        message: 'Image deletion requested'
      }
    } catch (error) {
      console.error('Cloudinary delete error:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // Generate optimized image URLs
  generateOptimizedUrl(publicId, options = {}) {
    const baseUrl = `https://res.cloudinary.com/${this.cloudName}/image/upload`
    
    let transformations = []
    
    if (options.width) transformations.push(`w_${options.width}`)
    if (options.height) transformations.push(`h_${options.height}`)
    if (options.crop) transformations.push(`c_${options.crop}`)
    if (options.quality) transformations.push(`q_${options.quality}`)
    if (options.format) transformations.push(`f_${options.format}`)
    
    const transformationString = transformations.length > 0 ? 
      transformations.join(',') + '/' : ''
    
    return `${baseUrl}/${transformationString}${publicId}`
  }

  // Validate file before upload
  validateFile(file) {
    const maxSize = 5 * 1024 * 1024 // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    
    if (!file) {
      return { valid: false, error: 'No file selected' }
    }
    
    if (file.size > maxSize) {
      return { valid: false, error: 'File size must be less than 5MB' }
    }
    
    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: 'Only JPEG, PNG, GIF, and WebP files are allowed' }
    }
    
    return { valid: true }
  }
}

// Create and export singleton instance
const cloudinaryService = new CloudinaryService()
export default cloudinaryService
