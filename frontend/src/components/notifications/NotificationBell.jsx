import React, { useState, useRef, useEffect } from 'react'
import { Bell } from 'lucide-react'
import { useNotifications } from './NotificationProvider'
import NotificationList from './NotificationList'

const NotificationBell = ({ className = '', darkMode = false }) => {
  const { 
    notifications, 
    unreadCount, 
    isOpen, 
    toggleNotifications,
    markAsRead,
    removeNotification,
    markAllAsRead,
    clearAll
  } = useNotifications()
  
  const dropdownRef = useRef(null)
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        if (isOpen) toggleNotifications()
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, toggleNotifications])
  
  // Handle notification click
  const handleNotificationClick = (id) => {
    // Find the notification
    const notification = notifications.find(n => n.id === id)
    if (notification && notification.onClick) {
      notification.onClick()
    }
    
    // Mark as read
    markAsRead(id)
  }
  
  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        className={`
          relative p-2 rounded-full transition-colors duration-200
          ${darkMode 
            ? 'hover:bg-gray-700 focus:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500' 
            : 'hover:bg-gray-100 focus:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-500'}
        `}
        onClick={toggleNotifications}
        aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <Bell size={20} className={darkMode ? 'text-gray-200' : 'text-gray-700'} />
        
        {unreadCount > 0 && (
          <span className="
            absolute top-0 right-0 transform translate-x-1/3 -translate-y-1/3
            flex items-center justify-center
            h-5 w-5 text-xs font-bold text-white bg-red-500 rounded-full
          ">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
      
      {isOpen && (
        <div 
          className="
            absolute right-0 mt-2 w-80 sm:w-96 z-50
            transform origin-top-right transition-all duration-200 ease-out
          "
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="notification-menu"
        >
          <NotificationList
            notifications={notifications}
            onRead={markAsRead}
            onDelete={removeNotification}
            onClearAll={clearAll}
            onMarkAllAsRead={markAllAsRead}
            onNotificationClick={handleNotificationClick}
            darkMode={darkMode}
          />
        </div>
      )}
    </div>
  )
}

export default NotificationBell