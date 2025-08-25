/**
 * Utility functions for SEO optimization
 */

/**
 * Generates a URL-friendly slug from a string
 * 
 * @param {string} text - The text to convert to a slug
 * @returns {string} - URL-friendly slug
 */
export const generateSlug = (text) => {
  if (!text) return '';
  
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')        // Replace spaces with -
    .replace(/&/g, '-and-')      // Replace & with 'and'
    .replace(/[^\w\-]+/g, '')     // Remove all non-word characters except -
    .replace(/\-\-+/g, '-')       // Replace multiple - with single -
    .replace(/^-+/, '')          // Trim - from start of text
    .replace(/-+$/, '');         // Trim - from end of text
};

/**
 * Truncates text to a specified length without cutting words
 * 
 * @param {string} text - The text to truncate
 * @param {number} maxLength - Maximum length of the truncated text
 * @param {string} suffix - String to append to truncated text (default: '...')
 * @returns {string} - Truncated text
 */
export const truncateText = (text, maxLength, suffix = '...') => {
  if (!text || text.length <= maxLength) return text;
  
  // Find the last space within the maxLength
  const truncated = text.substring(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(' ');
  
  if (lastSpaceIndex === -1) return truncated + suffix;
  
  return truncated.substring(0, lastSpaceIndex) + suffix;
};

/**
 * Extracts plain text from HTML content
 * 
 * @param {string} html - HTML content
 * @returns {string} - Plain text without HTML tags
 */
export const stripHtml = (html) => {
  if (!html) return '';
  
  // Create a temporary DOM element
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  
  // Get the text content
  return tempDiv.textContent || tempDiv.innerText || '';
};

/**
 * Generates meta description from content
 * 
 * @param {string} content - Content to generate description from
 * @param {number} maxLength - Maximum length of description (default: 160)
 * @returns {string} - SEO-friendly meta description
 */
export const generateMetaDescription = (content, maxLength = 160) => {
  if (!content) return '';
  
  // Strip HTML if content contains HTML tags
  const plainText = stripHtml(content);
  
  // Truncate to maxLength
  return truncateText(plainText, maxLength);
};

/**
 * Formats a date for SEO purposes (ISO format)
 * 
 * @param {Date|string} date - Date to format
 * @returns {string} - ISO formatted date string
 */
export const formatSeoDate = (date) => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toISOString();
};

/**
 * Generates canonical URL
 * 
 * @param {string} baseUrl - Base URL of the website
 * @param {string} path - Path to the page
 * @returns {string} - Canonical URL
 */
export const getCanonicalUrl = (baseUrl, path) => {
  // Remove trailing slash from baseUrl if present
  const base = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  
  // Ensure path starts with a slash
  const formattedPath = path.startsWith('/') ? path : `/${path}`;
  
  return `${base}${formattedPath}`;
};

/**
 * Extracts keywords from content
 * 
 * @param {string} content - Content to extract keywords from
 * @param {number} maxKeywords - Maximum number of keywords to extract (default: 10)
 * @returns {string} - Comma-separated keywords
 */
export const extractKeywords = (content, maxKeywords = 10) => {
  if (!content) return '';
  
  // Strip HTML if content contains HTML tags
  const plainText = stripHtml(content);
  
  // Common words to exclude
  const stopWords = new Set([
    'a', 'an', 'the', 'and', 'or', 'but', 'is', 'are', 'was', 'were',
    'in', 'on', 'at', 'to', 'for', 'with', 'by', 'about', 'as', 'of',
    'from', 'this', 'that', 'these', 'those', 'it', 'its', 'they', 'them',
    'their', 'we', 'us', 'our', 'you', 'your', 'he', 'him', 'his', 'she',
    'her', 'hers', 'i', 'me', 'my', 'mine', 'be', 'been', 'being', 'have',
    'has', 'had', 'do', 'does', 'did', 'will', 'would', 'shall', 'should',
    'can', 'could', 'may', 'might', 'must', 'ought', 'not', 'no', 'yes',
  ]);
  
  // Split text into words, filter out stop words, and count occurrences
  const words = plainText.toLowerCase().match(/\b\w+\b/g) || [];
  const wordCounts = {};
  
  words.forEach(word => {
    if (!stopWords.has(word) && word.length > 2) {
      wordCounts[word] = (wordCounts[word] || 0) + 1;
    }
  });
  
  // Sort words by frequency and take top maxKeywords
  const keywords = Object.entries(wordCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxKeywords)
    .map(entry => entry[0]);
  
  return keywords.join(', ');
};