import React from 'react';

/**
 * ScreenReaderOnly component for content that should only be visible to screen readers
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Content to be accessible only to screen readers
 * @param {string} props.as - HTML element to render (default: 'span')
 * @param {Object} props.htmlProps - Additional HTML attributes
 */
const ScreenReaderOnly = ({
  children,
  as: Component = 'span',
  ...htmlProps
}) => {
  return (
    <Component
      className="sr-only"
      {...htmlProps}
    >
      {children}
    </Component>
  );
};

export default ScreenReaderOnly;