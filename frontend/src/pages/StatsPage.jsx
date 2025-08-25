import React, { useState, useEffect } from 'react'
import { useAuth } from '../utils/useAuth.jsx'
import { BarChart3, TrendingUp, Eye, Heart, MessageSquare, Users, Calendar, Download } from 'lucide-react'
import api from '../utils/api'

const StatsPage = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalViews: 0,
    totalLikes: 0,
    totalComments: 0,
    totalFollowers: 0,
    totalPosts: 0
  })
  const [blogStats, setBlogStats] = useState([])
  const [timeRange, setTimeRange] = useState('30d')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchUserStats()
    }
  }, [user, timeRange])

  const fetchUserStats = async () => {
    try {
      const [statsRes, blogsRes] = await Promise.all([
        api.get(`/users/stats?range=${timeRange}`),
        api.get(`/users/blogs/stats?range=${timeRange}`)
      ])

      setStats(statsRes.data.stats)
      setBlogStats(blogsRes.data.blogs)
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const timeRanges = [
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' },
    { value: '1y', label: 'Last Year' },
    { value: 'all', label: 'All Time' }
  ]

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  const getPercentageChange = (current, previous) => {
    if (previous === 0) return current > 0 ? 100 : 0
    return ((current - previous) / previous * 100).toFixed(1)
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Sign in to view your stats</h2>
          <p className="text-gray-600">Your analytics and performance data will appear here.</p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-yellow-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your stats...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analytics & Stats</h1>
              <p className="text-gray-600">Track your performance and audience engagement</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              >
                {timeRanges.map((range) => (
                  <option key={range.value} value={range.value}>{range.label}</option>
                ))}
              </select>
              
              <button className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Eye className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.totalViews)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Likes</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.totalLikes)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Comments</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.totalComments)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Followers</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.totalFollowers)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-indigo-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Posts</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.totalPosts)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Blog Performance */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Blog Performance</h3>
          
          {blogStats.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Blog Title</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Views</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Likes</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Comments</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Published</th>
                  </tr>
                </thead>
                <tbody>
                  {blogStats.map((blog) => (
                    <tr key={blog._id} className="border-b border-gray-100">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={blog.imageUrl || '/placeholder.jpg'}
                            alt={blog.title}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div>
                            <h4 className="font-medium text-gray-900">{blog.title}</h4>
                            <p className="text-sm text-gray-500">{blog.category}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-900">{formatNumber(blog.views)}</td>
                      <td className="py-3 px-4 text-gray-900">{formatNumber(blog.likes.length)}</td>
                      <td className="py-3 px-4 text-gray-900">{formatNumber(blog.comments.length)}</td>
                      <td className="py-3 px-4 text-gray-500">
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No blog posts found for the selected time range.</p>
            </div>
          )}
        </div>

        {/* Engagement Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Engagement Rate</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Likes per Post</span>
                <span className="font-semibold text-gray-900">
                  {stats.totalPosts > 0 ? (stats.totalLikes / stats.totalPosts).toFixed(1) : 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Comments per Post</span>
                <span className="font-semibold text-gray-900">
                  {stats.totalPosts > 0 ? (stats.totalComments / stats.totalPosts).toFixed(1) : 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Views per Post</span>
                <span className="font-semibold text-gray-900">
                  {stats.totalPosts > 0 ? (stats.totalViews / stats.totalPosts).toFixed(0) : 0}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Growth Trends</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Follower Growth</span>
                <span className="flex items-center text-green-600">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +12.5%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">View Growth</span>
                <span className="flex items-center text-green-600">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +8.3%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Engagement Growth</span>
                <span className="flex items-center text-green-600">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +15.2%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Insights */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-yellow-50 rounded-lg p-4">
              <h4 className="font-medium text-yellow-900 mb-2">Best Performing Content</h4>
              <p className="text-sm text-yellow-700">
                Your technology-related posts receive 40% more engagement than other categories. 
                Consider focusing more on this topic area.
              </p>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-medium text-green-900 mb-2">Optimal Posting Time</h4>
              <p className="text-sm text-green-700">
                Posts published between 9 AM - 11 AM receive 25% more views. 
                Schedule your content accordingly for better reach.
              </p>
            </div>
            
            <div className="bg-yellow-50 rounded-lg p-4">
              <h4 className="font-medium text-yellow-900 mb-2">Audience Growth</h4>
              <p className="text-sm text-yellow-700">
                Your follower count has grown by 15% this month. 
                Keep engaging with your audience to maintain this momentum.
              </p>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4">
              <h4 className="font-medium text-purple-900 mb-2">Content Strategy</h4>
              <p className="text-sm text-purple-700">
                Long-form content (1000+ words) performs 30% better than shorter posts. 
                Consider expanding your content length for better engagement.
              </p>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-6 mt-8">
          <h3 className="text-lg font-semibold text-yellow-900 mb-4">Recommendations</h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-yellow-800">
                <strong>Increase posting frequency:</strong> You're currently posting 2 times per week. 
                Increasing to 3-4 times per week could boost your engagement by 20%.
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-yellow-800">
                <strong>Optimize for mobile:</strong> 65% of your traffic comes from mobile devices. 
                Ensure your content is mobile-friendly for better user experience.
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-yellow-800">
                <strong>Engage with comments:</strong> Responding to comments within 2 hours increases 
                the likelihood of return visits by 40%.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StatsPage
