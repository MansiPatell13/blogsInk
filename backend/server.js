const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const path = require('path')
const config = require('./config')
// dotenv is already loaded in config.js

const authRoutes = require('./routes/auth')
const blogRoutes = require('./routes/blogs')
const userRoutes = require('./routes/users')
const commentRoutes = require('./routes/comments')
const adminRoutes = require('./routes/admin')
const uploadRoutes = require('./routes/uploads')
const notificationRoutes = require('./routes/notifications')
const searchRoutes = require('./routes/search')
const tagRoutes = require('./routes/tags')
const categoryRoutes = require('./routes/categories')
const preferenceRoutes = require('./routes/preferences')
const seoRoutes = require('./routes/seo')

const app = express()
const PORT = config.PORT

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }, // Allow images to be served from different origins
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'", "http://localhost:3006"],
      imgSrc: ["'self'", "data:", "https://images.unsplash.com", "https://*.cloudinary.com", "*"],
      connectSrc: ["'self'", "https://api.unsplash.com", "http://localhost:3006", "*"]
    }
  }
}))
app.use(morgan('combined'))
app.use(cors({
  origin: config.CORS_ORIGIN,
  credentials: true
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Serve static files from uploads directory (for local file storage)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(config.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    });
    console.log('Connected to MongoDB:', config.MONGODB_URI);
  } catch (err) {
    console.error('MongoDB connection error:', err);
    // Retry connection after 5 seconds
    console.log('Retrying connection in 5 seconds...');
    setTimeout(connectDB, 5000);
  }
};

// Connect to database
connectDB();

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/blogs', blogRoutes)
app.use('/api/blogs', commentRoutes) // Comments are nested under blogs
app.use('/api/users', userRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/uploads', uploadRoutes)
app.use('/api/notifications', notificationRoutes)
app.use('/api/search', searchRoutes)
app.use('/api/tags', tagRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/preferences', preferenceRoutes)
app.use('/api/seo', seoRoutes)

// Health check (includes DB status)
app.get('/api/health', (req, res) => {
  const connection = mongoose.connection
  res.json({
    status: 'OK',
    message: 'BlogSink API is running',
    dbConnected: connection.readyState === 1,
    dbState: connection.readyState, // 0=disconnected,1=connected,2=connecting,3=disconnecting
    dbName: connection.name || null,
    dbHost: (connection.host || null)
  })
})

// Import error handling middleware
const { errorMiddleware } = require('./utils/errorHandler')

// Global error handling middleware
app.use(errorMiddleware)

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

// Try to listen on the configured port, if it fails, try the next available port
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    const nextPort = parseInt(PORT) + 10;
    console.log(`Port ${PORT} is busy, trying port ${nextPort}`)
    app.listen(nextPort, () => {
      console.log(`Server running on port ${nextPort}`)
    }).on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        const finalPort = parseInt(PORT) + 20;
        console.log(`Port ${nextPort} is busy, trying port ${finalPort}`)
        app.listen(finalPort, () => {
          console.log(`Server running on port ${finalPort}`)
        })
      } else {
        console.error('Server error:', err)
      }
    })
  } else {
    console.error('Server error:', err)
  }
})
