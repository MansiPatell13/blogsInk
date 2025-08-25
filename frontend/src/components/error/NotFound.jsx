import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Home, ArrowLeft } from 'lucide-react';

const NotFound = ({
  title = 'Page Not Found',
  message = 'The page you are looking for doesn\'t exist or has been moved.',
  showHomeLink = true,
  showBackLink = true,
  showSearch = false,
  className = '',
}) => {
  const goBack = () => {
    window.history.back();
  };

  return (
    <div className={`flex flex-col items-center justify-center py-16 px-4 text-center ${className}`}>
      {/* 404 Icon/Image */}
      <div className="mb-8 text-gray-300 dark:text-gray-700">
        <div className="text-9xl font-bold">404</div>
      </div>
      
      {/* Error Message */}
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
        {title}
      </h1>
      
      <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md mb-8">
        {message}
      </p>
      
      {/* Search Form */}
      {showSearch && (
        <div className="w-full max-w-md mb-8">
          <form 
            action="/search" 
            method="GET"
            className="flex items-center relative"
          >
            <input
              type="search"
              name="q"
              placeholder="Search for content..."
              className="w-full px-4 py-2 pl-10 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <Search className="absolute left-3 text-gray-400 h-5 w-5" />
          </form>
        </div>
      )}
      
      {/* Action Links */}
      <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
        {showHomeLink && (
          <Link 
            to="/"
            className="flex items-center space-x-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
          >
            <Home className="h-5 w-5" />
            <span>Go to Homepage</span>
          </Link>
        )}
        
        {showBackLink && (
          <button
            onClick={goBack}
            className="flex items-center space-x-2 px-6 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Go Back</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default NotFound;