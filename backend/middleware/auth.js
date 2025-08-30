const jwt = require('jsonwebtoken')
const User = require('../models/User')
const config = require('../config')

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' })
    }

    try {
      const decoded = jwt.verify(token, config.JWT_SECRET)
      
      if (!decoded || !decoded.userId) {
        return res.status(401).json({ message: 'Invalid token format.' })
      }
      
      const user = await User.findById(decoded.userId).select('-password')
      
      if (!user) {
        return res.status(401).json({ message: 'User not found.' })
      }

      req.user = user
      next()
    } catch (jwtError) {
      // Specific JWT verification errors
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired. Please login again.' })
      }
      return res.status(401).json({ message: 'Invalid token.' })
    }
  } catch (error) {
    console.error('Auth middleware error:', error)
    res.status(500).json({ message: 'Server error during authentication.' })
  }
}

module.exports = { auth }
