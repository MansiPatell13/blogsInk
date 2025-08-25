const mongoose = require('mongoose')

const userPreferenceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  theme: {
    type: String,
    enum: ['light', 'dark', 'system'],
    default: 'system'
  },
  fontSize: {
    type: String,
    enum: ['small', 'medium', 'large', 'x-large'],
    default: 'medium'
  },
  reducedMotion: {
    type: Boolean,
    default: false
  },
  highContrast: {
    type: Boolean,
    default: false
  },
  emailNotifications: {
    comments: { type: Boolean, default: true },
    likes: { type: Boolean, default: true },
    follows: { type: Boolean, default: true },
    mentions: { type: Boolean, default: true },
    newsletter: { type: Boolean, default: true },
    blogUpdates: { type: Boolean, default: true }
  },
  pushNotifications: {
    comments: { type: Boolean, default: true },
    likes: { type: Boolean, default: true },
    follows: { type: Boolean, default: true },
    mentions: { type: Boolean, default: true },
    blogUpdates: { type: Boolean, default: true }
  },
  preferredCategories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
  preferredTags: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tag'
  }],
  language: {
    type: String,
    default: 'en'
  }
}, {
  timestamps: true
})

// Create user preferences when a new user is created
userPreferenceSchema.statics.createDefaultPreferences = async function(userId) {
  try {
    const preferences = new this({
      user: userId
    })
    return await preferences.save()
  } catch (error) {
    console.error('Error creating default user preferences:', error)
    throw error
  }
}

module.exports = mongoose.model('UserPreference', userPreferenceSchema)