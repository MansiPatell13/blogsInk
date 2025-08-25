// Load environment variables
require('dotenv').config({ path: './config.env' });

// Set test environment
process.env.NODE_ENV = 'test';

// Use test database
process.env.MONGO_URI = process.env.MONGO_URI_TEST || process.env.MONGO_URI;

// Increase test timeout
jest.setTimeout(30000);

// Suppress console logs during tests
console.log = jest.fn();
console.error = jest.fn();
console.warn = jest.fn();

// Mock Cloudinary
jest.mock('cloudinary', () => ({
  v2: {
    config: jest.fn(),
    uploader: {
      upload: jest.fn().mockImplementation((file, options, callback) => {
        if (callback) {
          callback(null, {
            public_id: 'test-public-id',
            secure_url: 'https://test-cloudinary-url.com/image.jpg'
          });
        } else {
          return Promise.resolve({
            public_id: 'test-public-id',
            secure_url: 'https://test-cloudinary-url.com/image.jpg'
          });
        }
      }),
      destroy: jest.fn().mockImplementation((publicId, callback) => {
        if (callback) {
          callback(null, { result: 'ok' });
        } else {
          return Promise.resolve({ result: 'ok' });
        }
      })
    }
  }
}));

// Mock nodemailer
jest.mock('nodemailer', () => ({
  createTransport: jest.fn().mockReturnValue({
    sendMail: jest.fn().mockImplementation((mailOptions, callback) => {
      if (callback) {
        callback(null, { response: '250 Message sent' });
      } else {
        return Promise.resolve({ response: '250 Message sent' });
      }
    })
  })
}));