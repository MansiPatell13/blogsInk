import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import NotificationItem from './NotificationItem'

// Create context
const NotificationContext = createContext()

// Generate unique ID
const generateId = () => `notification-${Date.now()}-${Math.floor(Math.random() * 1000)}`

// Provider component
export const NotificationProvider = ({ children, maxNotifications = 5, autoCloseTime = 5000 }) => {
  const [notifications, setNotifications] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  
  // Update unread count when notifications change
  useEffect(() => {
    const count = notifications.filter(notification => !notification.read).length
    setUnreadCount(count)
    
    // Update document title if there are unread notifications
    if (count > 0) {
      document.title = `(${count}) BlogsInk`
    } else {
      document.title = 'BlogsInk'
    }
  }, [notifications])
  
  // Add notification
  const addNotification = useCallback((notification) => {
    const newNotification = {
      id: generateId(),
      timestamp: Date.now(),
      read: false,
      ...notification
    }
    
    setNotifications(prev => {
      // Add to beginning of array and limit to maxNotifications
      const updated = [newNotification, ...prev].slice(0, maxNotifications)
      return updated
    })
    
    // Auto close toast notifications after specified time
    if (notification.toast && autoCloseTime > 0) {
      setTimeout(() => {
        removeNotification(newNotification.id)
      }, autoCloseTime)
    }
    
    return newNotification.id
  }, [maxNotifications, autoCloseTime])
  
  // Remove notification
  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }, [])
  
  // Mark notification as read
  const markAsRead = useCallback((id) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    )
  }, [])
  
  // Mark all as read
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    )
  }, [])
  
  // Clear all notifications
  const clearAll = useCallback(() => {
    setNotifications([])
  }, [])
  
  // Toggle notification panel
  const toggleNotifications = useCallback(() => {
    setIsOpen(prev => !prev)
  }, [])
  
  // Convenience methods for different notification types
  const notify = {
    info: (title, message, options = {}) => 
      addNotification({ type: 'info', title, message, ...options }),
    
    success: (title, message, options = {}) => 
      addNotification({ type: 'success', title, message, ...options }),
    
    warning: (title, message, options = {}) => 
      addNotification({ type: 'warning', title, message, ...options }),
    
    error: (title, message, options = {}) => 
      addNotification({ type: 'error', title, message, ...options }),
    
    system: (title, message, options = {}) => 
      addNotification({ type: 'system', title, message, ...options }),
  }
  
  // Context value
  const value = {
    notifications,
    unreadCount,
    isOpen,
    toggleNotifications,
    addNotification,
    removeNotification,
    markAsRead,
    markAllAsRead,
    clearAll,
    notify
  }
  
  return (
    <NotificationContext.Provider value={value}>
      {children}
      
      {/* Toast container for notifications marked as toast */}
      {createPortal(
        <div 
          className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full"
          aria-live="polite"
          aria-atomic="true"
        >
          {notifications
            .filter(notification => notification.toast)
            .map(notification => (
              <div
                key={notification.id}
                className="transition-all duration-200 ease-in-out"
              >
                <NotificationItem
                  {...notification}
                  onDelete={removeNotification}
                  onRead={markAsRead}
                  showActions={true}
                />
              </div>
            ))}
        </div>,
        document.body
      )}
    </NotificationContext.Provider>
  )
}

// Custom hook for using notifications
export const useNotifications = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}

export default NotificationProvider