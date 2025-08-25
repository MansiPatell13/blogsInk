import { useState, useEffect } from 'react';

/**
 * Custom hook for responsive design that detects if a media query matches
 * 
 * @param {string} query - The media query to check (e.g., '(min-width: 768px)')
 * @returns {boolean} - Whether the media query matches
 */
const useMediaQuery = (query) => {
  // Initialize with null to avoid hydration mismatch
  const [matches, setMatches] = useState(false);
  
  useEffect(() => {
    // Set initial value after mount to avoid SSR issues
    const media = window.matchMedia(query);
    setMatches(media.matches);
    
    // Define listener function
    const listener = (event) => {
      setMatches(event.matches);
    };
    
    // Add listener for changes
    media.addEventListener('change', listener);
    
    // Clean up
    return () => {
      media.removeEventListener('change', listener);
    };
  }, [query]);
  
  return matches;
};

// Predefined media query hooks for common breakpoints
export const useIsMobile = () => useMediaQuery('(max-width: 639px)');
export const useIsTablet = () => useMediaQuery('(min-width: 640px) and (max-width: 1023px)');
export const useIsDesktop = () => useMediaQuery('(min-width: 1024px)');
export const useIsLargeDesktop = () => useMediaQuery('(min-width: 1280px)');

export default useMediaQuery;