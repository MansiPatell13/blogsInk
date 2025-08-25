const mongoose = require('mongoose')

const searchHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  query: {
    type: String,
    required: true,
    trim: true
  },
  filters: {
    category: String,
    tags: [String],
    author: mongoose.Schema.Types.ObjectId,
    dateRange: {
      startDate: Date,
      endDate: Date
    },
    sortBy: String
  },
  resultCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
})

// Indexes for better query performance
searchHistorySchema.index({ user: 1, createdAt: -1 })
searchHistorySchema.index({ query: 'text' })

module.exports = mongoose.model('SearchHistory', searchHistorySchema)