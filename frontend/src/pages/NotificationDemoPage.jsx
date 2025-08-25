import React, { useState } from 'react';
import { useNotifications } from '../components/notifications';
import { MetaTags } from '../components/seo';

const NotificationDemoPage = () => {
  const { notify } = useNotifications();
  
  // Get theme from localStorage or context if available
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark';
  });
  
  const [title, setTitle] = useState('Notification Title');
  const [message, setMessage] = useState('This is a sample notification message.');
  const [type, setType] = useState('info');
  const [isToast, setIsToast] = useState(true);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create notification based on form values
    notify[type](title, message, { toast: isToast });
  };
  
  // Create demo notifications
  const createDemoNotifications = () => {
    notify.info('New Feature Available', 'Check out our new rich text editor!', { toast: true });
    
    setTimeout(() => {
      notify.success('Article Published', 'Your article has been successfully published.', { toast: true });
    }, 1500);
    
    setTimeout(() => {
      notify.warning('Storage Limit', 'You\'re approaching your storage limit.', { toast: true });
    }, 3000);
    
    setTimeout(() => {
      notify.error('Connection Error', 'Unable to connect to the server. Please try again.', { toast: true });
    }, 4500);
    
    setTimeout(() => {
      notify.system('System Maintenance', 'The system will be down for maintenance on Sunday at 2 AM.', { toast: true });
    }, 6000);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <MetaTags 
        title="Notification Demo | BlogsInk"
        description="Demo page for the notification system"
      />
      
      <div className="max-w-3xl mx-auto">
        <h1 className={`text-3xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Notification System Demo
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Create Custom Notification */}
          <div className={`p-6 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Create Custom Notification
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="title" className={`block mb-1 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={`w-full px-3 py-2 rounded-md border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="message" className={`block mb-1 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Message
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className={`w-full px-3 py-2 rounded-md border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                  rows="3"
                  required
                ></textarea>
              </div>
              
              <div>
                <label htmlFor="type" className={`block mb-1 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Type
                </label>
                <select
                  id="type"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className={`w-full px-3 py-2 rounded-md border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                >
                  <option value="info">Info</option>
                  <option value="success">Success</option>
                  <option value="warning">Warning</option>
                  <option value="error">Error</option>
                  <option value="system">System</option>
                </select>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isToast"
                  checked={isToast}
                  onChange={(e) => setIsToast(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="isToast" className={`${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Show as toast notification
                </label>
              </div>
              
              <button
                type="submit"
                className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md transition-colors"
              >
                Create Notification
              </button>
            </form>
          </div>
          
          {/* Demo Notifications */}
          <div className={`p-6 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Demo Notifications
            </h2>
            
            <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Click the button below to see a series of different notification types.
            </p>
            
            <button
              onClick={createDemoNotifications}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors"
            >
              Show Demo Notifications
            </button>
            
            <div className="mt-8">
              <h3 className={`text-lg font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Instructions
              </h3>
              
              <ul className={`list-disc pl-5 space-y-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <li>Toast notifications appear in the top-right corner</li>
                <li>Click the bell icon in the header to see all notifications</li>
                <li>Notifications can be marked as read or deleted</li>
                <li>The bell icon shows a badge with unread count</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationDemoPage;