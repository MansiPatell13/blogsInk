/**
 * Cloudinary Integration Test Script
 * 
 * This script tests the Cloudinary integration by:
 * 1. Verifying the configuration is loaded correctly
 * 2. Testing the upload functionality
 * 3. Testing the delete functionality
 * 
 * To run this test:
 * 1. Make sure your .env file has the Cloudinary credentials
 * 2. Run: node tests/cloudinary-test.js
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { cloudinary } = require('../config/cloudinary');

// Test image path - replace with an actual test image in your project
const TEST_IMAGE_PATH = path.join(__dirname, 'test-image.jpg');

// Create a test image if it doesn't exist
const createTestImage = () => {
  if (!fs.existsSync(TEST_IMAGE_PATH)) {
    console.log('Creating a test image...');
    // Create a simple test directory if it doesn't exist
    if (!fs.existsSync(__dirname)) {
      fs.mkdirSync(__dirname, { recursive: true });
    }
    
    // For this example, we'll just copy a placeholder image or create a very basic one
    // This is a very simple 1x1 pixel JPG
    const simpleJpgData = Buffer.from([
      0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01, 0x01, 0x01, 0x00, 0x48,
      0x00, 0x48, 0x00, 0x00, 0xff, 0xdb, 0x00, 0x43, 0x00, 0x08, 0x06, 0x06, 0x07, 0x06, 0x05, 0x08,
      0x07, 0x07, 0x07, 0x09, 0x09, 0x08, 0x0a, 0x0c, 0x14, 0x0d, 0x0c, 0x0b, 0x0b, 0x0c, 0x19, 0x12,
      0x13, 0x0f, 0x14, 0x1d, 0x1a, 0x1f, 0x1e, 0x1d, 0x1a, 0x1c, 0x1c, 0x20, 0x24, 0x2e, 0x27, 0x20,
      0x22, 0x2c, 0x23, 0x1c, 0x1c, 0x28, 0x37, 0x29, 0x2c, 0x30, 0x31, 0x34, 0x34, 0x34, 0x1f, 0x27,
      0x39, 0x3d, 0x38, 0x32, 0x3c, 0x2e, 0x33, 0x34, 0x32, 0xff, 0xc0, 0x00, 0x0b, 0x08, 0x00, 0x01,
      0x00, 0x01, 0x01, 0x01, 0x11, 0x00, 0xff, 0xc4, 0x00, 0x14, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x09, 0xff, 0xc4, 0x00, 0x14,
      0x10, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0xff, 0xda, 0x00, 0x08, 0x01, 0x01, 0x00, 0x00, 0x3f, 0x00, 0x37, 0xff, 0xd9
    ]);
    
    fs.writeFileSync(TEST_IMAGE_PATH, simpleJpgData);
    console.log(`Test image created at ${TEST_IMAGE_PATH}`);
  }
};

// Test Cloudinary configuration
const testCloudinaryConfig = () => {
  console.log('\n--- Testing Cloudinary Configuration ---');
  try {
    console.log(`Cloud name: ${cloudinary.config().cloud_name}`);
    console.log('Cloudinary configuration loaded successfully');
    return true;
  } catch (error) {
    console.error('Cloudinary configuration error:', error.message);
    return false;
  }
};

// Test image upload
const testImageUpload = async () => {
  console.log('\n--- Testing Image Upload ---');
  try {
    createTestImage();
    
    const result = await cloudinary.uploader.upload(TEST_IMAGE_PATH, {
      folder: 'blogsink/test',
      resource_type: 'image'
    });
    
    console.log('Upload successful!');
    console.log(`Image URL: ${result.secure_url}`);
    console.log(`Public ID: ${result.public_id}`);
    
    return result.public_id;
  } catch (error) {
    console.error('Upload error:', error.message);
    return null;
  }
};

// Test image deletion
const testImageDeletion = async (publicId) => {
  console.log('\n--- Testing Image Deletion ---');
  if (!publicId) {
    console.error('No public ID provided for deletion test');
    return false;
  }
  
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    console.log('Deletion result:', result);
    
    if (result.result === 'ok') {
      console.log('Image deleted successfully');
      return true;
    } else {
      console.log('Image deletion failed or image not found');
      return false;
    }
  } catch (error) {
    console.error('Deletion error:', error.message);
    return false;
  }
};

// Run all tests
const runTests = async () => {
  console.log('=== CLOUDINARY INTEGRATION TEST ===');
  
  // Test configuration
  const configSuccess = testCloudinaryConfig();
  if (!configSuccess) {
    console.error('Configuration test failed. Aborting remaining tests.');
    return;
  }
  
  // Test upload
  const publicId = await testImageUpload();
  if (!publicId) {
    console.error('Upload test failed. Aborting remaining tests.');
    return;
  }
  
  // Test deletion
  const deletionSuccess = await testImageDeletion(publicId);
  
  // Summary
  console.log('\n=== TEST SUMMARY ===');
  console.log(`Configuration: ${configSuccess ? '✅ PASSED' : '❌ FAILED'}`);
  console.log(`Upload: ${publicId ? '✅ PASSED' : '❌ FAILED'}`);
  console.log(`Deletion: ${deletionSuccess ? '✅ PASSED' : '❌ FAILED'}`);
  
  if (configSuccess && publicId && deletionSuccess) {
    console.log('\n🎉 All tests passed! Cloudinary integration is working correctly.');
  } else {
    console.log('\n❌ Some tests failed. Please check the logs above for details.');
  }
};

// Run the tests
runTests().catch(error => {
  console.error('Test execution error:', error);
});