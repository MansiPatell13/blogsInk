import React, { useState, useEffect } from 'react'
import { Shield, Users, FileText, BarChart3, Settings, AlertTriangle } from 'lucide-react'
import { useAuth } from '../utils/useAuth.jsx'
import { Navigate } from 'react-router-dom'
import api from '../utils/api'

const AdminPage = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBlogs: 0,
    totalViews: 0,
    totalLikes: 0
  })
  const [recentUsers, setRecentUsers] = useState([])
  const [recentBlogs, setRecentBlogs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [systemHealth, setSystemHealth] = useState({
    database: 'loading',
    api: 'loading',
    fileStorage: 'loading'
  })

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchAdminData()
    }
  }, [user])

  const fetchAdminData = async () => {
    try {
      const [statsRes, usersRes, blogsRes, healthRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users/recent'),
        api.get('/admin/blogs/recent'),
        api.get('/admin/system/health')
      ])

      setStats(statsRes.data.stats)
      setRecentUsers(usersRes.data.users)
      setRecentBlogs(blogsRes.data.blogs)
      
      // Update system health status
      if (healthRes.data) {
        setSystemHealth({
          database: healthRes.data.database === 'connected' ? 'operational' : 'outage',
          api: healthRes.data.status === 'healthy' ? 'operational' : 'degraded',
          fileStorage: 'operational' // Assuming file storage is operational if the API is responding
        })
      }
    } catch (error) {
      console.error('Error fetching admin data:', error)
      // If there's an error, set system health to degraded
      setSystemHealth({
        database: 'unknown',
        api: 'degraded',
        fileStorage: 'unknown'
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Redirect if not admin
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-yellow-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Manage your platform and monitor performance</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Blogs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalBlogs.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalViews.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Likes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalLikes.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Users */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Recent Users</h3>
            </div>
            <div className="p-6">
              {recentUsers.length > 0 ? (
                <div className="space-y-4">
                  {recentUsers.map((user) => (
                    <div key={user._id} className="flex items-center space-x-3">
                      <img
                        src={user.avatar || '/placeholder-user.jpg'}
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        user.role === 'admin' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.role}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No recent users</p>
              )}
            </div>
          </div>

          {/* Recent Blogs */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Recent Blogs</h3>
            </div>
            <div className="p-6">
              {recentBlogs.length > 0 ? (
                <div className="space-y-4">
                  {recentBlogs.map((blog) => (
                    <div key={blog._id} className="border-b border-gray-100 pb-4 last:border-b-0">
                      <h4 className="font-medium text-gray-900 mb-1">{blog.title}</h4>
                      <p className="text-sm text-gray-500 mb-2">{blog.excerpt}</p>
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>By {blog.author.name}</span>
                        <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No recent blogs</p>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Users className="w-5 h-5 text-yellow-600" />
              <span className="font-medium">Manage Users</span>
            </button>
            <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <FileText className="w-5 h-5 text-green-600" />
              <span className="font-medium">Review Content</span>
            </button>
            <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Settings className="w-5 h-5 text-gray-600" />
              <span className="font-medium">Platform Settings</span>
            </button>
          </div>
        </div>

        {/* System Status */}
        <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Database</span>
              <span className={`flex items-center ${systemHealth.database === 'operational' ? 'text-green-600' : 
                                systemHealth.database === 'degraded' ? 'text-yellow-600' : 
                                systemHealth.database === 'loading' ? 'text-gray-400' : 'text-red-600'}`}>
                <div className={`w-2 h-2 rounded-full mr-2 ${systemHealth.database === 'operational' ? 'bg-green-600' : 
                                systemHealth.database === 'degraded' ? 'bg-yellow-600' : 
                                systemHealth.database === 'loading' ? 'bg-gray-400 animate-pulse' : 'bg-red-600'}`}></div>
                {systemHealth.database === 'loading' ? 'Checking...' : 
                 systemHealth.database === 'unknown' ? 'Unknown' : 
                 systemHealth.database.charAt(0).toUpperCase() + systemHealth.database.slice(1)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">API Services</span>
              <span className={`flex items-center ${systemHealth.api === 'operational' ? 'text-green-600' : 
                                systemHealth.api === 'degraded' ? 'text-yellow-600' : 
                                systemHealth.api === 'loading' ? 'text-gray-400' : 'text-red-600'}`}>
                <div className={`w-2 h-2 rounded-full mr-2 ${systemHealth.api === 'operational' ? 'bg-green-600' : 
                                systemHealth.api === 'degraded' ? 'bg-yellow-600' : 
                                systemHealth.api === 'loading' ? 'bg-gray-400 animate-pulse' : 'bg-red-600'}`}></div>
                {systemHealth.api === 'loading' ? 'Checking...' : 
                 systemHealth.api === 'unknown' ? 'Unknown' : 
                 systemHealth.api.charAt(0).toUpperCase() + systemHealth.api.slice(1)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">File Storage</span>
              <span className={`flex items-center ${systemHealth.fileStorage === 'operational' ? 'text-green-600' : 
                                systemHealth.fileStorage === 'degraded' ? 'text-yellow-600' : 
                                systemHealth.fileStorage === 'loading' ? 'text-gray-400' : 'text-red-600'}`}>
                <div className={`w-2 h-2 rounded-full mr-2 ${systemHealth.fileStorage === 'operational' ? 'bg-green-600' : 
                                systemHealth.fileStorage === 'degraded' ? 'bg-yellow-600' : 
                                systemHealth.fileStorage === 'loading' ? 'bg-gray-400 animate-pulse' : 'bg-red-600'}`}></div>
                {systemHealth.fileStorage === 'loading' ? 'Checking...' : 
                 systemHealth.fileStorage === 'unknown' ? 'Unknown' : 
                 systemHealth.fileStorage.charAt(0).toUpperCase() + systemHealth.fileStorage.slice(1)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminPage
