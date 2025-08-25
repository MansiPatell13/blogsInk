import React, { useState, useEffect } from 'react';
import { X, Bell, Info, AlertCircle, CheckCircle, Clock } from 'lucide-react';

const NotificationItem = ({
  id,
  type = 'info', // 'info', 'success', 'warning', 'error', 'system'
  title,
  message,
  timestamp,
  read = false,
  onRead,
  onDelete,
  onClick,
  darkMode = false,
  showActions = true
}) => {
  const [isRead, setIsRead] = useState(read);
  const [isVisible, setIsVisible] = useState(true);
  
  // Format timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  };
  
  // Get icon based on notification type
  const getIcon = () => {
    switch (type) {
      case 'info':
        return <Info size={18} className={darkMode ? 'text-yellow-400' : 'text-yellow-500'} />;
      case 'success':
        return <CheckCircle size={18} className={darkMode ? 'text-green-400' : 'text-green-500'} />;
      case 'warning':
        return <AlertCircle size={18} className={darkMode ? 'text-yellow-400' : 'text-yellow-500'} />;
      case 'error':
        return <AlertCircle size={18} className={darkMode ? 'text-red-400' : 'text-red-500'} />;
      case 'system':
        return <Bell size={18} className={darkMode ? 'text-purple-400' : 'text-purple-500'} />;
      default:
        return <Info size={18} className={darkMode ? 'text-yellow-400' : 'text-yellow-500'} />;
    }
  };
  
  // Handle mark as read
  const handleMarkAsRead = (e) => {
    e.stopPropagation();
    setIsRead(true);
    if (onRead) onRead(id);
  };
  
  // Handle delete
  const handleDelete = (e) => {
    e.stopPropagation();
    setIsVisible(false);
    if (onDelete) onDelete(id);
  };
  
  // Handle click
  const handleClick = () => {
    if (!isRead && onRead) onRead(id);
    setIsRead(true);
    if (onClick) onClick(id);
  };
  
  // Animation for removal
  useEffect(() => {
    if (!isVisible) {
      const timer = setTimeout(() => {
        // This would be handled by the parent component
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);
  
  if (!isVisible) return null;
  
  return (
    <div 
      className={`
        ${darkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50'}
        ${!isRead ? (darkMode ? 'border-l-4 border-yellow-500' : 'border-l-4 border-yellow-500') : ''}
        p-4 rounded-lg shadow-sm transition-all duration-200 cursor-pointer
        transform transition-transform hover:scale-[1.01]
        ${isVisible ? 'opacity-100' : 'opacity-0 translate-x-full'}
      `}
      onClick={handleClick}
      role="button"
      tabIndex="0"
      aria-label={`Notification: ${title}`}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-3">
          {getIcon()}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <h4 className={`text-sm font-medium truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {title}
            </h4>
            <div className="flex items-center ml-2">
              <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} flex items-center`}>
                <Clock size={12} className="mr-1" />
                {formatTime(timestamp)}
              </span>
            </div>
          </div>
          
          <p className={`mt-1 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {message}
          </p>
          
          {showActions && (
            <div className="mt-2 flex justify-end space-x-2">
              {!isRead && (
                <button
                  onClick={handleMarkAsRead}
                  className={`text-xs px-2 py-1 rounded ${darkMode ? 'text-yellow-400 hover:bg-gray-700' : 'text-yellow-600 hover:bg-gray-100'}`}
                  aria-label="Mark as read"
                >
                  Mark as read
                </button>
              )}
              
              <button
                onClick={handleDelete}
                className={`text-xs px-2 py-1 rounded ${darkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'}`}
                aria-label="Delete notification"
              >
                <X size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;