import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight } from 'lucide-react';
import { useKeyboardNavigation } from '../../hooks/useA11y';

const SearchBar = ({
  placeholder = 'Search articles...',
  onSearch,
  suggestions = [],
  className = '',
  expandable = false,
  darkMode = false,
  autoFocus = false,
  maxSuggestions = 5
}) => {
  const [query, setQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(!expandable);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);
  const navigate = useNavigate();

  // Filter suggestions based on query
  const filteredSuggestions = suggestions
    .filter(suggestion => 
      suggestion.title.toLowerCase().includes(query.toLowerCase()) ||
      suggestion.content.toLowerCase().includes(query.toLowerCase())
    )
    .slice(0, maxSuggestions);

  // Handle keyboard navigation for suggestions
  const { registerContainer } = useKeyboardNavigation({
    onArrowDown: () => {
      setActiveSuggestion(prev => 
        prev < filteredSuggestions.length - 1 ? prev + 1 : prev
      );
    },
    onArrowUp: () => {
      setActiveSuggestion(prev => (prev > 0 ? prev - 1 : 0));
    },
    onEnter: () => {
      if (activeSuggestion >= 0 && activeSuggestion < filteredSuggestions.length) {
        handleSuggestionClick(filteredSuggestions[activeSuggestion]);
      } else {
        handleSearch();
      }
    },
    onEscape: () => {
      setShowSuggestions(false);
    }
  });

  useEffect(() => {
    if (suggestionsRef.current) {
      registerContainer(suggestionsRef.current);
    }
  }, [registerContainer, showSuggestions]);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  useEffect(() => {
    // Reset active suggestion when query changes
    setActiveSuggestion(-1);
    
    // Show suggestions if query is not empty
    setShowSuggestions(query.length > 0);
  }, [query]);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target) &&
          suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = () => {
    if (query.trim()) {
      if (onSearch) {
        onSearch(query);
      } else {
        navigate(`/search?q=${encodeURIComponent(query)}`);
      }
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    navigate(`/blog/${suggestion.slug}`);
    setShowSuggestions(false);
    setQuery('');
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !showSuggestions) {
      handleSearch();
    }
  };

  const handleClear = () => {
    setQuery('');
    inputRef.current.focus();
  };

  const toggleExpand = () => {
    if (expandable) {
      setIsExpanded(!isExpanded);
      if (!isExpanded) {
        setTimeout(() => {
          inputRef.current?.focus();
        }, 100);
      }
    }
  };

  const baseClasses = `relative flex items-center rounded-lg transition-all duration-300 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} ${className}`;
  
  const expandedClasses = expandable
    ? isExpanded
      ? 'w-64 border border-gray-300 shadow-sm'
      : 'w-10 h-10 justify-center'
    : 'w-full border border-gray-300 shadow-sm';

  return (
    <div className="relative">
      <div className={`${baseClasses} ${expandedClasses}`}>
        <button 
          aria-label={isExpanded ? 'Search' : 'Expand search'}
          onClick={isExpanded ? handleSearch : toggleExpand}
          className="flex items-center justify-center p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <Search size={18} />
        </button>
        
        {isExpanded && (
          <>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={() => query && setShowSuggestions(true)}
              placeholder={placeholder}
              className={`flex-grow bg-transparent outline-none px-2 py-2 ${darkMode ? 'placeholder-gray-400' : 'placeholder-gray-500'}`}
              aria-label="Search input"
              aria-expanded={showSuggestions}
              aria-controls="search-suggestions"
              aria-activedescendant={activeSuggestion >= 0 ? `suggestion-${activeSuggestion}` : ''}
            />
            
            {query && (
              <button
                onClick={handleClear}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
            
            {expandable && (
              <button
                onClick={toggleExpand}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                aria-label="Collapse search"
              >
                <X size={16} />
              </button>
            )}
          </>
        )}
      </div>

      {showSuggestions && filteredSuggestions.length > 0 && (
        <div 
          ref={suggestionsRef}
          id="search-suggestions"
          className={`absolute z-50 mt-1 w-full rounded-md shadow-lg ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}
          role="listbox"
        >
          <ul className="py-1 max-h-60 overflow-auto">
            {filteredSuggestions.map((suggestion, index) => (
              <li
                key={suggestion.id}
                id={`suggestion-${index}`}
                role="option"
                aria-selected={index === activeSuggestion}
                className={`px-4 py-2 cursor-pointer flex justify-between items-center ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} ${index === activeSuggestion ? (darkMode ? 'bg-gray-700' : 'bg-gray-100') : ''}`}
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <div>
                  <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {suggestion.title}
                  </div>
                  <div className={`text-sm truncate ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {suggestion.content.substring(0, 60)}...
                  </div>
                </div>
                <ArrowRight size={16} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchBar;