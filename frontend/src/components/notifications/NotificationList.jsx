import React, { useState } from 'react'
import NotificationItem from './NotificationItem'
import { Bell, CheckCircle } from 'lucide-react'

const NotificationList = ({
  notifications = [],
  onRead,
  onDelete,
  onClearAll,
  onNotificationClick,
  darkMode = false,
  maxHeight = '400px',
}) => {
  const [filter, setFilter] = useState('all') // 'all', 'unread', 'read'
  
  // Filter notifications based on current filter
  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true
    if (filter === 'unread') return !notification.read
    if (filter === 'read') return notification.read
    return true
  })
  
  // Count unread notifications
  const unreadCount = notifications.filter(notification => !notification.read).length
  
  // Handle mark all as read
  const handleMarkAllAsRead = () => {
    if (onRead) {
      notifications.forEach(notification => {
        if (!notification.read) {
          onRead(notification.id)
        }
      })
    }
  }
  
  return (
    <div className={`w-full ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} rounded-lg shadow-lg`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Bell size={20} className={darkMode ? 'text-yellow-400' : 'text-yellow-600'} />
            <h3 className="ml-2 text-lg font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <span className="ml-2 px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                {unreadCount}
              </span>
            )}
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={handleMarkAllAsRead}
              disabled={unreadCount === 0}
              className={`
                text-xs px-2 py-1 rounded flex items-center
                ${unreadCount === 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                ${darkMode ? 'text-yellow-400 hover:bg-gray-800' : 'text-yellow-600 hover:bg-gray-100'}
              `}
              aria-label="Mark all as read"
            >
              <CheckCircle size={14} className="mr-1" />
              Mark all read
            </button>
            
            <button
              onClick={onClearAll}
              disabled={notifications.length === 0}
              className={`
                text-xs px-2 py-1 rounded
                ${notifications.length === 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                ${darkMode ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'}
              `}
              aria-label="Clear all notifications"
            >
              Clear all
            </button>
          </div>
        </div>
        
        {/* Filter tabs */}
        <div className="flex mt-3 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setFilter('all')}
            className={`
              px-4 py-2 text-sm font-medium border-b-2 -mb-px
              ${filter === 'all' 
                ? `${darkMode ? 'border-yellow-500 text-yellow-400' : 'border-yellow-600 text-yellow-600'}` 
                : `${darkMode ? 'border-transparent text-gray-400' : 'border-transparent text-gray-500'}`}
            `}
          >
            All
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`
              px-4 py-2 text-sm font-medium border-b-2 -mb-px
              ${filter === 'unread' 
                ? `${darkMode ? 'border-yellow-500 text-yellow-400' : 'border-yellow-600 text-yellow-600'}` 
                : `${darkMode ? 'border-transparent text-gray-400' : 'border-transparent text-gray-500'}`}
            `}
          >
            Unread
            {unreadCount > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                {unreadCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setFilter('read')}
            className={`
              px-4 py-2 text-sm font-medium border-b-2 -mb-px
              ${filter === 'read' 
                ? `${darkMode ? 'border-yellow-500 text-yellow-400' : 'border-yellow-600 text-yellow-600'}` 
                : `${darkMode ? 'border-transparent text-gray-400' : 'border-transparent text-gray-500'}`}
            `}
          >
            Read
          </button>
        </div>
      </div>
      
      {/* Notification list */}
      <div 
        className="overflow-y-auto p-2"
        style={{ maxHeight }}
        role="log"
        aria-label="Notification list"
        aria-live="polite"
      >
        {filteredNotifications.length === 0 ? (
          <div className="p-8 text-center">
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {filter === 'all' 
                ? 'No notifications' 
                : filter === 'unread' 
                  ? 'No unread notifications' 
                  : 'No read notifications'}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className="transition-all duration-200 ease-in-out"
              >
                <NotificationItem
                  {...notification}
                  darkMode={darkMode}
                  onRead={onRead}
                  onDelete={onDelete}
                  onClick={onNotificationClick}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default NotificationList