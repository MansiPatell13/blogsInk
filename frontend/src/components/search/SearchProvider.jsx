import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// Create context
const SearchContext = createContext();

// Custom hook to use search context
export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};

// Search provider component
export const SearchProvider = ({ children }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recentSearches, setRecentSearches] = useState([]);
  const [filters, setFilters] = useState({
    tags: [],
    dateRange: null,
    author: null,
    sortBy: 'relevance' // relevance, date, popularity
  });
  
  const location = useLocation();
  const navigate = useNavigate();
  
  // Load recent searches from localStorage on mount
  useEffect(() => {
    const savedSearches = localStorage.getItem('recentSearches');
    if (savedSearches) {
      try {
        setRecentSearches(JSON.parse(savedSearches));
      } catch (e) {
        console.error('Failed to parse recent searches:', e);
        localStorage.removeItem('recentSearches');
      }
    }
  }, []);
  
  // Parse query params on location change
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const queryParam = searchParams.get('q');
    
    if (queryParam && location.pathname === '/search') {
      setQuery(queryParam);
      performSearch(queryParam);
      
      // Parse filters from URL if present
      const tags = searchParams.getAll('tag');
      const sortBy = searchParams.get('sort') || 'relevance';
      const author = searchParams.get('author');
      const fromDate = searchParams.get('from');
      const toDate = searchParams.get('to');
      
      const dateRange = fromDate || toDate ? {
        from: fromDate ? new Date(fromDate) : null,
        to: toDate ? new Date(toDate) : null
      } : null;
      
      setFilters({
        tags,
        sortBy,
        author,
        dateRange
      });
    }
  }, [location]);
  
  // Save recent searches to localStorage
  useEffect(() => {
    if (recentSearches.length > 0) {
      localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
    }
  }, [recentSearches]);
  
  // Add a search to recent searches
  const addToRecentSearches = useCallback((searchQuery) => {
    if (!searchQuery.trim()) return;
    
    setRecentSearches(prev => {
      // Remove duplicates and add to the beginning
      const filtered = prev.filter(item => item.toLowerCase() !== searchQuery.toLowerCase());
      const updated = [searchQuery, ...filtered].slice(0, 10); // Keep only 10 most recent
      return updated;
    });
  }, []);
  
  // Clear recent searches
  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  }, []);
  
  // Perform search
  const performSearch = useCallback(async (searchQuery, searchFilters = filters) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real app, this would be an API call
      // For now, we'll simulate a delay and return mock data
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock search results - in a real app, this would come from an API
      const mockResults = [
        {
          id: '1',
          title: 'Getting Started with React',
          content: 'React is a JavaScript library for building user interfaces. It allows developers to create reusable UI components.',
          excerpt: 'Learn the basics of React and how to create your first component.',
          slug: 'getting-started-with-react',
          publishedAt: '2023-06-15T10:30:00Z',
          author: { name: 'Jane Smith', username: 'janesmith' },
          readTime: 5,
          tags: ['react', 'javascript', 'frontend']
        },
        {
          id: '2',
          title: 'Advanced React Patterns',
          content: 'Explore advanced React patterns like render props, compound components, and hooks to build more flexible and reusable components.',
          slug: 'advanced-react-patterns',
          publishedAt: '2023-07-22T14:15:00Z',
          author: { name: 'John Doe', username: 'johndoe' },
          readTime: 12,
          tags: ['react', 'advanced', 'patterns']
        },
        {
          id: '3',
          title: 'State Management in React',
          content: 'Compare different state management solutions in React including Context API, Redux, Zustand, and Jotai.',
          slug: 'state-management-react',
          publishedAt: '2023-08-05T09:45:00Z',
          author: { name: 'Alex Johnson', username: 'alexj' },
          readTime: 8,
          tags: ['react', 'state-management', 'redux']
        }
      ];
      
      // Filter results based on filters
      let filteredResults = [...mockResults];
      
      // Filter by tags
      if (searchFilters.tags.length > 0) {
        filteredResults = filteredResults.filter(result => 
          result.tags && result.tags.some(tag => 
            searchFilters.tags.includes(tag)
          )
        );
      }
      
      // Filter by author
      if (searchFilters.author) {
        filteredResults = filteredResults.filter(result => 
          result.author && result.author.username === searchFilters.author
        );
      }
      
      // Filter by date range
      if (searchFilters.dateRange) {
        const { from, to } = searchFilters.dateRange;
        
        if (from) {
          filteredResults = filteredResults.filter(result => 
            new Date(result.publishedAt) >= from
          );
        }
        
        if (to) {
          filteredResults = filteredResults.filter(result => 
            new Date(result.publishedAt) <= to
          );
        }
      }
      
      // Sort results
      switch (searchFilters.sortBy) {
        case 'date':
          filteredResults.sort((a, b) => 
            new Date(b.publishedAt) - new Date(a.publishedAt)
          );
          break;
        case 'popularity':
          // In a real app, this would sort by view count or likes
          // For now, we'll just use a random order
          filteredResults.sort(() => Math.random() - 0.5);
          break;
        case 'relevance':
        default:
          // In a real app, this would use a relevance algorithm
          // For now, we'll just filter by query match
          filteredResults.sort((a, b) => {
            const aMatch = (a.title + a.content).toLowerCase().includes(searchQuery.toLowerCase());
            const bMatch = (b.title + b.content).toLowerCase().includes(searchQuery.toLowerCase());
            
            if (aMatch && !bMatch) return -1;
            if (!aMatch && bMatch) return 1;
            return 0;
          });
          break;
      }
      
      setResults(filteredResults);
      addToRecentSearches(searchQuery);
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to perform search. Please try again.');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [filters, addToRecentSearches]);
  
  // Update filters and perform search
  const updateFilters = useCallback((newFilters) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    
    // Update URL with filters
    const searchParams = new URLSearchParams();
    if (query) searchParams.set('q', query);
    
    if (updatedFilters.tags.length > 0) {
      updatedFilters.tags.forEach(tag => searchParams.append('tag', tag));
    }
    
    if (updatedFilters.sortBy !== 'relevance') {
      searchParams.set('sort', updatedFilters.sortBy);
    }
    
    if (updatedFilters.author) {
      searchParams.set('author', updatedFilters.author);
    }
    
    if (updatedFilters.dateRange) {
      if (updatedFilters.dateRange.from) {
        searchParams.set('from', updatedFilters.dateRange.from.toISOString().split('T')[0]);
      }
      
      if (updatedFilters.dateRange.to) {
        searchParams.set('to', updatedFilters.dateRange.to.toISOString().split('T')[0]);
      }
    }
    
    navigate(`/search?${searchParams.toString()}`);
    
    // Perform search with updated filters
    performSearch(query, updatedFilters);
  }, [filters, query, navigate, performSearch]);
  
  // Handle search submission
  const handleSearch = useCallback((searchQuery) => {
    if (!searchQuery.trim()) return;
    
    setQuery(searchQuery);
    
    // Update URL
    const searchParams = new URLSearchParams();
    searchParams.set('q', searchQuery);
    
    // Add existing filters to URL
    if (filters.tags.length > 0) {
      filters.tags.forEach(tag => searchParams.append('tag', tag));
    }
    
    if (filters.sortBy !== 'relevance') {
      searchParams.set('sort', filters.sortBy);
    }
    
    if (filters.author) {
      searchParams.set('author', filters.author);
    }
    
    if (filters.dateRange) {
      if (filters.dateRange.from) {
        searchParams.set('from', filters.dateRange.from.toISOString().split('T')[0]);
      }
      
      if (filters.dateRange.to) {
        searchParams.set('to', filters.dateRange.to.toISOString().split('T')[0]);
      }
    }
    
    navigate(`/search?${searchParams.toString()}`);
    
    // Perform search
    performSearch(searchQuery);
  }, [filters, navigate, performSearch]);
  
  // Reset search
  const resetSearch = useCallback(() => {
    setQuery('');
    setResults([]);
    setFilters({
      tags: [],
      dateRange: null,
      author: null,
      sortBy: 'relevance'
    });
    navigate('/search');
  }, [navigate]);
  
  // Add tag filter
  const addTagFilter = useCallback((tag) => {
    if (!filters.tags.includes(tag)) {
      updateFilters({
        tags: [...filters.tags, tag]
      });
    }
  }, [filters.tags, updateFilters]);
  
  // Remove tag filter
  const removeTagFilter = useCallback((tag) => {
    updateFilters({
      tags: filters.tags.filter(t => t !== tag)
    });
  }, [filters.tags, updateFilters]);
  
  // Context value
  const value = {
    query,
    results,
    isLoading,
    error,
    filters,
    recentSearches,
    handleSearch,
    updateFilters,
    resetSearch,
    addTagFilter,
    removeTagFilter,
    clearRecentSearches
  };
  
  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
};

export default SearchProvider;