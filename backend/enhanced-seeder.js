const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const User = require('./models/User')
const Blog = require('./models/Blog')
const Comment = require('./models/Comment')
const Category = require('./models/Category')
const Tag = require('./models/Tag')
const config = require('./config')

async function enhancedSeed() {
  try {
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
    const categories = await Category.create([
      { name: 'Technology', description: 'Tech news and tutorials', color: '#3B82F6' },
      { name: 'Lifestyle', description: 'Personal development tips', color: '#10B981' },
      { name: 'Travel', description: 'Travel guides and adventures', color: '#F59E0B' },
      { name: 'Health', description: 'Health and wellness articles', color: '#EF4444' },
      { name: 'Business', description: 'Business insights and strategies', color: '#8B5CF6' }
    ])
    console.log('Created categories')
    
    // Create tags
    const tags = await Tag.create([
      { name: 'react', displayName: 'React', color: '#61DAFB' },
      { name: 'javascript', displayName: 'JavaScript', color: '#F7DF1E' },
      { name: 'web-development', displayName: 'Web Development', color: '#4F46E5' },
      { name: 'mindfulness', displayName: 'Mindfulness', color: '#059669' },
      { name: 'photography', displayName: 'Photography', color: '#DC2626' },
      { name: 'travel-tips', displayName: 'Travel Tips', color: '#EA580C' },
      { name: 'wellness', displayName: 'Wellness', color: '#16A34A' },
      { name: 'productivity', displayName: 'Productivity', color: '#0891B2' }
    ])
    console.log('Created tags')
    
    // Create users
    const hashedPassword = await bcrypt.hash('user123', 10)
    const users = await User.create([
      {
        name: 'Admin User',
        email: 'admin@blogsink.com',
        password: hashedPassword,
        role: 'admin',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
      },
      {
        name: 'John Doe',
        email: 'john@blogsink.com',
        password: hashedPassword,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
      },
      {
        name: 'Jane Smith',
        email: 'jane@blogsink.com',
        password: hashedPassword,
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
      }
    ])
    console.log('Created users')
    
    // Create blogs with images
    const blogs = await Blog.create([
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
        category: categories[0]._id,
        tags: [tags[0]._id, tags[1]._id, tags[2]._id],
        author: users[1]._id,
        published: true,
        slug: 'getting-started-with-react-' + Date.now(),
        imageUrl: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
        likes: [users[0]._id, users[2]._id],
        views: 1250,
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
        category: categories[1]._id,
        tags: [tags[3]._id, tags[6]._id],
        author: users[2]._id,
        published: true,
        slug: 'art-of-mindful-living-' + Date.now(),
        imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
        likes: [users[0]._id, users[1]._id],
        views: 890,
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
        category: categories[2]._id,
        tags: [tags[4]._id, tags[5]._id],
        author: users[1]._id,
        published: true,
        slug: 'travel-photography-tips-' + Date.now(),
        imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
        likes: [users[0]._id, users[2]._id],
        views: 567,
        readTime: 6
      },
      {
        title: 'JavaScript Promises Deep Dive',
        content: `
          <h2>Understanding JavaScript Promises</h2>
          <p>JavaScript Promises are a powerful way to handle asynchronous operations. In this blog post, we'll dive deep into how Promises work.</p>
          
          <h3>What is a Promise?</h3>
          <p>A Promise is an object representing the eventual completion or failure of an asynchronous operation.</p>
          
          <h3>Creating a Promise</h3>
          <pre><code>const myPromise = new Promise((resolve, reject) => {
  // Asynchronous operation
  const success = true;
  
  if (success) {
    resolve('Operation completed successfully!');
  } else {
    reject('Operation failed!');
  }
});</code></pre>
        `,
        excerpt: 'Learn how JavaScript Promises work and how to use them effectively for handling asynchronous operations in your code.',
        category: categories[0]._id,
        tags: [tags[1]._id, tags[2]._id],
        author: users[1]._id,
        published: true,
        slug: 'javascript-promises-deep-dive-' + Date.now(),
        imageUrl: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1374&q=80',
        likes: [users[0]._id],
        views: 432,
        readTime: 7
      }
    ])
    console.log('Created blogs')
    
    // Create comments
    const comments = await Comment.create([
      {
        content: 'Great article! I especially liked the section about component architecture. This really helped me understand React better.',
        author: users[0]._id,
        blog: blogs[0]._id,
        likes: [users[1]._id, users[2]._id]
      },
      {
        content: 'This helped me understand React much better. Thanks for sharing! I\'m going to try this out right away.',
        author: users[2]._id,
        blog: blogs[0]._id,
        likes: [users[0]._id]
      },
      {
        content: 'I\'ve been practicing mindfulness for years and this article captures the essence perfectly. Great tips for beginners!',
        author: users[1]._id,
        blog: blogs[1]._id,
        likes: [users[0]._id, users[2]._id]
      },
      {
        content: 'The photography tips are spot on! I especially love the golden hour advice. Will definitely try these on my next trip.',
        author: users[0]._id,
        blog: blogs[2]._id,
        likes: [users[1]._id]
      },
      {
        content: 'Promises can be tricky at first, but this explanation makes it so much clearer. Thanks for breaking it down!',
        author: users[2]._id,
        blog: blogs[3]._id,
        likes: [users[0]._id, users[1]._id]
      }
    ])
    console.log('Created comments')
    
    // Update blog comment counts (don't set comments array, just save the blog)
    for (const blog of blogs) {
      await blog.save()
    }
    
    // Update category and tag blog counts
    for (const category of categories) {
      await category.updateBlogCount()
    }
    
    for (const tag of tags) {
      await tag.updateBlogCount()
    }
    
    console.log('Enhanced seeding completed successfully!')
    console.log('Test users:')
    console.log('- admin@blogsink.com / user123')
    console.log('- john@blogsink.com / user123')
    console.log('- jane@blogsink.com / user123')
    console.log(`Created ${users.length} users`)
    console.log(`Created ${categories.length} categories`)
    console.log(`Created ${tags.length} tags`)
    console.log(`Created ${blogs.length} blogs`)
    console.log(`Created ${comments.length} comments`)
    
  } catch (error) {
    console.error('Enhanced seeding error:', error)
  } finally {
    await mongoose.disconnect()
    console.log('Disconnected from MongoDB')
  }
}

enhancedSeed()
