import React from 'react'
import { Link } from 'react-router-dom'
import { Heart, MessageSquare, Eye, Clock, User } from 'lucide-react'

const BlogCard = ({ blog }) => {
  if (!blog) return null

  const {
    _id,
    title,
    excerpt,
    content,
    author,
    category,
    tags,
    imageUrl,
    likes = [],
    views = 0,
    readTime = 0,
    createdAt,
    publishedAt
  } = blog

  // Calculate reading time if not provided
  const calculatedReadTime = readTime || Math.ceil((content || '').length / 1000)

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Get author name and avatar
  const authorName = author?.name || 'Anonymous'
  const authorAvatar = author?.avatar || '/placeholder-user.jpg'

  // Get category name
  const categoryName = category?.name || 'Uncategorized'

  // Get tags
  const displayTags = tags?.slice(0, 3) || []

  return (
    <article className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow duration-300">
      {/* Blog Image */}
      {imageUrl && (
        <div className="aspect-video overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.src = '/placeholder.jpg'
            }}
          />
        </div>
      )}

      {/* Blog Content */}
      <div className="p-6">
        {/* Category */}
        {categoryName && (
          <div className="mb-3">
            <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
              {categoryName}
            </span>
          </div>
        )}

        {/* Title */}
        <Link to={`/blog/${_id}`} className="block">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 hover:text-yellow-600 transition-colors">
            {title}
          </h2>
        </Link>

        {/* Excerpt */}
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
          {excerpt || content?.replace(/<[^>]*>/g, '').substring(0, 150) + '...'}
        </p>

        {/* Tags */}
        {displayTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {displayTags.map((tag, index) => (
              <span
                key={index}
                className="inline-block px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded"
              >
                #{tag.name || tag}
              </span>
            ))}
          </div>
        )}

        {/* Author and Meta */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Author Avatar */}
            <img
              src={authorAvatar}
              alt={authorName}
              className="w-8 h-8 rounded-full object-cover"
              onError={(e) => {
                e.target.src = '/placeholder-user.jpg'
              }}
            />
            
            {/* Author Info */}
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {authorName}
              </span>
              <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                <Clock className="w-3 h-3" />
                <span>{formatDate(publishedAt || createdAt)}</span>
                <span>•</span>
                <span>{calculatedReadTime} min read</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-1">
              <Heart className="w-4 h-4" />
              <span>{likes.length}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Eye className="w-4 h-4" />
              <span>{views}</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

export default BlogCard
