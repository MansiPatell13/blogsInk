const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const User = require('./models/User')
const Blog = require('./models/Blog')
const Comment = require('./models/Comment')
const Category = require('./models/Category')
const Tag = require('./models/Tag')
const config = require('./config')
const dummyBlogs = require('./data/dummyBlogs')

// Sample data
const sampleUsers = [
  {
    name: 'Admin User',
    email: 'admin@blogsink.com',
    password: 'admin123',
    role: 'admin',
    bio: 'Administrator of BlogSink platform',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  },
  {
    name: 'John Doe',
    email: 'john@blogsink.com',
    password: 'user123',
    bio: 'Tech enthusiast and blogger',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
  },
  {
    name: 'Jane Smith',
    email: 'jane@blogsink.com',
    password: 'user123',
    bio: 'Lifestyle blogger and travel enthusiast',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
  }
]

const sampleCategories = [
  { name: 'Technology', description: 'Tech news, tutorials, and insights', color: '#3B82F6' },
  { name: 'Lifestyle', description: 'Personal development and lifestyle tips', color: '#10B981' },
  { name: 'Travel', description: 'Travel guides and adventures', color: '#F59E0B' },
  { name: 'Health', description: 'Health and wellness articles', color: '#EF4444' },
  { name: 'Business', description: 'Business insights and strategies', color: '#8B5CF6' },
  { name: 'Education', description: 'Learning and educational content', color: '#06B6D4' }
]

const sampleTags = [
  { name: 'react', displayName: 'React', color: '#61DAFB' },
  { name: 'javascript', displayName: 'JavaScript', color: '#F7DF1E' },
  { name: 'typescript', displayName: 'TypeScript', color: '#3178C6' },
  { name: 'web-development', displayName: 'Web Development', color: '#4F46E5' },
  { name: 'mindfulness', displayName: 'Mindfulness', color: '#059669' },
  { name: 'meditation', displayName: 'Meditation', color: '#7C3AED' },
  { name: 'photography', displayName: 'Photography', color: '#DC2626' },
  { name: 'travel-tips', displayName: 'Travel Tips', color: '#EA580C' },
  { name: 'wellness', displayName: 'Wellness', color: '#16A34A' },
  { name: 'productivity', displayName: 'Productivity', color: '#0891B2' }
]

const sampleBlogs = [
  {
    title: 'Getting Started with React Development',
    content: `
      <h2>Introduction to React</h2>
      <p>React is a powerful JavaScript library for building user interfaces. It was developed by Facebook and has become one of the most popular frontend frameworks.</p>
      
      <h3>Key Features</h3>
      <ul>
        <li>Component-based architecture</li>
        <li>Virtual DOM for performance</li>
        <li>JSX syntax</li>
        <li>Unidirectional data flow</li>
      </ul>
      
      <h3>Setting Up Your First React App</h3>
      <p>To create a new React application, you can use Create React App:</p>
      <pre><code>npx create-react-app my-app
cd my-app
npm start</code></pre>
      
      <p>This will create a new React project with all the necessary dependencies and start the development server.</p>
    `,
    excerpt: 'Learn the basics of React development and how to set up your first React application with step-by-step instructions.',
    category: 'Technology',
    tags: ['react', 'javascript', 'web-development'],
    published: true,
    featured: true,
    readTime: 5
  },
  {
    title: 'The Art of Mindful Living',
    content: `
      <h2>What is Mindfulness?</h2>
      <p>Mindfulness is the practice of being present and fully engaged in the current moment, without judgment or distraction.</p>
      
      <h3>Benefits of Mindfulness</h3>
      <ul>
        <li>Reduced stress and anxiety</li>
        <li>Improved focus and concentration</li>
        <li>Better emotional regulation</li>
        <li>Enhanced relationships</li>
      </ul>
      
      <h3>Simple Mindfulness Practices</h3>
      <p>Start with just 5 minutes of meditation each day:</p>
      <ol>
        <li>Find a quiet, comfortable space</li>
        <li>Sit with your back straight</li>
        <li>Close your eyes and focus on your breath</li>
        <li>When your mind wanders, gently return to your breath</li>
      </ol>
    `,
    excerpt: 'Discover the transformative power of mindfulness and learn practical techniques to incorporate it into your daily life.',
    category: 'Lifestyle',
    tags: ['mindfulness', 'meditation', 'wellness'],
    published: true,
    featured: false,
    readTime: 4
  },
  {
    title: 'Essential Travel Photography Tips',
    content: `
      <h2>Capturing Memories Around the World</h2>
      <p>Travel photography is about more than just taking pictures - it's about telling stories and preserving memories.</p>
      
      <h3>Equipment Essentials</h3>
      <ul>
        <li>Lightweight camera body</li>
        <li>Versatile zoom lens</li>
        <li>Extra batteries and memory cards</li>
        <li>Portable tripod</li>
      </ul>
      
      <h3>Composition Tips</h3>
      <p>Remember the rule of thirds and look for leading lines in your shots. Don't be afraid to experiment with different angles and perspectives.</p>
      
      <h3>Lighting Considerations</h3>
      <p>Golden hour (just after sunrise and before sunset) provides the most beautiful natural light for photography.</p>
    `,
    excerpt: 'Master the art of travel photography with these essential tips and techniques for capturing stunning images on your adventures.',
    category: 'Travel',
    tags: ['photography', 'travel-tips'],
    published: true,
    featured: false,
    readTime: 6
  }
]

