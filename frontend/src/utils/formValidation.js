/**
 * Form validation utility functions
 */

// Email validation
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return 'Email is required';
  if (!emailRegex.test(email)) return 'Please enter a valid email address';
  return '';
};

// Password validation
export const validatePassword = (password) => {
  if (!password) return 'Password is required';
  if (password.length < 8) return 'Password must be at least 8 characters';
  if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter';
  if (!/[a-z]/.test(password)) return 'Password must contain at least one lowercase letter';
  if (!/[0-9]/.test(password)) return 'Password must contain at least one number';
  if (!/[^A-Za-z0-9]/.test(password)) return 'Password must contain at least one special character';
  return '';
};

// Name validation
export const validateName = (name) => {
  if (!name) return 'Name is required';
  if (name.length < 2) return 'Name must be at least 2 characters';
  if (name.length > 50) return 'Name must be less than 50 characters';
  return '';
};

// Username validation
export const validateUsername = (username) => {
  if (!username) return 'Username is required';
  if (username.length < 3) return 'Username must be at least 3 characters';
  if (username.length > 30) return 'Username must be less than 30 characters';
  if (!/^[a-zA-Z0-9_]+$/.test(username)) return 'Username can only contain letters, numbers, and underscores';
  return '';
};

// Blog title validation
export const validateBlogTitle = (title) => {
  if (!title) return 'Title is required';
  if (title.length < 5) return 'Title must be at least 5 characters';
  if (title.length > 100) return 'Title must be less than 100 characters';
  return '';
};

// Blog content validation
export const validateBlogContent = (content) => {
  if (!content) return 'Content is required';
  if (content.length < 100) return 'Content must be at least 100 characters';
  return '';
};

// URL validation
export const validateUrl = (url) => {
  if (!url) return '';
  try {
    new URL(url);
    return '';
  } catch (e) {
    return 'Please enter a valid URL';
  }
};

// Comment validation
export const validateComment = (comment) => {
  if (!comment) return 'Comment is required';
  if (comment.length < 2) return 'Comment must be at least 2 characters';
  if (comment.length > 1000) return 'Comment must be less than 1000 characters';
  return '';
};