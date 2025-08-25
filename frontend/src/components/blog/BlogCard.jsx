import React from 'react'
import { Link } from 'react-router-dom'
import { Heart, MessageSquare, Eye, Clock } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

const BlogCard = ({ blog, featured = false }) => {
  const handleLike = (e) => {
    e.preventDefault()
    // TODO: Implement like functionality
  }

  return (
    <Link
      to={`/blog/${blog._id || blog.id}`}
      className={`block group transition-all duration-300 hover:shadow-lg rounded-xl overflow-hidden bg-white border border-gray-200 hover:border-yellow-300 ${
        featured ? 'ring-2 ring-yellow-200' : ''
      }`}
    >
      {/* Image */}
      <div className="relative overflow-hidden">
        <img
          src={blog.imageUrl || '/placeholder.jpg'}
          alt={blog.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {featured && (
          <div className="absolute top-3 left-3">
            <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              Featured
            </span>
          </div>
        )}
        <div className="absolute top-3 right-3">
          <span className="bg-white text-gray-700 px-2 py-1 rounded-full text-xs font-medium">
            {blog.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          {blog.tags?.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-yellow-600 transition-colors line-clamp-2">
          {blog.title}
        </h3>

        {/* Excerpt */}
        <p className="text-gray-600 mb-4 line-clamp-3">
          {blog.excerpt}
        </p>

        {/* Author and Meta */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img
              src={blog.author?.avatar || blog.authorAvatar || '/placeholder-user.jpg'}
              alt={blog.author?.name || blog.authorName}
              className="w-8 h-8 rounded-full"
            />
            <div>
              <p className="text-sm font-medium text-gray-900">
                {blog.author?.name || blog.authorName}
              </p>
              <div className="flex items-center text-xs text-gray-500">
                <Clock className="w-3 h-3 mr-1" />
                {formatDistanceToNow(new Date(blog.createdAt), { addSuffix: true })}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <button
              onClick={handleLike}
              className="flex items-center space-x-1 hover:text-red-500 transition-colors"
            >
              <Heart className="w-4 h-4" />
              <span>{blog.likes?.length || blog.likes || 0}</span>
            </button>
            <div className="flex items-center space-x-1">
              <MessageSquare className="w-4 h-4" />
              <span>{blog.comments?.length || 0}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Eye className="w-4 h-4" />
              <span>{blog.views || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default BlogCard
