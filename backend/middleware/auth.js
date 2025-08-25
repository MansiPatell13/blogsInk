const jwt = require('jsonwebtoken')
const User = require('../models/User')
const config = require('../config')

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' })
    }

    const decoded = jwt.verify(token, config.JWT_SECRET)
    const user = await User.findById(decoded.userId).select('-password')
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid token.' })
    }

    req.user = user
    next()
  } catch (error) {
    res.status(401).json({ message: 'Invalid token.' })
  }
}

const adminAuth = async (req, res, next) => {
  // Use a custom next function to avoid double-sending headers
  const authNext = (error) => {
    if (error) return next(error);
    
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' })
    }
    
    next()
  }
  
  auth(req, res, authNext)
}

module.exports = { auth, adminAuth }
