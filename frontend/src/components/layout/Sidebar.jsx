import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  Home, 
  BookOpen, 
  PenTool, 
  User, 
  Settings, 
  BarChart3, 
  Shield, 
  Users, 
  FileText,
  Heart,
  MessageSquare,
  Eye,
  Plus
} from 'lucide-react'
import { useAuth } from '../../utils/useAuth.jsx'

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth()
  const location = useLocation()

  const isActive = (path) => {
    return location.pathname === path
  }

  const navigationItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/stories', icon: BookOpen, label: 'Stories' },
    { path: '/library', icon: FileText, label: 'Library' },
    { path: '/write', icon: PenTool, label: 'Write' },
    { path: '/profile', icon: User, label: 'Profile' },
    { path: '/settings', icon: Settings, label: 'Settings' },
    { path: '/stats', icon: BarChart3, label: 'Stats' }
  ]

  const adminItems = [
    { path: '/admin', icon: Shield, label: 'Admin Panel' },
    { path: '/admin/users', icon: Users, label: 'Manage Users' },
    { path: '/admin/blogs', icon: FileText, label: 'Manage Blogs' }
  ]

  const statsItems = [
    { icon: Heart, label: 'Total Likes', value: user?.totalLikes || 0 },
    { icon: MessageSquare, label: 'Total Comments', value: user?.totalComments || 0 },
    { icon: Eye, label: 'Total Views', value: user?.totalViews || 0 }
  ]

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-40 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <img
                src={user?.avatar || '/placeholder-user.jpg'}
                alt={user?.name || 'User'}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h3 className="font-semibold text-gray-900">
                  {user?.name || 'Guest User'}
                </h3>
                <p className="text-sm text-gray-500">
                  {user?.email || 'guest@example.com'}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-6">
            <div className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                      isActive(item.path)
                        ? 'bg-yellow-100 text-yellow-700 border-r-2 border-yellow-500'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                )
              })}
            </div>

            {/* Admin Section */}
            {user?.role === 'admin' && (
              <div className="mt-8">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Admin
                </h4>
                <div className="space-y-2">
                  {adminItems.map((item) => {
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={onClose}
                        className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                          isActive(item.path)
                            ? 'bg-red-100 text-red-700 border-r-2 border-red-500'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Stats Section */}
            {user && (
              <div className="mt-8">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Your Stats
                </h4>
                <div className="space-y-3">
                  {statsItems.map((item) => {
                    const Icon = item.icon
                    return (
                      <div key={item.label} className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Icon className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">{item.label}</span>
                        </div>
                        <span className="text-sm font-semibold text-gray-900">{item.value}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </nav>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200">
            <Link
              to="/write"
              onClick={onClose}
              className="w-full bg-yellow-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-yellow-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>New Post</span>
            </Link>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
