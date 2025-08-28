import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../utils/useAuth.jsx'
import { 
  Home, 
  BookOpen, 
  PenTool, 
  User, 
  Settings, 
  BarChart3
} from 'lucide-react'

const Sidebar = () => {
  const { user } = useAuth()
  const location = useLocation()

  const navigationItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Library', href: '/library', icon: BookOpen },
    { name: 'Write', href: '/write', icon: PenTool },
    { name: 'Profile', href: '/profile', icon: User },
    { name: 'Settings', href: '/settings', icon: Settings },
    { name: 'Stats', href: '/stats', icon: BarChart3 },
  ]


  const isActive = (href) => location.pathname === href

  return (
    <aside className="fixed left-0 top-16 h-full w-64 bg-white border-r border-gray-200 z-40">
      <div className="flex flex-col h-full">
        {/* User Profile Section */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <img
              src={user?.avatar || '/placeholder-user.jpg'}
              alt={user?.name}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <h3 className="font-medium text-gray-900">{user?.name}</h3>
              <p className="text-sm text-gray-500">{user?.role}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <div className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </div>

        </nav>

        {/* Quick Actions */}
        <div className="p-4 border-t border-gray-200">
          <div className="space-y-2">
            <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors">
              <PenTool className="w-4 h-4" />
              <span>New Post</span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
