const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const User = require('./models/User')
const Blog = require('./models/Blog')
const Category = require('./models/Category')
const Tag = require('./models/Tag')
const config = require('./config')

async function simpleSeed() {
  try {
    await mongoose.connect(config.MONGODB_URI)
    console.log('Connected to MongoDB')
    
    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Blog.deleteMany({}),
      Category.deleteMany({}),
      Tag.deleteMany({})
    ])
    console.log('Cleared existing data')
    
    // Create categories
    const categories = await Category.create([
      { name: 'Technology', description: 'Tech news and tutorials' },
      { name: 'Lifestyle', description: 'Personal development tips' },
      { name: 'Travel', description: 'Travel guides and adventures' }
    ])
    console.log('Created categories')
    
    // Create tags
    const tags = await Tag.create([
      { name: 'react', displayName: 'React' },
      { name: 'javascript', displayName: 'JavaScript' },
      { name: 'web-development', displayName: 'Web Development' },
      { name: 'mindfulness', displayName: 'Mindfulness' }
    ])
    console.log('Created tags')
    
    // Create users
    const hashedPassword = await bcrypt.hash('user123', 10)
    const users = await User.create([
      {
        name: 'Admin User',
        email: 'admin@blogsink.com',
        password: hashedPassword,
        role: 'admin'
      },
      {
        name: 'John Doe',
        email: 'john@blogsink.com',
        password: hashedPassword
      }
    ])
    console.log('Created users')
    
    // Create blogs
    const blogs = await Blog.create([
      {
        title: 'Getting Started with React',
        content: '<h2>Introduction to React</h2><p>React is a powerful JavaScript library for building user interfaces.</p>',
        excerpt: 'Learn the basics of React development',
        category: categories[0]._id,
        tags: [tags[0]._id, tags[1]._id],
        author: users[1]._id,
        published: true,
        slug: 'getting-started-with-react-' + Date.now()
      },
      {
        title: 'Mindful Living Tips',
        content: '<h2>What is Mindfulness?</h2><p>Mindfulness is the practice of being present in the moment.</p>',
        excerpt: 'Discover the power of mindfulness',
        category: categories[1]._id,
        tags: [tags[3]._id],
        author: users[1]._id,
        published: true,
        slug: 'mindful-living-tips-' + Date.now()
      }
    ])
    console.log('Created blogs')
    
    console.log('Simple seeding completed successfully!')
    console.log('Test users:')
    console.log('- admin@blogsink.com / user123')
    console.log('- john@blogsink.com / user123')
    
  } catch (error) {
    console.error('Simple seeding error:', error)
  } finally {
    await mongoose.disconnect()
    console.log('Disconnected from MongoDB')
  }
}

simpleSeed()