const sampleComments = [
  {
    content: 'Great article! I especially liked the section about component architecture.',
    author: null, // Will be set to user ID
    blog: null,   // Will be set to blog ID
    likes: []
  },
  {
    content: 'This helped me understand React much better. Thanks for sharing!',
    author: null,
    blog: null,
    likes: []
  },
  {
    content: 'I\'ve been practicing mindfulness for years and this article captures the essence perfectly.',
    author: null,
    blog: null,
    likes: []
  }
]

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.MONGODB_URI)
    console.log('Connected to MongoDB')
    
    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Blog.deleteMany({}),
      Comment.deleteMany({}),
      Category.deleteMany({}),
      Tag.deleteMany({})
    ])
    console.log('Cleared existing data')
    
    // Create categories
    const createdCategories = []
    for (const categoryData of sampleCategories) {
      const category = new Category(categoryData)
      await category.save()
      createdCategories.push(category)
      console.log(`Created category: ${category.name}`)
    }
    
    // Create tags
    const createdTags = []
    for (const tagData of sampleTags) {
      const tag = new Tag(tagData)
      await tag.save()
      createdTags.push(tag)
      console.log(`Created tag: ${tag.name}`)
    }
    
    // Create users
    const createdUsers = []
    for (const userData of sampleUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 10)
      const user = new User({
        ...userData,
        password: hashedPassword
      })
      await user.save()
      createdUsers.push(user)
      console.log(`Created user: ${user.name}`)
    }
    
    // Create blogs
    const createdBlogs = []
    
    // Add sample blogs
    for (let i = 0; i < sampleBlogs.length; i++) {
      const blogData = sampleBlogs[i]
      const category = createdCategories.find(c => c.name === blogData.category)
      const tagIds = blogData.tags.map(tagName => {
        const tag = createdTags.find(t => t.name === tagName)
        return tag ? tag._id : null
      }).filter(id => id !== null)
      
      const blog = new Blog({
        ...blogData,
        category: category ? category._id : createdCategories[0]._id,
        tags: tagIds,
        author: createdUsers[i % createdUsers.length]._id
      })
      await blog.save()
      createdBlogs.push(blog)
      console.log(`Created blog: ${blog.title}`)
    }
    
    // Add dummy blogs
    for (let i = 0; i < dummyBlogs.length; i++) {
      const blogData = dummyBlogs[i]
      const category = createdCategories[Math.floor(Math.random() * createdCategories.length)]
      const randomTags = createdTags.slice(0, Math.floor(Math.random() * 3) + 1)
      
      // Generate slug from title
      const slug = blogData.title
        .toLowerCase()
        .replace(/[^\w\s]/gi, '')
        .replace(/\s+/g, '-')
        .concat('-', Date.now().toString().slice(-4))
      
      const blog = new Blog({
        title: blogData.title,
        content: blogData.content,
        excerpt: blogData.excerpt,
        category: category._id,
        tags: randomTags.map(tag => tag._id),
        author: createdUsers[i % createdUsers.length]._id,
        imageUrl: blogData.imageUrl,
        published: true,
        featured: Math.random() > 0.7, // 30% chance of being featured
        readTime: Math.ceil(blogData.content.length / 1000), // Rough estimate
        slug: slug
      })
      await blog.save()
      createdBlogs.push(blog)
      console.log(`Created dummy blog: ${blog.title}`)
    }
    
    // Create comments
    for (let i = 0; i < sampleComments.length; i++) {
      const commentData = sampleComments[i]
      const comment = new Comment({
        ...commentData,
        author: createdUsers[i % createdUsers.length]._id,
        blog: createdBlogs[i % createdBlogs.length]._id
      })
      await comment.save()
      console.log(`Created comment: ${comment.content.substring(0, 50)}...`)
    }
    
    // Update blog comment counts
    for (const blog of createdBlogs) {
      const commentCount = await Comment.countDocuments({ blog: blog._id })
      blog.comments = commentCount
      await blog.save()
    }
    
    // Update category and tag blog counts
    for (const category of createdCategories) {
      await category.updateBlogCount()
    }
    
    for (const tag of createdTags) {
      await tag.updateBlogCount()
    }
    
    console.log('Database seeded successfully!')
    console.log(`Created ${createdUsers.length} users`)
    console.log(`Created ${createdCategories.length} categories`)
    console.log(`Created ${createdTags.length} tags`)
    console.log(`Created ${createdBlogs.length} blogs`)
    console.log(`Created ${sampleComments.length} comments`)
    
  } catch (error) {
    console.error('Seeding error:', error)
  } finally {
    await mongoose.disconnect()
    console.log('Disconnected from MongoDB')
  }
}

// Run seeder if this file is executed directly
if (require.main === module) {
  seedDatabase()
}

module.exports = seedDatabase
