import React from 'react';

/**
 * SkipLink component for keyboard navigation accessibility
 * 
 * This component provides a way for keyboard users to skip navigation
 * and go directly to the main content of the page.
 * 
 * @param {Object} props - Component props
 * @param {string} props.targetId - ID of the target element to skip to (default: 'main-content')
 * @param {string} props.label - Text for the skip link (default: 'Skip to main content')
 * @param {string} props.className - Additional CSS classes
 */
const SkipLink = ({
  targetId = 'main-content',
  label = 'Skip to main content',
  className = '',
}) => {
  return (
    <a
      href={`#${targetId}`}
      className={`skip-link ${className}`}
      style={{
        position: 'absolute',
        top: '-40px',
        left: '0',
        padding: '8px 16px',
        background: 'var(--color-primary-600, #ca8a04)',
        color: 'white',
        zIndex: 9999,
        transition: 'top 0.2s ease',
        textDecoration: 'none',
        fontWeight: 'medium',
        borderRadius: '0 0 4px 0',
        ':focus': {
          top: '0',
          outline: '2px solid var(--color-primary-300, #fde047)',
          outlineOffset: '2px',
        },
      }}
    >
      {label}
    </a>
  );
};

export default SkipLink;